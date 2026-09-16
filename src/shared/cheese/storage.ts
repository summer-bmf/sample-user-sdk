import { isStickerId } from './stickers'

export const STORAGE_KEY = 'seocheese.cheese-book.v1'

/** 저장 스키마 버전. 모양이 바뀌면 이 값과 STORAGE_KEY의 접미사를 함께 올린다(마이그레이션 없음). */
const SCHEMA_VERSION = 1

/** 쓰기 가능 여부를 확인할 때만 잠깐 쓰는 키. 남기지 않는다. */
const PROBE_KEY = 'seocheese.cheese-book.probe'

export type CheeseBook = {
  /** 스티커 id → 보유 개수. 0 이하는 저장하지 않는다. */
  counts: Record<string, number>
  lastFoundAt: number | null
}

export const EMPTY_BOOK: CheeseBook = Object.freeze({ counts: Object.freeze({}), lastFoundAt: null })

/**
 * localStorage를 못 쓰는 환경(사파리 프라이빗, 용량 초과)의 폴백.
 * 번들마다 갈라지지만, 그 환경은 어차피 지속성이 없으므로 허용한다.
 */
let memoryBook: CheeseBook | null = null
let usingMemory = false

/**
 * 이 함수로 UI를 분기하지 말 것 — 템플릿마다 번들이 갈라져서, 쓰기를 하지 않는
 * 페이지 번들에서는 항상 false다. 저장 가능 여부로 UI를 갈라야 하면 `isStorageWritable()`을 쓸 것.
 */
export function isMemoryFallback(): boolean {
  return usingMemory
}

/** 테스트 전용 — 모듈 전역 폴백 상태를 초기화한다. */
export function resetStorageStateForTests(): void {
  memoryBook = null
  usingMemory = false
}

function getStore(): Storage | null {
  try {
    return window.localStorage
  } catch {
    // 쿠키·스토리지가 차단된 환경에서는 접근 자체가 던진다.
    return null
  }
}

function parseBook(raw: string): CheeseBook {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return EMPTY_BOOK
  }

  if (typeof data !== 'object' || data === null) return EMPTY_BOOK
  const record = data as Record<string, unknown>
  if (record.v !== SCHEMA_VERSION) return EMPTY_BOOK

  const counts: Record<string, number> = {}
  const rawCounts = record.counts
  if (typeof rawCounts === 'object' && rawCounts !== null) {
    for (const [id, value] of Object.entries(rawCounts as Record<string, unknown>)) {
      if (!isStickerId(id)) continue
      if (typeof value !== 'number' || !Number.isFinite(value)) continue
      const count = Math.floor(value)
      if (count > 0) counts[id] = count
    }
  }

  const lastFoundAt = typeof record.lastFoundAt === 'number' ? record.lastFoundAt : null
  return { counts, lastFoundAt }
}

export function readBook(): CheeseBook {
  if (usingMemory) return memoryBook ?? EMPTY_BOOK

  const store = getStore()
  if (!store) return EMPTY_BOOK

  let raw: string | null
  try {
    raw = store.getItem(STORAGE_KEY)
  } catch {
    return EMPTY_BOOK
  }

  if (!raw) return EMPTY_BOOK
  return parseBook(raw)
}

export function writeBook(book: CheeseBook): void {
  if (!usingMemory) {
    const store = getStore()
    if (store) {
      try {
        store.setItem(
          STORAGE_KEY,
          JSON.stringify({ v: SCHEMA_VERSION, counts: book.counts, lastFoundAt: book.lastFoundAt }),
        )
        return
      } catch {
        // 용량 초과 등 — 아래 메모리 폴백으로 내려간다.
      }
    }
  }

  usingMemory = true
  memoryBook = book
}

/**
 * localStorage에 실제로 쓸 수 있는지 탐침으로 확인한다.
 *
 * `isMemoryFallback()`은 "이 번들이 쓰기에 실패한 적 있는가"라서, 쓰기를 한 번도 하지 않는
 * 도감 페이지에서는 항상 false다. 페이지가 "저장이 안 되는 브라우저"를 알아내려면 이 함수가 필요하다.
 */
export function isStorageWritable(): boolean {
  const store = getStore()
  if (!store) return false
  try {
    store.setItem(PROBE_KEY, '1')
    store.removeItem(PROBE_KEY)
    return true
  } catch {
    return false
  }
}

export function clearBook(): void {
  memoryBook = null
  const store = getStore()
  if (!store) return
  try {
    store.removeItem(STORAGE_KEY)
  } catch {
    // 지우지 못해도 할 수 있는 게 없다.
  }
}

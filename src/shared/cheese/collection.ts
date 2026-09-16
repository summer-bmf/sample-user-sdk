import { STICKER_IDS } from './stickers'
import { clearBook, readBook, STORAGE_KEY, writeBook, type CheeseBook } from './storage'

/**
 * 수집 변경을 같은 탭에 알리는 이벤트.
 * 템플릿마다 번들이 갈라져 모듈 전역을 공유할 수 없으므로 window 이벤트가 유일한 통로다.
 */
export const CHANGE_EVENT = 'seocheese:cheese-book:changed'

export type CollectResult = {
  /** 이번 획득 이후 이 종류의 보유 개수. */
  count: number
  /** 처음 모은 종류인지. */
  isNew: boolean
}

function notifyChange(): void {
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function collect(id: string, now: number = Date.now()): CollectResult {
  const book = readBook()
  const previous = book.counts[id] ?? 0
  writeBook({
    counts: { ...book.counts, [id]: previous + 1 },
    lastFoundAt: now,
  })
  notifyChange()
  return { count: previous + 1, isNew: previous === 0 }
}

export function resetCollection(): void {
  clearBook()
  notifyChange()
}

/** 같은 탭(다른 번들 포함)과 다른 탭의 변경을 모두 구독한다. 해제 함수를 돌려준다. */
export function subscribe(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    // key가 null이면 localStorage.clear()다 — 우리 키도 날아갔을 수 있으니 다시 읽는다.
    if (event.key === null || event.key === STORAGE_KEY) listener()
  }
  window.addEventListener(CHANGE_EVENT, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener)
    window.removeEventListener('storage', onStorage)
  }
}

export type BookSummary = {
  collectedTypes: number
  totalTypes: number
  totalCount: number
}

export function summarize(book: CheeseBook): BookSummary {
  let collectedTypes = 0
  let totalCount = 0
  for (const id of STICKER_IDS) {
    const count = book.counts[id] ?? 0
    if (count > 0) {
      collectedTypes += 1
      totalCount += count
    }
  }
  return { collectedTypes, totalTypes: STICKER_IDS.length, totalCount }
}

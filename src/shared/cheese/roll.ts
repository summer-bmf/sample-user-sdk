import { STICKERS, type Sticker } from './stickers'
import type { DebugMode } from './debug'

/** 페이지를 열 때 스티커가 등장할 확률. */
export const APPEAR_RATE = 0.4

/**
 * 스티커를 놓을 수 있는 화면 영역(뷰포트 %).
 * 위아래를 넉넉히 비워 플랫폼 헤더와 하단 네비를 피한다.
 */
export const SAFE_AREA = {
  minLeft: 8,
  maxLeft: 85,
  minTop: 15,
  maxTop: 80,
  maxRotate: 12,
}

export type StickerPlacement = {
  /** 뷰포트 왼쪽에서의 위치(%). */
  left: number
  /** 뷰포트 위에서의 위치(%). */
  top: number
  /** 기울기(deg). */
  rotate: number
}

export type RollResult = { sticker: Sticker; placement: StickerPlacement } | null

export type RollOptions = {
  /** 테스트에서 갈아끼우는 난수원. */
  rng?: () => number
  /** 디버그 플래그로 확률을 강제할 때. */
  force?: DebugMode
}

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t
}

/**
 * 이번 마운트에 스티커를 띄울지, 어떤 종을 어디에 놓을지 한 번에 정한다.
 * 순수 함수라 rng만 고정하면 결과가 결정적이다.
 */
export function roll(options: RollOptions = {}): RollResult {
  const rng = options.rng ?? Math.random
  const force = options.force ?? null

  if (force === 'never') return null
  if (force !== 'always' && rng() >= APPEAR_RATE) return null

  // rng가 정확히 1을 돌려줘도 마지막 종을 가리키도록 막는다.
  const index = Math.min(STICKERS.length - 1, Math.floor(rng() * STICKERS.length))
  const sticker = STICKERS[index]

  return {
    sticker,
    placement: {
      left: lerp(SAFE_AREA.minLeft, SAFE_AREA.maxLeft, rng()),
      top: lerp(SAFE_AREA.minTop, SAFE_AREA.maxTop, rng()),
      rotate: lerp(-SAFE_AREA.maxRotate, SAFE_AREA.maxRotate, rng()),
    },
  }
}

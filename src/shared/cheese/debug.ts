/**
 * 등장 확률을 강제하는 디버그 플래그.
 *
 * 40% 확률은 눈으로 검증하기 어려워, 개발·QA가 localStorage에 값을 넣어 고정할 수 있게 한다.
 * 유저가 직접 값을 넣기 전에는 아무 영향이 없다.
 */
export const DEBUG_KEY = 'seocheese.cheese-book.debug'

export type DebugMode = 'always' | 'never' | null

export function readDebugMode(): DebugMode {
  try {
    const value = window.localStorage.getItem(DEBUG_KEY)
    return value === 'always' || value === 'never' ? value : null
  } catch {
    return null
  }
}

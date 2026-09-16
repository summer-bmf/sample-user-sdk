/** 치즈 스티커 한 종의 정의. */
export type Sticker = {
  /** 저장 키로 쓰이는 식별자. 한번 정하면 바꾸지 않는다 — 바꾸면 유저 수집 기록이 날아간다. */
  id: string
  emoji: string
  name: string
  description: string
}

export const STICKERS: readonly Sticker[] = [
  { id: 'cheddar', emoji: '🧀', name: '체더 치즈', description: '모든 치즈의 기본기' },
  { id: 'pizza', emoji: '🍕', name: '피자 치즈', description: '늘어나는 게 매력' },
  { id: 'cake', emoji: '🍰', name: '치즈 케이크', description: '디저트계의 치즈' },
  { id: 'sandwich', emoji: '🥪', name: '그릴드 치즈', description: '눌러 구운 고소함' },
  { id: 'butter', emoji: '🧈', name: '버터', description: '치즈의 사촌' },
  { id: 'milk', emoji: '🥛', name: '우유', description: '모든 치즈의 시작' },
  { id: 'mouse', emoji: '🐭', name: '생쥐', description: '치즈를 노리는 손님' },
  { id: 'moon', emoji: '🌙', name: '달 치즈', description: '달은 치즈로 만들어졌대요' },
]

export const STICKER_IDS: readonly string[] = STICKERS.map((sticker) => sticker.id)

export function isStickerId(id: string): boolean {
  return STICKERS.some((sticker) => sticker.id === id)
}

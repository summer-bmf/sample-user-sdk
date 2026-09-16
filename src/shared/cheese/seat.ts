/**
 * 한 화면에 스티커가 하나만 뜨게 하는 좌석.
 *
 * 같은 페이지에 이 위젯이 둘 이상 배치될 수 있는데, 템플릿마다 번들이 갈라져
 * 모듈 전역을 공유하지 못한다. 그래서 window에 플래그를 둔다.
 */
type SeatWindow = Window & { __seocheeseCheeseStickerSeat?: boolean }

export function takeSeat(): boolean {
  const seatWindow = window as SeatWindow
  if (seatWindow.__seocheeseCheeseStickerSeat) return false
  seatWindow.__seocheeseCheeseStickerSeat = true
  return true
}

export function releaseSeat(): void {
  ;(window as SeatWindow).__seocheeseCheeseStickerSeat = false
}

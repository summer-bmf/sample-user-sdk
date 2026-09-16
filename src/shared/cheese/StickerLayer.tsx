import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { useNavigation } from '@bstage-sdk/react'
import { cssVar, textStyle } from '@bstage-sdk/design/user'
import { collect, summarize, type CollectResult } from './collection'
import { readDebugMode } from './debug'
import { roll, type RollResult } from './roll'
import { releaseSeat, takeSeat } from './seat'
import { readBook } from './storage'
import { CHEESE_BOOK_PATH, LAYER_CSS } from './styles'

/** 발견 모달이 보여줄 값 — 이번 획득 결과와, 획득 직후의 도감 진행. */
type FoundState = CollectResult & { collectedTypes: number; totalTypes: number }

/**
 * 랜덤 치즈 스티커 한 개와 발견 모달.
 *
 * 슬롯 위젯 6개가 모두 이 컴포넌트 하나를 렌더한다.
 * 스티커와 모달은 포털로 document.body에 그린다 — Shadow DOM 안에서는 조상에
 * transform/filter/contain이 있으면 position:fixed가 뷰포트 기준이 아니게 되고,
 * 모달 딤도 화면 전체를 덮지 못한다.
 */
export default function StickerLayer(): ReactElement | null {
  // 마운트당 한 번만 굴린다. useState의 lazy initializer는 마운트당 한 번만 값을 확정하므로
  // StrictMode의 두 번째 렌더(개발 모드에서 초기화 함수를 한 번 더 호출)에도 같은 결과가 쓰인다.
  // (useRef에 굴린 값을 담아 렌더에서 읽는 방식은 최신 react-hooks 린트 규칙이
  // "렌더 중 ref 접근"으로 막는다 — ref는 초기화 여부 확인에만 쓰라는 규칙이다.)
  const [rolled] = useState<RollResult>(() => roll({ force: readDebugMode() }))

  const [seated, setSeated] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [found, setFound] = useState<FoundState | null>(null)
  // DOM 순서대로 — 주 버튼(CTA)이 먼저, 조용한 닫기가 나중이다. 포커스 트랩이 이 순서를 쓴다.
  const ctaRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { navigate } = useNavigation()

  // 화면에 스티커가 하나만 뜨도록 좌석을 잡는다. 못 잡으면 아무것도 그리지 않는다.
  useEffect(() => {
    if (!rolled) return
    if (!takeSeat()) return
    // 좌석 획득은 window 전역을 건드리는 일회성 결과라 구독형 콜백으로 감쌀 외부 이벤트가 없다.
    // 렌더에 곧바로 반영해야 하므로 이 한 줄만 규칙을 억제한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeated(true)
    return () => {
      releaseSeat()
      setSeated(false)
    }
  }, [rolled])

  const modalOpen = found !== null

  // 모달이 열린 동안 배경 스크롤을 잠근다.
  useEffect(() => {
    if (!modalOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [modalOpen])

  // 열릴 때는 되돌릴 수 없는 쪽이 아니라 닫기에 포커스를 준다 — Enter가 곧바로
  // 페이지를 이동시키지 않게.
  useEffect(() => {
    if (modalOpen) closeRef.current?.focus()
  }, [modalOpen])

  const close = useCallback(() => {
    setFound(null)
    setDismissed(true)
  }, [])

  // ESC는 document 레벨에서 잡는다 — 카드의 포커스 불가 영역(제목·스티커 원·설명 텍스트)을
  // 클릭하면 포커스가 body로 빠져나가는데, 그때도 ESC로 닫혀야 한다.
  useEffect(() => {
    if (!modalOpen) return
    const onEsc = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [modalOpen, close])

  // Tab만 다룬다 — 포커스가 카드 서브트리 안에 있을 때만 의미가 있어 딤 div에 그대로 둔다.
  const onTabKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    // 버튼 두 개 사이에서만 포커스가 돌게 가둔다.
    const first = ctaRef.current
    const last = closeRef.current
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }, [])

  if (!rolled || !seated || dismissed) return null

  const { sticker, placement } = rolled

  return createPortal(
    <>
      <style>{LAYER_CSS}</style>

      {!modalOpen && (
        <button
          type="button"
          className="scb-sticker"
          style={{
            left: `${placement.left}%`,
            top: `${placement.top}%`,
            rotate: `${placement.rotate}deg`,
          }}
          aria-label="치즈 스티커 발견 — 눌러서 모으기"
          // 수집은 클릭 순간에 확정한다. 모달을 닫지 않고 떠나도 기록이 남는다.
          // found가 이미 있으면 무시 — 같은 프레임 안의 두 번째 클릭(빠른 더블클릭,
          // 포커스된 버튼에서 Enter 반복)이 한 종을 +2로 만드는 걸 막는다.
          onClick={() => {
            if (found) return
            const result = collect(sticker.id)
            // 획득 직후의 도감 진행을 한 번만 읽어 담는다 — 모달이 보여줄 스냅샷이라
            // 구독(useCheeseBook)까지 걸 필요가 없다.
            const { collectedTypes, totalTypes } = summarize(readBook())
            setFound({ ...result, collectedTypes, totalTypes })
          }}
        >
          <span aria-hidden="true">{sticker.emoji}</span>
        </button>
      )}

      {modalOpen && (
        <div
          className="scb-dim"
          role="presentation"
          onKeyDown={onTabKeyDown}
          onClick={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <div className="scb-card" role="dialog" aria-modal="true" aria-label="스티커를 찾았어요">
            <div className="scb-card-sticker">
              <span aria-hidden="true">{sticker.emoji}</span>
            </div>
            <p style={{ ...textStyle('18/title/med'), margin: '0 0 6px' }}>
              <span aria-hidden="true">🧀</span> 스티커를 찾았네요!
            </p>
            <p style={{ ...textStyle('15/title/med'), margin: '0 0 2px' }}>{sticker.name}</p>
            <p style={{ ...textStyle('13/body/reg'), margin: 0, color: cssVar('text/tertiary') }}>
              {sticker.description}
            </p>
            {/* 도감의 통계 타일과 같은 문법 — 수집 상태를 문장에서 떼어내 숫자로 보여준다. */}
            <div className="scb-mtiles">
              <div className="scb-mtile">
                <span className="scb-mtile-label" style={textStyle('12/caption/reg')}>
                  {found.isNew ? '처음 모은 치즈' : '이 치즈'}
                </span>
                <span className="scb-mtile-value" style={textStyle('18/title/semibold')}>
                  {found.count}개
                </span>
              </div>
              <div className="scb-mtile">
                <span className="scb-mtile-label" style={textStyle('12/caption/reg')}>
                  모은 종류
                </span>
                <span className="scb-mtile-value" style={textStyle('18/title/semibold')}>
                  {found.collectedTypes}/{found.totalTypes}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="scb-cta"
              ref={ctaRef}
              onClick={() => navigate(CHEESE_BOOK_PATH)}
            >
              모은 치즈 보러가기
            </button>
            <button type="button" className="scb-quiet" ref={closeRef} onClick={close}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>,
    document.body,
  )
}

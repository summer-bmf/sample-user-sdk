/**
 * 샘플 — 스티커 도감 페이지 (SDK · USER)
 *
 * 원작: 치즈(seocheese) — cheese-portal-showcase. 동의를 받아 샘플로 옮겨 왔습니다.
 *
 * src/slots/ 의 스티커 위젯에서 "모은 치즈 보러가기"를 누르면 이 페이지로 옵니다.
 * 슬롯 위젯과 커스텀 페이지를 하나로 엮는 예제입니다.
 */
import { useState } from 'react'
import { createTemplate } from '@bstage-sdk/react'
import { cssVar, textStyle } from '@bstage-sdk/design/user'
import { resetCollection, summarize } from '../../shared/cheese/collection'
import { isStorageWritable } from '../../shared/cheese/storage'
import { STICKERS } from '../../shared/cheese/stickers'
import { useCheeseBook } from '../../shared/cheese/useCollection'
import { cheeseRing, RADIUS } from '../../shared/cheese/styles'

/**
 * 히어로 배너 사진.
 *
 * seocheese 스페이스의 스토리 피드 게시물 이미지를 2:1(900×450, q70)로 크롭해 받아둔
 * 파일이다. CDN 주소를 그대로 박지 않는 이유는 그 주소가 sandbox 호스트에 묶여 있고,
 * 자산 경로도 그 스페이스의 업로드에 묶여 있어 다른 환경에서는 살아 있으리란 보장이
 * 없기 때문이다 — 호스트만 바꿔서는 해결되지 않는다.
 *
 * `?inline`은 Vite가 이 파일을 data URI로 번들에 넣게 한다. 이게 필요한 이유는
 * 빌드가 `template.js` 하나만 최종 위치로 옮기기 때문이다 — 별도 에셋으로 나가면
 * 배포 산출물에서 조용히 사라진다(CSS 파일이 사라지는 것과 같은 이유).
 */
import HERO_IMAGE from './hero.jpg?inline'

// Shadow DOM에 넣을 스타일. CSS 파일을 import하면 배포 산출물에서 사라지므로 문자열로 둔다.
const PAGE_CSS = `
.scb-page { box-sizing: border-box; max-width: 560px; margin: 0 auto; padding: 20px; }

/* ── 히어로 ───────────────────────────────────────────── */
.scb-hero {
  position: relative;
  box-sizing: border-box;
  aspect-ratio: 2 / 1;
  border-radius: ${RADIUS.panel};
  overflow: hidden;
  background-color: ${cssVar('bg/grouped-weak')};
  background-image: url("${HERO_IMAGE}");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}
/* 사진 위 라벨이 어떤 사진에서도 읽히도록 아래쪽만 어둡게 깐다. */
.scb-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, ${cssVar('always/black080-a')} 0%, ${cssVar('always/black020-a')} 45%, transparent 75%);
}
.scb-hero > * { position: relative; }
.scb-hero-label {
  align-self: flex-start;
  margin: 0;
  padding: 3px 8px;
  border: 1px solid ${cssVar('always/white100')};
  color: ${cssVar('always/white100')};
  letter-spacing: 0.08em;
}
.scb-hero-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 5px 12px;
  border-radius: ${RADIUS.pill};
  background: ${cssVar('always/black060-a')};
  color: ${cssVar('always/white100')};
}

/* ── 통계 타일 ────────────────────────────────────────── */
.scb-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }
.scb-tile {
  box-sizing: border-box;
  padding: 14px;
  border-radius: ${RADIUS.panel};
  background: ${cssVar('bg/grouped-weak-a')};
}
.scb-tile-label { display: block; color: ${cssVar('text/tertiary')}; }
.scb-tile-value { display: block; margin-top: 6px; color: ${cssVar('text/primary')}; }

/* ── 도감 카드 ────────────────────────────────────────── */
.scb-card {
  box-sizing: border-box;
  margin-top: 12px;
  padding: 20px 16px;
  border: 1px solid ${cssVar('border/weak-a')};
  border-radius: ${RADIUS.panel};
  background: ${cssVar('surface/card')};
}
.scb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px 8px; }
.scb-slot { display: flex; flex-direction: column; align-items: center; gap: 8px; }
/* 화면에 뜨는 스티커와 같은 정의를 공유한다 — 두 DOM 트리가 스타일시트는
   못 나누지만, CSS를 만들어내는 함수는 나눌 수 있다. */
.scb-slot-circle {${cheeseRing(56, 26, 3)}
}
/* 미수집은 앰버 신호를 걷어내고 평평한 회색 원으로 되돌린다. */
.scb-slot-locked .scb-slot-circle {
  border-color: transparent;
  background: ${cssVar('bg/grouped-weak-a')};
  box-shadow: none;
}
.scb-slot-locked .scb-slot-emoji { filter: grayscale(1); opacity: 0.3; }
.scb-slot-name { text-align: center; color: ${cssVar('text/primary')}; }
.scb-slot-locked .scb-slot-name { color: ${cssVar('text/quaternary')}; }
.scb-slot-count { color: ${cssVar('text/tertiary')}; }

/* ── 하단 상태 바 ─────────────────────────────────────── */
.scb-status {
  box-sizing: border-box;
  margin-top: 12px;
  padding: 16px;
  border-radius: ${RADIUS.panel};
  background: ${cssVar('bg/grouped-weak-a')};
  color: ${cssVar('text/secondary')};
  text-align: center;
}
.scb-status-done {
  background: ${cssVar('surface/form-yellow')};
  color: ${cssVar('always/black100')};
}

.scb-note { margin: 12px 0 0; text-align: center; color: ${cssVar('text/tertiary')}; }
.scb-reset {
  display: block;
  margin: 20px auto 0;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: ${cssVar('text/quaternary')};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.scb-reset:focus-visible { outline: 3px solid ${cssVar('border/blue')}; outline-offset: 2px; }
.scb-confirm { display: flex; gap: 8px; align-items: center; justify-content: center; margin-top: 20px; }
`

export default function CheeseBookPage() {
  const book = useCheeseBook()
  const { collectedTypes, totalTypes, totalCount } = summarize(book)
  const [confirming, setConfirming] = useState(false)
  // 탐침이 localStorage에 실제로 써보므로 렌더마다 부르지 않고 최초 1회만 판정한다.
  const [storageWritable] = useState(() => isStorageWritable())
  const complete = collectedTypes === totalTypes

  return (
    <div className="scb-page" style={{ color: cssVar('text/primary') }}>
      <style>{PAGE_CSS}</style>

      <div className="scb-hero">
        <span className="scb-hero-badge" style={textStyle('12/caption/med')}>
          {collectedTypes}/{totalTypes}
        </span>
        {/* 화면에 보이는 문구는 이 라벨 하나뿐이지만, 페이지에 제목이 아예 없어지지
            않도록 h1으로 둔다 — 스크린리더와 문서 구조가 이걸 제목으로 읽는다. */}
        <h1 className="scb-hero-label" style={textStyle('10/caption/med')}>
          CHEESE COLLECTION
        </h1>
      </div>

      <div className="scb-tiles">
        <div className="scb-tile">
          <span className="scb-tile-label" style={textStyle('12/caption/reg')}>
            모은 종류
          </span>
          <span className="scb-tile-value" style={textStyle('20/title/semibold')}>
            {collectedTypes}종
          </span>
        </div>
        <div className="scb-tile">
          <span className="scb-tile-label" style={textStyle('12/caption/reg')}>
            총 개수
          </span>
          <span className="scb-tile-value" style={textStyle('20/title/semibold')}>
            {totalCount}개
          </span>
        </div>
        <div className="scb-tile">
          <span className="scb-tile-label" style={textStyle('12/caption/reg')}>
            남은 종류
          </span>
          <span className="scb-tile-value" style={textStyle('20/title/semibold')}>
            {totalTypes - collectedTypes}종
          </span>
        </div>
      </div>

      <div className="scb-card">
        <div className="scb-grid">
          {STICKERS.map((sticker) => {
            const count = book.counts[sticker.id] ?? 0
            const owned = count > 0
            return (
              <div key={sticker.id} className={owned ? 'scb-slot' : 'scb-slot scb-slot-locked'}>
                <div className="scb-slot-circle">
                  <span className="scb-slot-emoji" aria-hidden="true">
                    {sticker.emoji}
                  </span>
                </div>
                <span className="scb-slot-name" style={textStyle('12/caption/med')}>
                  {owned ? sticker.name : '???'}
                </span>
                <span className="scb-slot-count" style={textStyle('10/caption/reg')}>
                  {owned ? `x${count}` : '미수집'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div
        className={complete ? 'scb-status scb-status-done' : 'scb-status'}
        style={textStyle('15/title/med')}
      >
        {complete
          ? `🎉 ${totalTypes}종을 모두 모았어요 · 치즈 마스터!`
          : `${totalTypes}종 중 ${collectedTypes}종 모았어요`}
      </div>

      {!storageWritable && (
        <p className="scb-note" style={textStyle('12/caption/reg')}>
          이 브라우저에서는 기록이 저장되지 않아요. 새로고침하면 처음부터 시작합니다.
        </p>
      )}

      {confirming ? (
        <div className="scb-confirm">
          <span style={{ ...textStyle('13/body/reg'), color: cssVar('text/tertiary') }}>
            모은 치즈가 모두 사라져요.
          </span>
          <button
            type="button"
            className="scb-reset"
            style={{ ...textStyle('13/body/med'), margin: 0, color: cssVar('text/red') }}
            onClick={() => {
              resetCollection()
              setConfirming(false)
            }}
          >
            지우기
          </button>
          <button
            type="button"
            className="scb-reset"
            style={{ ...textStyle('13/body/med'), margin: 0 }}
            onClick={() => setConfirming(false)}
          >
            취소
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="scb-reset"
          style={textStyle('13/body/reg')}
          onClick={() => setConfirming(true)}
        >
          도감 초기화
        </button>
      )}
    </div>
  )
}

createTemplate(CheeseBookPage, {
  name: 'sample-cheese-book',
})

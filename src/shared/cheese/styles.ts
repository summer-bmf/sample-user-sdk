import { cssVar, shadow, textStyle } from '@bstage-sdk/design/user'

/**
 * 도감 페이지 경로.
 *
 * 배포에서는 `src/pages/cheese-book/` 폴더 구조가 그대로 경로가 된다.
 * 로컬 dev의 미리보기(App.tsx)는 `src/` 아래 경로를 그대로 쓰므로 `/pages/cheese-book`이다.
 */
export const CHEESE_BOOK_PATH = import.meta.env.DEV ? '/pages/cheese-book' : '/cheese-book'

/**
 * 모서리 반경 스케일.
 *
 * SDK에는 radius 토큰이 없어(DESIGN_TOKENS.md) 프로젝트가 스케일을 정해야 한다.
 * 이 기능의 모든 면은 둘 중 하나다 — 알약(칩·진행바·배지) 아니면 12px 패널
 * (히어로·타일·카드·모달·배너·상태 바). 값을 늘리기 전에 정말 세 번째 단계가
 * 필요한지 먼저 의심할 것.
 */
export const RADIUS = {
  pill: '9999px',
  panel: '12px',
}

/** 스티커 지름(px). */
export const STICKER_SIZE = 56

/**
 * "치즈다"를 알리는 원의 공통 표현.
 *
 * 도감의 수집한 칸과 화면에 뜨는 스티커가 같은 모양이어야 한다 — 주운 그 원이
 * 도감에 그대로 꽂히는 연결이 이 기능의 보상감이다.
 * 앰버 링은 밝은 배경에서, 그 밖의 흰 헤일로는 어두운 배경에서 각각 원을 떼어낸다.
 * 흰색은 테마와 무관하게 고정된 die-cut 테두리라 `always/white100`을 쓴다.
 */
export function cheeseRing(size: number, emojiSize: number, haloWidth: number): string {
  return `
  box-sizing: border-box;
  width: ${size}px;
  height: ${size}px;
  border: 2px solid ${cssVar('surface/form-yellow')};
  border-radius: 50%;
  background: ${cssVar('surface/form-yellow-weak-a')};
  box-shadow: 0 0 0 ${haloWidth}px ${cssVar('always/white100')}, ${shadow['weak-medium']};
  font-size: ${emojiSize}px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;`
}

/**
 * 타이포 토큰을 CSS 선언으로 옮긴다.
 *
 * `textStyle()`은 인라인 스타일용 객체를 돌려주므로 CSS 문자열에 그대로 넣을 수 없다.
 * `letterSpacing`은 토큰이 `0%`처럼 퍼센트로 주는데 letter-spacing에 퍼센트는 유효하지
 * 않아 브라우저가 버리므로 옮기지 않는다 — 인라인 스타일에서도 같은 이유로 무시된다.
 */
function typo(token: Parameters<typeof textStyle>[0]): string {
  const style = textStyle(token)
  return `font-size: ${style.fontSize}; line-height: ${style.lineHeight}; font-weight: ${style.fontWeight};`
}

/**
 * 포털(document.body)에 그리는 레이어의 CSS.
 *
 * Shadow DOM 밖이라 전역과 섞이므로 모든 클래스에 `scb-` 접두를 붙인다.
 * 색·타이포·그림자는 디자인 토큰(:root의 CSS 변수)만 쓴다.
 */
export const LAYER_CSS = `
.scb-sticker {
  position: fixed;
  z-index: 9998;
  padding: 0;
  cursor: pointer;
  ${cheeseRing(STICKER_SIZE, 28, 3)}
  animation: scb-pop 320ms cubic-bezier(0.2, 1.2, 0.4, 1) both, scb-float 5s ease-in-out 320ms infinite;
}
/* 오버레이 토큰은 배경색 "위에" 얹어야 한다 — background에 색을 두 개 쓰는 건 유효한 CSS가 아니다. */
.scb-sticker:hover {
  background-image: linear-gradient(${cssVar('overlay/hover-a')}, ${cssVar('overlay/hover-a')});
}
/* scale은 transform과 별개 프로퍼티다. transform을 쓰면 위 scb-pop 애니메이션(fill: both)에 덮인다. */
.scb-sticker:active {
  background-image: linear-gradient(${cssVar('overlay/press-a')}, ${cssVar('overlay/press-a')});
  scale: 0.94;
}
.scb-sticker:focus-visible { outline: 3px solid ${cssVar('border/blue')}; outline-offset: 5px; }

@keyframes scb-pop {
  0% { transform: scale(0.6); opacity: 0; }
  70% { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes scb-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -4px; }
}

.scb-dim {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: ${cssVar('always/black050-a')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.scb-card {
  /* 포털이 document.body에 붙으므로 호스트의 전역 리셋을 기대할 수 없다 —
     border-box를 직접 선언하지 않으면 padding이 max-width 밖으로 더해져 카드가 넓어진다. */
  box-sizing: border-box;
  width: 100%;
  max-width: 320px;
  border: 1px solid ${cssVar('border/weak-a')};
  border-radius: ${RADIUS.panel};
  background: ${cssVar('surface/card')};
  color: ${cssVar('text/primary')};
  box-shadow: ${shadow['weak-large']};
  padding: 24px 20px 20px;
  text-align: center;
  animation: scb-pop 260ms cubic-bezier(0.2, 1.2, 0.4, 1) both;
}
.scb-card-sticker {
  margin: 0 auto 16px;
  ${cheeseRing(88, 42, 4)}
}

/* 도감의 통계 타일과 같은 문법 — 작은 회색 라벨 위, 큰 숫자 아래. */
.scb-mtiles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 16px; }
.scb-mtile {
  box-sizing: border-box;
  padding: 12px;
  border-radius: ${RADIUS.panel};
  background: ${cssVar('bg/grouped-weak-a')};
}
.scb-mtile-label { display: block; color: ${cssVar('text/tertiary')}; }
.scb-mtile-value { display: block; margin-top: 4px; color: ${cssVar('text/primary')}; }

/* 레퍼런스의 하단 CTA 바 — 풀폭 주 버튼, 그 아래 조용한 텍스트 버튼. */
.scb-cta {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 48px;
  margin-top: 16px;
  padding: 0 16px;
  border: 0;
  border-radius: ${RADIUS.panel};
  background: ${cssVar('text/primary')};
  color: ${cssVar('bg/base')};
  cursor: pointer;
  ${typo('15/title/med')}
}
.scb-quiet {
  display: block;
  margin: 4px auto 0;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: ${cssVar('text/quaternary')};
  cursor: pointer;
  ${typo('13/body/reg')}
}
.scb-cta:focus-visible, .scb-quiet:focus-visible {
  outline: 3px solid ${cssVar('border/blue')};
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .scb-sticker, .scb-card { animation: none; }
}
`

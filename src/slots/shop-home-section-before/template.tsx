/**
 * 샘플 — 상점 홈 섹션 위 위젯 (SDK 슬롯 · USER)
 *
 * 슬롯 위젯은 페이지 전체가 아니라, 플랫폼 화면 "사이"에 끼워 넣는 조각입니다.
 *
 * 폴더 이름은 사람이 알아보기 위한 것일 뿐 배치와 무관합니다.
 * 어느 자리에 붙을지는 아래 createTemplate 의 slot 옵션만 정합니다.
 *   slot: 'user.shop-home.section:before'  →  상점 홈의 섹션 묶음 위
 *
 * 이 자리는 호스트가 넘겨주는 context 가 없습니다(카탈로그의 context 칸이 '—').
 * context 를 주는 자리에서는 useSlotContext 로 받아 씁니다. 예:
 *   const { content } = useSlotContext<'user.contents-detail.body:after'>()
 *
 * 쓸 수 있는 자리 전체 목록: `npx bstage docs` → SLOT_CATALOG_V2.md
 *
 * 외부 API를 부르지 않습니다 — 어느 스테이지에 올려도 그대로 렌더됩니다.
 */
import { createTemplate } from '@bstage-sdk/react'
import { cssVar, fontFamily, textStyle } from '@bstage-sdk/design/user'

// 위젯이 보여줄 내용 (서버 없이 동작하도록 파일 안에 둡니다)
const NOTICE = {
  badge: 'NOTICE',
  title: '이 자리에 원하는 안내를 띄울 수 있어요',
  body: '상점 홈의 섹션 묶음 바로 위에 붙는 위젯입니다. 공지·이벤트 배너·추천 영역처럼 화면 맨 위에서 먼저 보여주고 싶은 내용을 넣기 좋습니다.',
}

const css = `
  .notice { transition: border-color .15s ease; }
  .notice:hover { border-color: ${cssVar('border/blue-weak-a')}; }
  @media (max-width: 640px) {
    .notice { padding: 16px !important; }
  }
`

export default function ShopHomeNoticeWidget() {
  return (
    <div
      className="notice"
      style={{
        fontFamily,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        background: cssVar('surface/card'),
        border: `1px solid ${cssVar('border/default-a')}`,
        borderRadius: 14,
        padding: '18px 20px',
        margin: '16px 0',
        color: cssVar('text/primary'),
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flex: 'none',
          width: 8,
          height: 8,
          marginTop: 7,
          borderRadius: '50%',
          background: cssVar('text/blue'),
        }}
      />

      <div style={{ minWidth: 0 }}>
        <span
          style={{
            ...textStyle('11/caption/semibold'),
            color: cssVar('text/blue'),
            letterSpacing: '0.08em',
          }}
        >
          {NOTICE.badge}
        </span>

        <h2 style={{ ...textStyle('15/title/semibold'), margin: '6px 0 6px' }}>
          {NOTICE.title}
        </h2>

        <p
          style={{
            ...textStyle('14/body/reg'),
            color: cssVar('text/secondary'),
            margin: 0,
          }}
        >
          {NOTICE.body}
        </p>
      </div>
    </div>
  )
}

createTemplate(ShopHomeNoticeWidget, {
  name: 'sample-shop-home-notice',
  slot: 'user.shop-home.section:before',
  styles: css,
})

/**
 * 샘플 — 콘텐츠 홈 안내 위젯 (SDK 슬롯 · USER)
 *
 * 슬롯 위젯은 페이지 전체가 아니라, 플랫폼 화면 "사이"에 끼워 넣는 조각입니다.
 *
 * 폴더 이름은 사람이 알아보기 위한 것일 뿐 배치와 무관합니다.
 * 어느 자리에 붙을지는 아래 createTemplate 의 slot 옵션만 정합니다.
 *   slot: 'user.contents-home.curation:after'  →  콘텐츠 홈의 큐레이션 섹션 아래
 *
 * 한 자리에는 위젯 하나만 놓을 수 있습니다. 같은 자리에 두 개를 두면
 * 빌드가 산출물이 겹친다고 알려줍니다.
 *
 * 이 자리는 호스트가 넘겨주는 context 가 없습니다(카탈로그의 context 칸이 '—').
 * context 를 주는 자리에서는 useSlotContext 로 받아 씁니다. 예:
 *   const ctx = useSlotContext<'user.community-board.feed:before'>()
 *   const boardTitle = ctx?.board?.title        // 호스트가 없으면 undefined
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
  body: '콘텐츠 홈의 큐레이션 섹션 바로 아래에 붙는 위젯입니다. 공지·이벤트 배너·추천 영역처럼 콘텐츠를 둘러보기 전에 먼저 보여주고 싶은 내용을 넣기 좋습니다.',
}

/**
 * 슬롯은 플랫폼의 본문 여백 "바깥"에 붙습니다. 그래서 위젯이 자기 폭을
 * 정하지 않으면 화면 가장자리까지 꽉 차서, 주변 콘텐츠와 줄이 안 맞습니다.
 *
 * 유저 플랫폼의 본문은 바깥 틀이 1080px 가운데 정렬이고, 그 안에 좌우
 * 32px 여백을 둔 1016px이 실제 글이 놓이는 폭입니다. 위젯도 1016px에
 * 맞춰야 주변 콘텐츠와 좌우가 떨어집니다.
 */
const CONTENT_MAX_WIDTH = 1016

const css = `
  .notice { transition: border-color .15s ease; }
  .notice:hover { border-color: ${cssVar('border/blue-weak-a')}; }
  @media (max-width: 640px) {
    .notice { padding: 16px !important; }
  }
`

export default function ContentsHomeNoticeWidget() {
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
        // 좌우 auto 로 가운데 정렬. 화면이 좁을 때를 위해 바깥 여백도 함께 둡니다.
        margin: '16px auto',
        maxWidth: CONTENT_MAX_WIDTH,
        width: 'calc(100% - 40px)',
        boxSizing: 'border-box',
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

createTemplate(ContentsHomeNoticeWidget, {
  name: 'sample-contents-home-notice',
  slot: 'user.contents-home.curation:after',
  styles: css,
})

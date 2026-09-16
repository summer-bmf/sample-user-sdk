/**
 * 샘플 — 랜딩 페이지 (SDK · USER)
 *
 * 이 파일이 놓인 위치가 곧 배포 경로입니다.
 *   src/pages/sample-landing/template.tsx  →  /sample-landing
 *
 * 외부 API를 부르지 않습니다. 어느 스테이지에 올려도 그대로 렌더되도록
 * 화면에 쓰는 값은 전부 이 파일 안에 있습니다(아래 SECTIONS 상수).
 * 실제 데이터를 붙이려면 주석으로 표시한 자리에 BstageClient 호출을 넣으세요.
 */
import { createTemplate, useNavigation } from '@bstage-sdk/react'
import { cssVar, fontFamily, shadow, textStyle } from '@bstage-sdk/design/user'

// ── 화면에 쓰는 내용 (서버 없이 동작하도록 파일 안에 둡니다) ──────────────
const SECTIONS = [
  {
    tag: '01',
    title: '파일 위치가 곧 배포 경로',
    body: 'src/pages 아래 폴더 구조가 그대로 URL이 됩니다. 이 페이지는 sample-landing 폴더에 있어서 /sample-landing 으로 열립니다.',
  },
  {
    tag: '02',
    title: '디자인 토큰으로 색과 글자 맞추기',
    body: '색·타이포를 직접 적지 않고 토큰으로 씁니다. 플랫폼 디자인이 바뀌면 템플릿도 따라 바뀌고, 다크모드도 자동으로 대응됩니다.',
  },
  {
    tag: '03',
    title: '플랫폼 기능은 훅으로',
    body: '화면 이동·이벤트·다국어 같은 플랫폼 기능은 @bstage-sdk/react 훅으로 씁니다. 아래 버튼은 useNavigation 으로 이동합니다.',
  },
]

// Shadow DOM 안에 주입할 CSS입니다. 인라인 스타일로는 못 쓰는
// hover·미디어쿼리 같은 것만 여기에 둡니다.
const css = `
  .card { transition: transform .15s ease, box-shadow .15s ease; }
  .card:hover { transform: translateY(-2px); }
  .cta:hover { opacity: .88; }
  .cta:focus-visible { outline: 2px solid ${cssVar('border/blue')}; outline-offset: 2px; }
  @media (max-width: 640px) {
    .hero-title { font-size: 28px !important; line-height: 36px !important; }
    .grid { grid-template-columns: 1fr !important; }
  }
`

export default function SampleLandingTemplate() {
  // 플랫폼 화면 이동 — 임베드 환경에서는 플랫폼 라우터를 쓰고,
  // 로컬 개발에서는 브라우저 기본 동작으로 대체됩니다.
  const { navigate } = useNavigation()

  return (
    <div
      style={{
        fontFamily,
        background: cssVar('bg/base'),
        color: cssVar('text/primary'),
        padding: '48px 20px 64px',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* ── Hero ────────────────────────────────────────────── */}
        <p
          style={{
            ...textStyle('12/caption/semibold'),
            color: cssVar('text/blue'),
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0 0 12px',
          }}
        >
          b.stage SDK sample
        </p>

        <h1
          className="hero-title"
          style={{
            ...textStyle('40/title/semibold'),
            margin: '0 0 16px',
            textWrap: 'balance',
          }}
        >
          커스텀 페이지는 이렇게 만듭니다
        </h1>

        <p
          style={{
            ...textStyle('17/body/reg'),
            color: cssVar('text/secondary'),
            margin: '0 0 32px',
            maxWidth: '60ch',
          }}
        >
          이 페이지는 b.stage 포털의 샘플 템플릿입니다. 외부 서버 없이 그대로 동작하니,
          복사해서 내용을 바꾸는 것부터 시작해 보세요.
        </p>

        <button
          className="cta"
          type="button"
          onClick={() => navigate('/')}
          style={{
            ...textStyle('15/body/semibold'),
            fontFamily,
            background: cssVar('surface/form-inverted'),
            color: cssVar('text/invert-a'),
            border: 'none',
            borderRadius: 10,
            padding: '12px 20px',
            cursor: 'pointer',
          }}
        >
          홈으로 이동해 보기
        </button>

        {/* ── 카드 3장 ─────────────────────────────────────────── */}
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            margin: '56px 0 0',
          }}
        >
          {SECTIONS.map((s) => (
            <article
              key={s.tag}
              className="card"
              style={{
                background: cssVar('surface/card'),
                border: `1px solid ${cssVar('border/default-a')}`,
                borderRadius: 14,
                padding: '20px 18px',
                boxShadow: shadow['default-small'],
              }}
            >
              <span
                style={{
                  ...textStyle('11/caption/semibold'),
                  color: cssVar('text/tertiary'),
                }}
              >
                {s.tag}
              </span>
              <h2
                style={{
                  ...textStyle('16/title/semibold'),
                  margin: '8px 0 8px',
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  ...textStyle('14/body/reg'),
                  color: cssVar('text/secondary'),
                  margin: 0,
                }}
              >
                {s.body}
              </p>
            </article>
          ))}
        </div>

        {/* ── 다음 단계 안내 ───────────────────────────────────── */}
        <section
          style={{
            marginTop: 40,
            background: cssVar('bg/grouped-weak'),
            border: `1px solid ${cssVar('border/default-a')}`,
            borderRadius: 14,
            padding: '20px 22px',
          }}
        >
          <h2 style={{ ...textStyle('15/title/semibold'), margin: '0 0 10px' }}>
            다음으로 해볼 것
          </h2>
          <ul
            style={{
              ...textStyle('14/body/reg'),
              color: cssVar('text/secondary'),
              margin: 0,
              paddingLeft: 18,
              display: 'grid',
              gap: 6,
            }}
          >
            <li>이 파일의 문구와 카드 내용을 바꿔 봅니다.</li>
            <li>
              <code>src/slots/</code> 의 위젯 샘플도 함께 확인합니다 — 플랫폼 화면 사이에 끼워
              넣는 방식입니다.
            </li>
            <li>
              실데이터가 필요해지면 <code>src/shared/client.ts</code> 의 BstageClient 로
              호출하고, 키는 포털의 빌드 환경변수에 넣습니다.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

// createTemplate 은 반드시 모듈 최상위에서 호출합니다.
// name 은 Custom Element 태그명이라 하이픈이 하나 이상 들어가야 합니다.
createTemplate(SampleLandingTemplate, {
  name: 'sample-landing',
  styles: css,
})

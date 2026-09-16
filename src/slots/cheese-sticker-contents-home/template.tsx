/**
 * 샘플 — 스티커 모으기 위젯 · 콘텐츠 홈 (SDK 슬롯 · USER)
 *
 * 원작: 치즈(seocheese) — cheese-portal-showcase. 동의를 받아 샘플로 옮겨 왔습니다.
 *
 * 이 파일이 이렇게 짧은 게 핵심입니다.
 * 슬롯 파일은 "어느 자리에 붙을지"만 정하고, 실제 위젯은 src/shared/ 에 둡니다.
 * 그래서 아래 cheese-sticker-community/template.tsx 도 같은 StickerLayer 를 씁니다 —
 * 한 위젯을 자리만 바꿔 여러 곳에 붙일 수 있습니다.
 *
 * 외부 API를 부르지 않습니다. 모은 기록은 브라우저의 localStorage에 남습니다.
 */
import { createTemplate } from '@bstage-sdk/react'
import StickerLayer from '../../shared/cheese/StickerLayer'

export default function CheeseStickerContentsHome() {
  return <StickerLayer />
}

createTemplate(CheeseStickerContentsHome, {
  name: 'sample-sticker-contents-home',
  slot: 'user.contents-home.contents-section:before',
})

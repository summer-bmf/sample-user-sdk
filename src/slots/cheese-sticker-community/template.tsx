/**
 * 샘플 — 스티커 모으기 위젯 · 커뮤니티 게시판 (SDK 슬롯 · USER)
 *
 * 원작: 치즈(seocheese) — cheese-portal-showcase. 동의를 받아 샘플로 옮겨 왔습니다.
 *
 * 옆 폴더 cheese-sticker-contents-home 과 똑같은 StickerLayer 를 렌더합니다.
 * 다른 건 slot 옵션 한 줄뿐입니다 — 위젯 하나를 여러 자리에 재사용하는 방식입니다.
 */
import { createTemplate } from '@bstage-sdk/react'
import StickerLayer from '../../shared/cheese/StickerLayer'

export default function CheeseStickerCommunity() {
  return <StickerLayer />
}

createTemplate(CheeseStickerCommunity, {
  name: 'sample-sticker-community',
  slot: 'user.community-board.feed:before',
})

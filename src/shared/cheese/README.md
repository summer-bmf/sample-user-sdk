# 스티커 모으기 — 위젯 본체

원작: **치즈(seocheese)** — `cheese-portal-showcase`. 동의를 받아 샘플로 옮겨 왔습니다.

`src/slots/` 의 슬롯 파일은 자리만 정하고, 실제로 화면을 그리는 코드는 전부 여기 있습니다.
위젯이 조금이라도 커지면 이렇게 분리하는 편이 낫습니다 — 슬롯을 늘리거나 옮길 때
`createTemplate` 한 줄만 손대면 되고, 같은 위젯을 여러 자리에 재사용할 수 있습니다.

| 파일 | 하는 일 |
| --- | --- |
| `StickerLayer.tsx` | 스티커 한 개와 발견 모달. 슬롯 위젯이 렌더하는 컴포넌트 |
| `stickers.ts` | 스티커 종류 정의 |
| `roll.ts` | 이번 방문에 스티커가 뜰지, 어디에 뜰지 결정 |
| `seat.ts` | 화면에 스티커가 하나만 뜨도록 자리를 잡음 |
| `collection.ts` | 수집·집계 |
| `storage.ts` | localStorage 읽기·쓰기 |
| `useCollection.ts` | 도감 상태 구독 훅 |
| `styles.ts` | 공유 CSS 조각과 모서리 반경 |
| `debug.ts` | 개발 중 스티커를 항상 뜨게 하는 스위치 |

## 알아둘 점

**외부 서버를 쓰지 않습니다.** 모은 기록은 보는 사람의 브라우저에만 남습니다.

**스티커는 `document.body`에 포털로 그립니다.** Shadow DOM 안에서는 조상에
`transform`·`filter`·`contain` 이 있으면 `position: fixed` 가 화면 기준으로 동작하지
않고, 모달 딤도 화면 전체를 덮지 못하기 때문입니다.

**CSS는 파일이 아니라 문자열로 둡니다.** 배포 산출물은 `template.js` 하나만 최종
위치로 옮기기 때문에, 별도 CSS 파일로 나가면 조용히 사라집니다. 이미지도 같은 이유로
`hero.jpg?inline` 처럼 `?inline` 을 붙여 번들 안에 넣습니다.

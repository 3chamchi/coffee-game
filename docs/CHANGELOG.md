# Changelog

## 2026-06-20 — 가변 참가 인원 (2~6명)

- 참가자 수를 **3명 고정 → 2~6명 가변**으로 변경 (`index.html`).
  - 각 참가자 행에 `✕` 삭제 버튼(3명 초과일 때 표시), 목록 하단에 `＋ 참가자 추가` 버튼(6명 미만일 때 표시) 추가.
  - 추가 시 미사용 색을 부여해 **전원 고유색** 보장. 삭제 시 이름·색이 남은 행과 함께 보존.
  - 결과 메달 이모지를 6위(`6️⃣`)까지 확장.
- 서비스워커 캐시 `ssonda-race-v9` → `v10` (변경 반영, 핸드폰에서 최신 화면 보장).
- Playwright e2e 테스트 추가 (`tests/player-count.spec.js`) — 6개 케이스 전체 통과.
- 스펙: `docs/spec/variable-player-count.md` `[구현완료]`.
- 에이전트: Claude (spec-driven-development 6 Gates).

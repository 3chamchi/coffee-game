# AGENTS.md

## Spec-Driven 설정
REQUIRED SKILL: spec-driven-development

### 코드-스펙 매핑
| 코드 경로 | 스펙 경로 | changelog |
|----------|----------|-----------|
| `index.html` | `docs/spec/` | `docs/CHANGELOG.md` |
| `sw.js` | `docs/spec/` | `docs/CHANGELOG.md` |

### 공통
- 상태 태그: `[구현중]`, `[구현완료]`
- 검증: `npx playwright test` (e2e). 별도 빌드 단계 없음 — 정적 단일 HTML PWA.
- 배포: `main` 푸시 → GitHub Pages 자동 빌드. 라이브: https://3chamchi.github.io/coffee-game/

## 프로젝트 개요
"내가 쏜다 레이스" — 꼴찌가 쏘는(한턱내는) 말 경주 파티 게임. 단일 `index.html` PWA.

- 게임 로직 · 스타일 · 마크업이 모두 `index.html`에 인라인으로 들어 있다.
- `sw.js`: 오프라인 캐시 서비스워커. **`index.html`을 변경하면 `CACHE` 버전을 올린다** (예: `ssonda-race-v9` → `v10`).
- 테스트는 `tests/`에 위치하며 Playwright로 실제 브라우저에서 검증한다.

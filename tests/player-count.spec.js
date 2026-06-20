const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

// index.html 을 file:// 로 직접 연다.
const APP_URL = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;

test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL);
});

test('기본 진입 시 참가자 행이 3개다', async ({ page }) => {
  await expect(page.locator('#racers .racer-row')).toHaveCount(3);
});

test('추가 버튼으로 6명까지 늘릴 수 있고, 6명에서 추가 버튼이 사라진다', async ({ page }) => {
  const addBtn = page.locator('#racers .add-btn');
  await expect(addBtn).toBeVisible();
  // 3 → 6: 세 번 추가
  for (let n = 4; n <= 6; n++) {
    await page.locator('#racers .add-btn').click();
    await expect(page.locator('#racers .racer-row')).toHaveCount(n);
  }
  // 6명에서 추가 버튼이 사라진다
  await expect(page.locator('#racers .add-btn')).toHaveCount(0);
});

test('2명까지 줄이면 삭제 버튼이 사라진다', async ({ page }) => {
  // 3 → 2: 한 명 삭제
  await page.locator('#racers .racer-row .del-btn').first().click();
  await expect(page.locator('#racers .racer-row')).toHaveCount(2);
  // 2명에서는 삭제 버튼이 없다
  await expect(page.locator('#racers .del-btn')).toHaveCount(0);
});

test('삭제 시 입력한 이름이 남은 행에 보존된다', async ({ page }) => {
  const inputs = page.locator('#racers .racer-row input');
  await inputs.nth(0).fill('가가');
  await inputs.nth(1).fill('나나');
  await inputs.nth(2).fill('다다');
  // 2번째(나나) 행 삭제
  await page.locator('#racers .racer-row .del-btn').nth(1).click();
  await expect(page.locator('#racers .racer-row')).toHaveCount(2);
  // 남은 행은 가가, 다다 순서로 보존
  await expect(page.locator('#racers .racer-row input').nth(0)).toHaveValue('가가');
  await expect(page.locator('#racers .racer-row input').nth(1)).toHaveValue('다다');
});

test('추가된 참가자는 기존과 다른 색을 부여받는다 (전원 고유색)', async ({ page }) => {
  // 6명까지 추가
  for (let n = 4; n <= 6; n++) await page.locator('#racers .add-btn').click();
  await expect(page.locator('#racers .racer-row')).toHaveCount(6);
  // 각 말 버튼의 hue-rotate 값이 모두 달라야 한다
  const hues = await page.locator('#racers .horse-btn').evaluateAll(
    els => els.map(el => el.style.filter)
  );
  expect(hues).toHaveLength(6);
  expect(new Set(hues).size).toBe(6);
});

test('4명으로 출발하면 레인 4개가 생기고 결과 순위가 4개 표시된다', async ({ page }) => {
  await page.locator('#racers .add-btn').click();
  await expect(page.locator('#racers .racer-row')).toHaveCount(4);
  await page.locator('#startBtn').click();
  // 레인 4개
  await expect(page.locator('#track .lane')).toHaveCount(4);
  // 경주 종료 후 결과 모달 (카운트다운 ~3s + 경주 ~7s)
  await expect(page.locator('#overlay')).toBeVisible({ timeout: 25000 });
  await expect(page.locator('#rankList .rank-item')).toHaveCount(4);
});

// ---- 모바일 반응형 회귀 테스트 ----
test.describe('모바일 세로 — 삭제 버튼 레이아웃 (390×844)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('삭제(✕) 버튼이 참가자 행 카드 밖으로 넘치지 않는다', async ({ page }) => {
    const row = page.locator('#racers .racer-row').first();
    const del = row.locator('.del-btn');
    await expect(del).toBeVisible();
    const rb = await row.boundingBox();
    const db = await del.boundingBox();
    // 삭제 버튼 오른쪽 끝이 행 카드 오른쪽 끝을 넘지 않아야 한다
    expect(db.x + db.width).toBeLessThanOrEqual(rb.x + rb.width + 1);
  });
});

test.describe('모바일 가로 — 결과 모달 (844×390)', () => {
  test.use({ viewport: { width: 844, height: 390 }, hasTouch: true });

  test('6명 결과에서도 돌아가기 버튼이 화면 안에 보이고 닫을 수 있다', async ({ page }) => {
    for (let n = 4; n <= 6; n++) await page.locator('#racers .add-btn').click();
    await page.locator('#startBtn').click();
    await expect(page.locator('#overlay')).toBeVisible({ timeout: 30000 });
    const btn = page.locator('#resetBtn');
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    const vh = page.viewportSize().height;
    // 버튼 전체가 뷰포트 세로 범위 안에 있어야 한다 (잘리지 않음)
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(vh + 1);
    await btn.click();
    await expect(page.locator('#overlay')).toBeHidden();
  });
});

const nicknameInput = document.getElementById("nickname");
const loopsInput = document.getElementById("loops");
const unitAmountInput = document.getElementById("unitAmount");
const unitNameInput = document.getElementById("unitName");
const daysInput = document.getElementById("days");

const calcButton = document.getElementById("calcButton");
const resetButton = document.getElementById("resetButton");
const copyButton = document.getElementById("copyButton");

const resultAmount = document.getElementById("resultAmount");
const heroMiniAmount = document.getElementById("heroMiniAmount");
const rankBadge = document.getElementById("rankBadge");
const resultText = document.getElementById("resultText");
const monthlyAmount = document.getElementById("monthlyAmount");
const dailyAmount = document.getElementById("dailyAmount");
const secondlyAmount = document.getElementById("secondlyAmount");
const blinkAmount = document.getElementById("blinkAmount");
const loopCount = document.getElementById("loopCount");
const budgetRatio = document.getElementById("budgetRatio");
const profileName = document.getElementById("profileName");
const profileSummary = document.getElementById("profileSummary");
const barChart = document.getElementById("barChart");
const shareText = document.getElementById("shareText");

const loadingOverlay = document.getElementById("loadingOverlay");
const loadingPercent = document.getElementById("loadingPercent");
const progressBar = document.getElementById("progressBar");
const loadingLog = document.getElementById("loadingLog");

const FAKE_NATIONAL_BUDGET = 112000000000000;

const loadingMessages = [
  "JOKE ONLY: 仮想ループ環境を起動中",
  "実決済が発生しないことを確認中",
  "妄想KPI回転数を読み込み中",
  "疑似取引風アニメーションを実行中",
  "現実収入フィルターを適用中",
  "JOKE ONLY表示を確認中",
  "自称秒給を無駄に精密計算中",
  "瞬き1回あたりの謎指標を生成中",
  "SNS用ネタ文に免責文を挿入中",
  "仮想ステータスを確定中"
];

function formatUnit(value, unitName) {
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat("ja-JP").format(rounded);
  return `${formatted}${unitName}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function judgeRank(value) {
  if (value >= 1000000000) return "概念上の富豪級";
  if (value >= 100000000) return "石油王級";
  if (value >= 30000000) return "成金級";
  if (value >= 10000000) return "副業成功者級";
  if (value >= 3000000) return "庶民級";
  return "慎ましきネタ民級";
}

function buildTrend(total) {
  const ratios = [0.06, 0.15, 0.29, 0.47, 0.72, 1.0];
  return ratios.map((ratio, index) => ({
    label: `${index + 1}期`,
    value: Math.round(total * ratio)
  }));
}

function renderChart(items, unitName) {
  const max = Math.max(...items.map((item) => item.value), 1);
  barChart.innerHTML = "";

  items.forEach((item) => {
    const bar = document.createElement("div");
    bar.className = "bar";

    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = formatUnit(item.value, unitName);

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.height = `${Math.max(8, (item.value / max) * 160)}px`;

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = item.label;

    bar.append(value, fill, label);
    barChart.appendChild(bar);
  });
}

function setGeneratedValues() {
  const nickname = nicknameInput.value.trim() || "あなた";
  const loops = clampNumber(Number(loopsInput.value), 1, 100000000);
  const unitAmount = clampNumber(Number(unitAmountInput.value), 1, 100000000);
  const unitName = unitNameInput.value;
  const days = clampNumber(Number(daysInput.value), 1, 366);

  loopsInput.value = loops;
  unitAmountInput.value = unitAmount;
  daysInput.value = days;

  const fakeRevenue = loops * unitAmount;
  const monthly = fakeRevenue / 12;
  const daily = fakeRevenue / days;
  const secondly = daily / 86400;
  const blink = secondly * 3;
  const rank = judgeRank(fakeRevenue);
  const budgetPercent = (fakeRevenue / FAKE_NATIONAL_BUDGET) * 100;

  const formattedRevenue = formatUnit(fakeRevenue, unitName);

  resultAmount.textContent = formattedRevenue;
  heroMiniAmount.textContent = formattedRevenue;
  rankBadge.textContent = rank;
  resultText.textContent =
    `${nickname}さんの妄想年間総売上は ${formattedRevenue} です。` +
    "これは仮想計算によるジョーク表示であり、実際の収入・売上・所得ではありません。";

  monthlyAmount.textContent = formatUnit(monthly, unitName);
  dailyAmount.textContent = formatUnit(daily, unitName);
  secondlyAmount.textContent = formatUnit(secondly, unitName);
  blinkAmount.textContent = formatUnit(blink, unitName);
  loopCount.textContent = `${formatNumber(loops)}回`;
  budgetRatio.textContent = `${budgetPercent.toFixed(10)}%`;

  profileName.textContent = nickname;
  profileSummary.textContent =
    `ステータス：${rank}。妄想KPI回転数 ${formatNumber(loops)}回、` +
    `1回あたり ${formatUnit(unitAmount, unitName)} のネタ計算による仮想プロフィールです。`;

  shareText.value =
    `私は仮想世界で妄想年間総売上 ${formattedRevenue} を突破しました。\n` +
    `ランク：${rank}\n` +
    "※これはジョーク用の仮想表示であり、現実の収入・売上・所得ではありません。";

  renderChart(buildTrend(fakeRevenue), unitName);
}

function runFakeLoadingThenGenerate() {
  calcButton.disabled = true;
  loadingOverlay.classList.add("is-active");
  loadingOverlay.setAttribute("aria-hidden", "false");
  loadingLog.innerHTML = "";
  progressBar.style.width = "0%";
  loadingPercent.textContent = "0%";

  let step = 0;
  const totalSteps = loadingMessages.length;

  const timer = setInterval(() => {
    step += 1;
    const percent = Math.min(100, Math.round((step / totalSteps) * 100));

    progressBar.style.width = `${percent}%`;
    loadingPercent.textContent = `${percent}%`;

    const item = document.createElement("li");
    item.textContent = loadingMessages[step - 1];
    loadingLog.prepend(item);

    while (loadingLog.children.length > 5) {
      loadingLog.removeChild(loadingLog.lastElementChild);
    }

    if (step >= totalSteps) {
      clearInterval(timer);
      setTimeout(() => {
        setGeneratedValues();
        loadingOverlay.classList.remove("is-active");
        loadingOverlay.setAttribute("aria-hidden", "true");
        calcButton.disabled = false;
      }, 380);
    }
  }, 165);
}

function resetDashboard() {
  nicknameInput.value = "";
  loopsInput.value = 1000000;
  unitAmountInput.value = 1;
  unitNameInput.value = "円";
  daysInput.value = 365;

  resultAmount.textContent = "---";
  heroMiniAmount.textContent = "---";
  rankBadge.textContent = "未生成";
  resultText.textContent = "入力後にネタ用ステータスが表示されます。";
  monthlyAmount.textContent = "---";
  dailyAmount.textContent = "---";
  secondlyAmount.textContent = "---";
  blinkAmount.textContent = "---";
  loopCount.textContent = "---";
  budgetRatio.textContent = "---";
  profileName.textContent = "---";
  profileSummary.textContent = "まだ生成されていません。";
  shareText.value = "生成後にここへ表示されます。";
  barChart.innerHTML = "";
}

calcButton.addEventListener("click", runFakeLoadingThenGenerate);
resetButton.addEventListener("click", resetDashboard);

document.querySelectorAll(".primary-link, #heroGenerateButton, #headerGenerateButton").forEach((button) => {
  if (!button) return;
  button.addEventListener("click", () => {
    const dashboard = document.getElementById("dashboard");
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareText.value);
    copyButton.textContent = "コピーしました";
    setTimeout(() => {
      copyButton.textContent = "コピー";
    }, 1200);
  } catch {
    shareText.select();
    document.execCommand("copy");
  }
});

resetDashboard();

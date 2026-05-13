const nicknameInput = document.getElementById("nickname");
const loopsInput = document.getElementById("loops");
const unitInput = document.getElementById("unit");
const daysInput = document.getElementById("days");
const calcButton = document.getElementById("calcButton");
const resetButton = document.getElementById("resetButton");
const copyButton = document.getElementById("copyButton");

const resultAmount = document.getElementById("resultAmount");
const rankBadge = document.getElementById("rankBadge");
const resultText = document.getElementById("resultText");
const monthlyAmount = document.getElementById("monthlyAmount");
const dailyAmount = document.getElementById("dailyAmount");
const hourlyAmount = document.getElementById("hourlyAmount");
const loopCount = document.getElementById("loopCount");
const profileName = document.getElementById("profileName");
const profileSummary = document.getElementById("profileSummary");
const barChart = document.getElementById("barChart");
const shareText = document.getElementById("shareText");

function formatYen(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(value);
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
  const ratios = [0.08, 0.16, 0.27, 0.43, 0.66, 1.0];
  return ratios.map((ratio, index) => ({
    label: `${index + 1}期`,
    value: Math.round(total * ratio)
  }));
}

function renderChart(items) {
  const max = Math.max(...items.map((item) => item.value), 1);
  barChart.innerHTML = "";

  items.forEach((item) => {
    const bar = document.createElement("div");
    bar.className = "bar";

    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = formatYen(item.value);

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.height = `${Math.max(8, (item.value / max) * 150)}px`;

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = item.label;

    bar.append(value, fill, label);
    barChart.appendChild(bar);
  });
}

function updateDashboard() {
  const nickname = nicknameInput.value.trim() || "あなた";
  const loops = clampNumber(Number(loopsInput.value), 1, 100000000);
  const unit = Number(unitInput.value);
  const days = clampNumber(Number(daysInput.value), 1, 366);

  loopsInput.value = loops;
  daysInput.value = days;

  const fakeRevenue = loops * unit;
  const monthly = fakeRevenue / 12;
  const daily = fakeRevenue / days;
  const hourly = daily / 8;
  const rank = judgeRank(fakeRevenue);

  resultAmount.textContent = formatYen(fakeRevenue);
  rankBadge.textContent = rank;
  resultText.textContent =
    `${nickname}さんのネタ用自称年収は ${formatYen(fakeRevenue)} です。` +
    "これは仮想計算によるジョーク表示であり、実際の収入・売上・所得ではありません。";

  monthlyAmount.textContent = formatYen(monthly);
  dailyAmount.textContent = formatYen(daily);
  hourlyAmount.textContent = formatYen(hourly);
  loopCount.textContent = `${formatNumber(loops)}回`;

  profileName.textContent = nickname;
  profileSummary.textContent =
    `ステータス：${rank}。仮想取引回数 ${formatNumber(loops)}回、` +
    `1回あたり ${formatYen(unit)} のネタ計算によるプロフィールです。`;

  shareText.value =
    `私は仮想世界で自称年収 ${formatYen(fakeRevenue)} を突破しました。\n` +
    `ランク：${rank}\n` +
    "※これはジョーク用の仮想表示であり、現実の収入ではありません。";

  renderChart(buildTrend(fakeRevenue));
}

function resetDashboard() {
  nicknameInput.value = "";
  loopsInput.value = 1000000;
  unitInput.value = "1";
  daysInput.value = 365;

  resultAmount.textContent = "---";
  rankBadge.textContent = "未生成";
  resultText.textContent = "数値を入力して生成してください。";
  monthlyAmount.textContent = "---";
  dailyAmount.textContent = "---";
  hourlyAmount.textContent = "---";
  loopCount.textContent = "---";
  profileName.textContent = "---";
  profileSummary.textContent = "まだ生成されていません。";
  shareText.value = "生成後にここへ表示されます。";
  barChart.innerHTML = "";
}

calcButton.addEventListener("click", updateDashboard);
resetButton.addEventListener("click", resetDashboard);

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

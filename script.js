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
  "仮想KPI回転数を読み込み中",
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

function formatDurationFromSeconds(totalSeconds) {
  const seconds = Math.max(1, Math.round(totalSeconds));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days) parts.push(`${formatNumber(days)}日`);
  if (hours) parts.push(`${hours}時間`);
  if (minutes) parts.push(`${minutes}分`);
  if (secs && parts.length < 2) parts.push(`${secs}秒`);

  return parts.slice(0, 3).join("") || "1秒未満";
}

function formatDurationFromSeconds(totalSeconds) {
  const seconds = Math.max(1, Math.round(totalSeconds));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days) parts.push(`${formatNumber(days)}日`);
  if (hours) parts.push(`${hours}時間`);
  if (minutes) parts.push(`${minutes}分`);
  if (secs && parts.length < 2) parts.push(`${secs}秒`);

  return parts.slice(0, 3).join("") || "1秒未満";
}

function getLoadingPlanByLoops(loops) {
  const safeLoops = clampNumber(Number(loops), 1, 100000000);
  const logLoops = Math.log10(safeLoops + 1);

  // ガチ寄りの演出時間。
  // 目安:
  // 1万回      -> 約1.5分
  // 100万回    -> 約5分
  // 1億回      -> 約12分
  // ただしブラウザ操作不能を避けるため、最大20分で止める。
  const intenseMs = Math.round(1200 + Math.pow(logLoops, 3) * 1400);
  const cappedMs = Math.min(20 * 60 * 1000, Math.max(2000, intenseMs));

  // 「現実に1件ずつ処理したらどれくらいか」のネタ用推定。
  // あくまで仮定として、1回あたり0.2秒で計算する。
  const assumedSecondsPerLoop = 0.2;
  const realisticSeconds = safeLoops * assumedSecondsPerLoop;

  return {
    loops: safeLoops,
    totalMs: cappedMs,
    label: `${(cappedMs / 1000).toFixed(1)}秒`,
    realisticLabel: formatDurationFromSeconds(realisticSeconds)
  };
}

function animateNumberText(element) {
  element.classList.remove("count-pop");
  void element.offsetWidth;
  element.classList.add("count-pop");
}

function runFakeLoadingThenGenerate() {
  const loopsForDuration = clampNumber(Number(loopsInput.value), 1, 100000000);
  const loadingPlan = getLoadingPlanByLoops(loopsForDuration);
  const durationHint = document.getElementById("loadingDurationHint");
  const realisticTimeHint = document.getElementById("realisticTimeHint");

  calcButton.disabled = true;
  loadingOverlay.classList.add("is-active");
  loadingOverlay.setAttribute("aria-hidden", "false");
  loadingLog.innerHTML = "";
  progressBar.style.width = "0%";
  loadingPercent.textContent = "0%";

  if (durationHint) {
    durationHint.textContent =
      `仮想KPI回転数 ${formatNumber(loopsForDuration)}回に応じて、約${loadingPlan.label}の長時間演出を実行します。`;
  }

  if (realisticTimeHint) {
    realisticTimeHint.textContent =
      `仮に1回0.2秒で1件ずつ処理すると、現実的な所要時間は約${loadingPlan.realisticLabel}です。画面では長めの短縮演出にしています。`;
  }

  const startTime = performance.now();
  const totalMs = loadingPlan.totalMs;
  const logInterval = Math.max(900, totalMs / loadingMessages.length);
  let nextLogAt = 0;
  let logIndex = 0;
  let animationFrameId = null;

  function pushLog(elapsedMs) {
    const progressRatio = Math.min(1, elapsedMs / totalMs);
    const virtualProcessed = Math.max(1, Math.round(loopsForDuration * progressRatio));
    const message = loadingMessages[logIndex % loadingMessages.length];

    const item = document.createElement("li");
    item.textContent = `${message} / 仮想処理 ${formatNumber(virtualProcessed)}回`;
    loadingLog.prepend(item);

    while (loadingLog.children.length > 5) {
      loadingLog.removeChild(loadingLog.lastElementChild);
    }

    logIndex += 1;
  }

  function finishLoading() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    progressBar.style.width = "100%";
    loadingPercent.textContent = "100%";

    setTimeout(() => {
      setGeneratedValues();

      [
        resultAmount,
        heroMiniAmount,
        monthlyAmount,
        dailyAmount,
        secondlyAmount,
        blinkAmount,
        loopCount,
        budgetRatio
      ].forEach((element) => animateNumberText(element));

      loadingOverlay.classList.remove("is-active");
      loadingOverlay.setAttribute("aria-hidden", "true");
      calcButton.disabled = false;
    }, 380);
  }

  function tick(now) {
    const elapsedMs = now - startTime;
    const progress = Math.min(1, elapsedMs / totalMs);
    const percent = Math.min(100, Math.floor(progress * 100));

    progressBar.style.width = `${percent}%`;
    loadingPercent.textContent = `${percent}%`;

    if (elapsedMs >= nextLogAt) {
      pushLog(elapsedMs);
      nextLogAt += logInterval;
    }

    if (progress >= 1) {
      finishLoading();
      return;
    }

    animationFrameId = requestAnimationFrame(tick);
  }

  pushLog(0);
  animationFrameId = requestAnimationFrame(tick);
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


// Preset chips for richer interaction
document.querySelectorAll(".preset-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const loops = chip.dataset.loops;
    if (!loops) return;
    loopsInput.value = loops;
  });
});

// AOS-like scroll animation
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".fade-up").forEach((element) => {
  fadeObserver.observe(element);
});

resetDashboard();

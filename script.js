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
const sessionId = document.getElementById("sessionId");
const queueState = document.getElementById("queueState");
const processedCount = document.getElementById("processedCount");
const throughputValue = document.getElementById("throughputValue");
const etaValue = document.getElementById("etaValue");
const batchValue = document.getElementById("batchValue");

const FAKE_NATIONAL_BUDGET = 112000000000000;

const processStages = [
  { code: "INIT", text: "session context initialized" },
  { code: "AUTH", text: "request signature checked" },
  { code: "ALLOC", text: "queue partition allocated" },
  { code: "BATCH", text: "batch window opened" },
  { code: "SEQ", text: "sequence cursor advanced" },
  { code: "LEDGER", text: "ledger rows staged" },
  { code: "VERIFY", text: "integrity checksum verified" },
  { code: "RECON", text: "reconciliation pass completed" },
  { code: "COMMIT", text: "batch commit marker written" },
  { code: "FINAL", text: "result snapshot finalized" }
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
  const seconds = Math.max(0, Math.round(totalSeconds));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days) parts.push(`${formatNumber(days)}日`);
  if (hours) parts.push(`${hours}時間`);
  if (minutes) parts.push(`${minutes}分`);
  if (secs || parts.length === 0) parts.push(`${secs}秒`);

  return parts.slice(0, 3).join("") || "0秒";
}

function createSessionCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TX-";
  for (let i = 0; i < 4; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  code += "-";
  for (let i = 0; i < 4; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getLoadingPlanByLoops(loops) {
  const safeLoops = clampNumber(Number(loops), 1, 100000000);
  const logLoops = Math.log10(safeLoops + 1);

  // ガチ寄りの演出時間。
  // 目安:
  // 1万回      -> 約1.5分
  // 100万回    -> 約5分
  // 1億回      -> 約12分
  // 最大20分
  const intenseMs = Math.round(1200 + Math.pow(logLoops, 3) * 1400);
  const cappedMs = Math.min(20 * 60 * 1000, Math.max(2000, intenseMs));

  // 見た目上の処理単位。件数が大きいほどバッチサイズも大きくする。
  const batchSize = Math.max(50, Math.min(50000, Math.round(safeLoops / 180)));

  // 「現実に1件ずつ処理したらどれくらいか」の参考値。
  // あくまで仮定として、1回あたり0.2秒で計算する。
  const assumedSecondsPerLoop = 0.2;
  const realisticSeconds = safeLoops * assumedSecondsPerLoop;

  return {
    loops: safeLoops,
    totalMs: cappedMs,
    batchSize,
    label: formatDurationFromSeconds(cappedMs / 1000),
    realisticLabel: formatDurationFromSeconds(realisticSeconds)
  };
}

function animateNumberText(element) {
  element.classList.remove("count-pop");
  void element.offsetWidth;
  element.classList.add("count-pop");
}

function appendProcessLog({ code, body }) {
  const now = new Date();
  const time = now.toLocaleTimeString("ja-JP", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const item = document.createElement("li");

  const timeSpan = document.createElement("span");
  timeSpan.className = "log-time";
  timeSpan.textContent = time;

  const codeSpan = document.createElement("span");
  codeSpan.className = "log-code";
  codeSpan.textContent = code;

  const bodySpan = document.createElement("span");
  bodySpan.className = "log-body";
  bodySpan.textContent = body;

  item.append(timeSpan, codeSpan, bodySpan);
  loadingLog.prepend(item);

  while (loadingLog.children.length > 7) {
    loadingLog.removeChild(loadingLog.lastElementChild);
  }
}

function runFakeLoadingThenGenerate() {
  const loopsForDuration = clampNumber(Number(loopsInput.value), 1, 100000000);
  const loadingPlan = getLoadingPlanByLoops(loopsForDuration);
  const durationHint = document.getElementById("loadingDurationHint");
  const realisticTimeHint = document.getElementById("realisticTimeHint");
  const sessionCode = createSessionCode();

  calcButton.disabled = true;
  loadingOverlay.classList.add("is-active");
  loadingOverlay.setAttribute("aria-hidden", "false");
  loadingLog.innerHTML = "";
  progressBar.style.width = "0%";
  loadingPercent.textContent = "0%";

  if (sessionId) sessionId.textContent = sessionCode;
  if (queueState) queueState.textContent = "OPEN";
  if (processedCount) processedCount.textContent = `0 / ${formatNumber(loopsForDuration)}`;
  if (throughputValue) throughputValue.textContent = "0 tx/s";
  if (etaValue) etaValue.textContent = loadingPlan.label;
  if (batchValue) batchValue.textContent = formatNumber(loadingPlan.batchSize);

  if (durationHint) {
    durationHint.textContent =
      `total sequence: ${formatNumber(loopsForDuration)} tx / expected runtime: ${loadingPlan.label}`;
  }

  if (realisticTimeHint) {
    realisticTimeHint.textContent =
      `reference: 1 tx = 0.2 sec の場合、逐次処理換算は約${loadingPlan.realisticLabel}。`;
  }

  const startTime = performance.now();
  const totalMs = loadingPlan.totalMs;
  const stageCount = processStages.length;
  const logInterval = Math.max(700, totalMs / (stageCount * 2.4));
  let nextLogAt = 0;
  let logIndex = 0;
  let animationFrameId = null;
  let lastProcessed = 0;

  appendProcessLog({
    code: "INIT",
    body: `session=${sessionCode} queue=annual-kpi batch=${formatNumber(loadingPlan.batchSize)}`
  });

  function finishLoading() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    progressBar.style.width = "100%";
    loadingPercent.textContent = "100%";

    if (queueState) queueState.textContent = "CLOSED";
    if (processedCount) processedCount.textContent = `${formatNumber(loopsForDuration)} / ${formatNumber(loopsForDuration)}`;
    if (throughputValue) throughputValue.textContent = `${formatNumber(Math.round(loopsForDuration / (totalMs / 1000)))} tx/s`;
    if (etaValue) etaValue.textContent = "0秒";

    appendProcessLog({
      code: "FINAL",
      body: `processed=${formatNumber(loopsForDuration)} status=committed checksum=ok snapshot=ready`
    });

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
    }, 520);
  }

  function tick(now) {
    const elapsedMs = now - startTime;
    const progress = Math.min(1, elapsedMs / totalMs);
    const easedProgress = 1 - Math.pow(1 - progress, 1.7);
    const percent = Math.min(100, Math.floor(easedProgress * 100));
    const processed = Math.min(loopsForDuration, Math.max(lastProcessed, Math.floor(loopsForDuration * easedProgress)));
    const elapsedSeconds = Math.max(0.001, elapsedMs / 1000);
    const throughput = Math.round(processed / elapsedSeconds);
    const remainingMs = Math.max(0, totalMs - elapsedMs);

    lastProcessed = processed;

    progressBar.style.width = `${percent}%`;
    loadingPercent.textContent = `${percent}%`;

    if (processedCount) {
      processedCount.textContent = `${formatNumber(processed)} / ${formatNumber(loopsForDuration)}`;
    }
    if (throughputValue) {
      throughputValue.textContent = `${formatNumber(throughput)} tx/s`;
    }
    if (etaValue) {
      etaValue.textContent = formatDurationFromSeconds(remainingMs / 1000);
    }

    if (elapsedMs >= nextLogAt) {
      const stage = processStages[logIndex % processStages.length];
      const cursor = Math.min(loopsForDuration, processed + loadingPlan.batchSize);
      const latency = Math.max(8, Math.round(18 + Math.random() * 42 - progress * 10));
      const shard = String((logIndex % 8) + 1).padStart(2, "0");
      const body =
        `${stage.text}; cursor=${formatNumber(cursor)} tx; shard=${shard}; latency=${latency}ms; rate=${formatNumber(throughput)}tx/s`;

      appendProcessLog({
        code: stage.code,
        body
      });

      logIndex += 1;
      nextLogAt += logInterval;
    }

    if (progress >= 1) {
      finishLoading();
      return;
    }

    animationFrameId = requestAnimationFrame(tick);
  }

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

const nicknameInput = document.getElementById("nickname");
const loopsInput = document.getElementById("loops");
const unitInput = document.getElementById("unit");
const calcButton = document.getElementById("calcButton");
const resultAmount = document.getElementById("resultAmount");
const resultText = document.getElementById("resultText");

function formatYen(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(value);
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

calcButton.addEventListener("click", () => {
  const nickname = nicknameInput.value.trim() || "あなた";
  const loops = clampNumber(Number(loopsInput.value), 1, 100000000);
  const unit = Number(unitInput.value);
  const fakeRevenue = loops * unit;

  resultAmount.textContent = formatYen(fakeRevenue);
  resultText.textContent =
    `${nickname}さんのネタ用自称年収は ${formatYen(fakeRevenue)} です。` +
    "これは仮想計算によるジョーク表示であり、実際の収入・売上・所得ではありません。";
});

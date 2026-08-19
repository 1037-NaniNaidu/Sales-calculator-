const costInput = document.getElementById("cost");
const daysInput = document.getElementById("days");
const startButton = document.getElementById("start");
const dailySection = document.getElementById("dailySection");
const dailyInputs = document.getElementById("dailyInputs");
const calculateButton = document.getElementById("calculate");
const result = document.getElementById("result");
const clearButton = document.getElementById("clear");

let stockInputs = [];

startButton.addEventListener("click", () => {
  const days = Number(daysInput.value);

  if (!Number.isInteger(days) || days < 1 || days > 366) {
    alert("Enter a whole number of days from 1 to 366.");
    return;
  }

  dailyInputs.innerHTML = "";
  stockInputs = [];

  for (let i = 1; i <= days; i++) {
    const box = document.createElement("div");
    box.className = "day";

    const title = document.createElement("div");
    title.className = "day-title";
    title.textContent = "Day " + i;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.step = "1";
    input.placeholder = "Number of stocks sold";

    const dailyTotal = document.createElement("div");
    dailyTotal.className = "daily-total";
    dailyTotal.textContent = "Daily sale: ₹0.00";

    input.addEventListener("input", () => {
      const cost = Number(costInput.value) || 0;
      const stocks = Number(input.value) || 0;
      dailyTotal.textContent = "Daily sale: ₹" + (stocks * cost).toFixed(2);
    });

    box.append(title, input, dailyTotal);
    dailyInputs.appendChild(box);
    stockInputs.push(input);
  }

  dailySection.classList.remove("hidden");
  result.classList.add("hidden");
  dailySection.scrollIntoView({ behavior: "smooth" });
});

calculateButton.addEventListener("click", () => {
  const cost = Number(costInput.value);

  if (!Number.isFinite(cost) || cost < 0) {
    alert("Enter a valid cost per stock.");
    return;
  }

  let totalStocks = 0;
  let totalSales = 0;
  let rows = "";

  for (let i = 0; i < stockInputs.length; i++) {
    const value = stockInputs[i].value.trim();

    if (value === "" || Number(value) < 0) {
      alert("Enter stocks sold for Day " + (i + 1) + ".");
      stockInputs[i].focus();
      return;
    }

    const stocks = Number(value);
    const sale = stocks * cost;
    totalStocks += stocks;
    totalSales += sale;

    rows += `<div class="summary-row">Day ${i + 1}: ${stocks} stocks = ₹${sale.toFixed(2)}</div>`;
  }

  result.innerHTML = `
    <h2>Sales Summary</h2>
    ${rows}
    <hr>
    <div class="summary-row"><b>Total Stock Sold:</b> ${totalStocks}</div>
    <div class="summary-row total">Total Sales: ₹${totalSales.toFixed(2)}</div>
  `;

  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth" });
});

clearButton.addEventListener("click", () => {
  costInput.value = "";
  daysInput.value = "";
  dailyInputs.innerHTML = "";
  stockInputs = [];
  dailySection.classList.add("hidden");
  result.classList.add("hidden");
  result.innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =====================================================
// EXISTING SALES CALCULATOR
// =====================================================

const costInput = document.getElementById("cost");
const daysInput = document.getElementById("days");
const startButton = document.getElementById("start");
const dailySection = document.getElementById("dailySection");
const dailyInputs = document.getElementById("dailyInputs");
const calculateButton = document.getElementById("calculate");
const result = document.getElementById("result");
const clearButton = document.getElementById("clear");

let stockInputs = [];


// =====================================================
// START DAILY CALCULATOR
// =====================================================

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

      const cost =
        Number(costInput.value) || 0;

      const stocks =
        Number(input.value) || 0;

      dailyTotal.textContent =
        "Daily sale: ₹" +
        (stocks * cost).toFixed(2);

    });


    box.append(
      title,
      input,
      dailyTotal
    );

    dailyInputs.appendChild(box);

    stockInputs.push(input);
  }


  dailySection.classList.remove("hidden");

  result.classList.add("hidden");

  dailySection.scrollIntoView({
    behavior: "smooth"
  });

});


// =====================================================
// CALCULATE EXISTING SALES
// =====================================================

calculateButton.addEventListener("click", () => {

  const cost =
    Number(costInput.value);


  if (!Number.isFinite(cost) || cost < 0) {

    alert(
      "Enter a valid cost per stock."
    );

    return;
  }


  let totalStocks = 0;

  let totalSales = 0;

  let rows = "";


  for (
    let i = 0;
    i < stockInputs.length;
    i++
  ) {

    const value =
      stockInputs[i].value.trim();


    if (
      value === "" ||
      Number(value) < 0
    ) {

      alert(
        "Enter stocks sold for Day " +
        (i + 1) +
        "."
      );

      stockInputs[i].focus();

      return;
    }


    const stocks =
      Number(value);

    const sale =
      stocks * cost;


    totalStocks += stocks;

    totalSales += sale;


    rows += `
      <div class="summary-row">
        Day ${i + 1}: ${stocks} stocks = ₹${sale.toFixed(2)}
      </div>
    `;
  }


  result.innerHTML = `
    <h2>Sales Summary</h2>

    ${rows}

    <hr>

    <div class="summary-row">
      <b>Total Stock Sold:</b>
      ${totalStocks}
    </div>

    <div class="summary-row total">
      Total Sales: ₹${totalSales.toFixed(2)}
    </div>
  `;


  result.classList.remove("hidden");


  result.scrollIntoView({
    behavior: "smooth"
  });

});


// =====================================================
// EXISTING CLEAR BUTTON
// =====================================================

clearButton.addEventListener("click", () => {

  costInput.value = "";

  daysInput.value = "";

  dailyInputs.innerHTML = "";

  stockInputs = [];

  dailySection.classList.add("hidden");

  result.classList.add("hidden");

  result.innerHTML = "";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});


// =====================================================
// REAL-TIME SALES TRACKER
// =====================================================

// Load previously saved sales

let realTimeSales =
  JSON.parse(
    localStorage.getItem("realTimeSales")
  ) || [];


// Load the tracking start time

let trackingStart =
  localStorage.getItem(
    "trackingStart"
  );


// Start tracking for the first time

if (!trackingStart) {

  trackingStart =
    new Date().toISOString();

  localStorage.setItem(
    "trackingStart",
    trackingStart
  );
}


// =====================================================
// FIND CURRENT 24-HOUR SALES DAY
// =====================================================

function getCurrentSalesDay() {

  const start =
    new Date(trackingStart);

  const now =
    new Date();


  const difference =
    now - start;


  const oneDay =
    24 * 60 * 60 * 1000;


  return (
    Math.floor(
      difference / oneDay
    ) + 1
  );
}


// =====================================================
// ADD A REAL-TIME SALE
// =====================================================

function addRealTimeSale() {

  const input =
    document.getElementById(
      "realTimeQuantity"
    );


  const quantity =
    Number(input.value);


  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {

    alert(
      "Enter a valid quantity sold."
    );

    return;
  }


  const sale = {

    quantity: quantity,

    time:
      new Date().toISOString(),

    day:
      getCurrentSalesDay()

  };


  // Add sale to saved data

  realTimeSales.push(sale);


  // Save permanently in browser

  localStorage.setItem(
    "realTimeSales",
    JSON.stringify(realTimeSales)
  );


  // Clear input

  input.value = "";


  // Update screen

  displayRealTimeSales();

}


// =====================================================
// DISPLAY SALES
// =====================================================

function displayRealTimeSales() {

  const history =
    document.getElementById(
      "realTimeHistory"
    );


  const dayDisplay =
    document.getElementById(
      "realTimeDay"
    );


  const totalDisplay =
    document.getElementById(
      "realTimeTotal"
    );


  if (!history) {
    return;
  }


  const currentDay =
    getCurrentSalesDay();


  // Show current day

  dayDisplay.textContent =
    "Sales Day " +
    currentDay;


  // Calculate current day total

  let todayTotal = 0;


  realTimeSales.forEach(
    function(sale) {

      if (
        sale.day === currentDay
      ) {

        todayTotal +=
          Number(sale.quantity);

      }

    }
  );


  totalDisplay.textContent =
    "Today's Total: " +
    todayTotal;


  // Clear history display

  history.innerHTML = "";


  if (
    realTimeSales.length === 0
  ) {

    history.innerHTML =
      "<p>No sales recorded yet.</p>";

    return;
  }


  // Find highest day

  const highestDay =
    Math.max(
      ...realTimeSales.map(
        sale => sale.day
      )
    );


  // Create each sales day

  for (
    let day = 1;
    day <= highestDay;
    day++
  ) {

    const daySales =
      realTimeSales.filter(
        sale => sale.day === day
      );


    if (
      daySales.length === 0
    ) {
      continue;
    }


    const dayBox =
      document.createElement("div");

    dayBox.className =
      "real-time-day";


    const heading =
      document.createElement("h3");

    heading.textContent =
      "Sales Day " + day;


    dayBox.appendChild(
      heading
    );


    let total = 0;


    daySales.forEach(
      function(sale) {

        total +=
          Number(sale.quantity);


        const entry =
          document.createElement("p");


        const time =
          new Date(sale.time);


        entry.textContent =
          time.toLocaleString() +
          " → " +
          sale.quantity +
          " stocks";


        dayBox.appendChild(
          entry
        );

      }
    );


    const totalText =
      document.createElement(
        "strong"
      );


    totalText.textContent =
      "Total Sold: " +
      total;


    dayBox.appendChild(
      totalText
    );


    history.appendChild(
      dayBox
    );

  }

}


// =====================================================
// CLEAR REAL-TIME SALES
// =====================================================

function clearRealTimeSales() {

  const confirmation =
    confirm(
      "Are you sure you want to delete all saved sales?"
    );


  if (!confirmation) {
    return;
  }


  realTimeSales = [];


  localStorage.removeItem(
    "realTimeSales"
  );


  displayRealTimeSales();

}


// =====================================================
// REAL-TIME BUTTONS
// =====================================================

const addRealTimeButton =
  document.getElementById(
    "addRealTimeSale"
  );


addRealTimeButton.addEventListener(
  "click",
  addRealTimeSale
);


const clearRealTimeButton =
  document.getElementById(
    "clearRealTimeSales"
  );


clearRealTimeButton.addEventListener(
  "click",
  clearRealTimeSales
);


// =====================================================
// LOAD SAVED DATA WHEN WEBSITE OPENS
// =====================================================

displayRealTimeSales();


// =====================================================
// CHECK FOR NEW SALES DAY
// EVERY MINUTE
// =====================================================

setInterval(
  displayRealTimeSales,
  60000
);

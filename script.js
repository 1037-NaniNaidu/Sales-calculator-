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

            const cost = Number(costInput.value) || 0;
            const stocks = Number(input.value) || 0;

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

            alert(
                "Enter stocks sold for Day " +
                (i + 1) +
                "."
            );

            stockInputs[i].focus();
            return;
        }

        const stocks = Number(value);
        const sale = stocks * cost;

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

// Load saved sales from browser storage

let realTimeSales = [];

try {

    realTimeSales =
        JSON.parse(
            localStorage.getItem("realTimeSales")
        ) || [];

} catch (error) {

    realTimeSales = [];

}


// =====================================================
// GET CURRENT CALENDAR SALES DAY
// =====================================================

function getCurrentSalesDay() {

    if (realTimeSales.length === 0) {
        return 1;
    }

    // Find the date of the first recorded sale

    const firstSaleDate =
        new Date(realTimeSales[0].time);

    const today =
        new Date();

    // Remove the time and keep only the date

    const firstDate =
        new Date(
            firstSaleDate.getFullYear(),
            firstSaleDate.getMonth(),
            firstSaleDate.getDate()
        );

    const currentDate =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

    const difference =
        currentDate - firstDate;

    const oneDay =
        24 * 60 * 60 * 1000;

    return (
        Math.floor(difference / oneDay) + 1
    );
}


// =====================================================
// ADD REAL-TIME SALE
// =====================================================

function addRealTimeSale() {

    const input =
        document.getElementById(
            "realTimeQuantity"
        );

    if (!input) {
        return;
    }

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


    // Add sale

    realTimeSales.push(sale);


    // Save sale permanently

    localStorage.setItem(
        "realTimeSales",
        JSON.stringify(realTimeSales)
    );


    // Clear input

    input.value = "";


    // Update tracker

    displayRealTimeSales();

}


// =====================================================
// DISPLAY REAL-TIME SALES
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


    // Stop if tracker elements don't exist

    if (
        !history ||
        !dayDisplay ||
        !totalDisplay
    ) {
        return;
    }


    const currentDay =
        getCurrentSalesDay();


    // Show current sales day

    dayDisplay.textContent =
        "Sales Day " + currentDay;


    // Calculate today's total

    let todayTotal = 0;


    realTimeSales.forEach(
        (sale) => {

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


    // Clear old history display

    history.innerHTML = "";


    // No sales yet

    if (
        realTimeSales.length === 0
    ) {

        history.innerHTML =
            "<p>No sales recorded yet.</p>";

        return;
    }


    // Find highest sales day

    const highestDay =
        Math.max(
            ...realTimeSales.map(
                sale => Number(sale.day)
            )
        );


    // Display each sales day

    for (
        let day = 1;
        day <= highestDay;
        day++
    ) {

        const daySales =
            realTimeSales.filter(
                sale =>
                    Number(sale.day) === day
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
            (sale) => {

                const quantity =
                    Number(sale.quantity);

                total += quantity;


                const entry =
                    document.createElement("p");


                const time =
                    new Date(sale.time);


                entry.textContent =
                    time.toLocaleString() +
                    " → " +
                    quantity +
                    " stocks";


                dayBox.appendChild(
                    entry
                );

            }
        );


        const totalText =
            document.createElement("strong");


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
// CONNECT REAL-TIME BUTTONS
// =====================================================

const addRealTimeButton =
    document.getElementById(
        "addRealTimeSale"
    );


if (addRealTimeButton) {

    addRealTimeButton.addEventListener(
        "click",
        addRealTimeSale
    );

}


const clearRealTimeButton =
    document.getElementById(
        "clearRealTimeSales"
    );


if (clearRealTimeButton) {

    clearRealTimeButton.addEventListener(
        "click",
        clearRealTimeSales
    );

}


// =====================================================
// LOAD SAVED SALES WHEN WEBSITE OPENS
// =====================================================

displayRealTimeSales();


// =====================================================
// UPDATE SALES DAY AUTOMATICALLY
// =====================================================

setInterval(
    displayRealTimeSales,
    60000
);

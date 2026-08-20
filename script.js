// =====================================================
// SALES CALCULATOR + LIVE SALES TRACKER
// =====================================================


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const costInput =
    document.getElementById("cost");

const daysInput =
    document.getElementById("days");

const startButton =
    document.getElementById("start");

const dailySection =
    document.getElementById("dailySection");

const dailyInputs =
    document.getElementById("dailyInputs");

const calculateButton =
    document.getElementById("calculate");

const result =
    document.getElementById("result");

const clearButton =
    document.getElementById("clear");

const realTimeQuantity =
    document.getElementById("realTimeQuantity");

const addRealTimeButton =
    document.getElementById("addRealTimeSale");

const clearRealTimeButton =
    document.getElementById("clearRealTimeSales");

const realTimeDay =
    document.getElementById("realTimeDay");

const realTimeTotal =
    document.getElementById("realTimeTotal");

const realTimeHistory =
    document.getElementById("realTimeHistory");


// =====================================================
// VARIABLES
// =====================================================

let stockInputs = [];


// =====================================================
// LOAD SAVED COST
// =====================================================

const savedCost =
    localStorage.getItem("salesCost");

if (savedCost !== null) {
    costInput.value = savedCost;
}


// =====================================================
// SAVE COST WHEN IT CHANGES
// =====================================================

costInput.addEventListener("input", () => {

    localStorage.setItem(
        "salesCost",
        costInput.value
    );

    updateAllSalesDisplays();

});


// =====================================================
// LOAD LIVE SALES
// =====================================================

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
// GET SALES DATE
// =====================================================

function getDateOnly(date) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

}


// =====================================================
// GET SALES DAY
// =====================================================

function getSalesDayForSale(sale) {

    if (!realTimeSales.length) {
        return 1;
    }


    const firstSale =
        new Date(realTimeSales[0].time);


    const saleDate =
        getDateOnly(
            new Date(sale.time)
        );


    const firstDate =
        getDateOnly(firstSale);


    const difference =
        saleDate - firstDate;


    const oneDay =
        24 * 60 * 60 * 1000;


    return (
        Math.floor(
            difference / oneDay
        ) + 1
    );

}


// =====================================================
// GET CURRENT SALES DAY
// =====================================================

function getCurrentSalesDay() {

    if (realTimeSales.length === 0) {
        return 1;
    }


    const firstSale =
        new Date(realTimeSales[0].time);


    const today =
        getDateOnly(
            new Date()
        );


    const firstDate =
        getDateOnly(firstSale);


    const difference =
        today - firstDate;


    const oneDay =
        24 * 60 * 60 * 1000;


    return (
        Math.floor(
            difference / oneDay
        ) + 1
    );

}


// =====================================================
// GET COST
// =====================================================

function getCost() {

    const cost =
        Number(costInput.value);

    if (
        !Number.isFinite(cost) ||
        cost < 0
    ) {
        return 0;
    }

    return cost;

}


// =====================================================
// ADD LIVE SALE
// =====================================================

function addRealTimeSale() {

    const quantity =
        Number(
            realTimeQuantity.value
        );


    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Enter a valid quantity sold."
        );

        realTimeQuantity.focus();

        return;
    }


    const sale = {

        quantity: quantity,

        time:
            new Date().toISOString()

    };


    // Add sale to the array

    realTimeSales.push(sale);


    // Save to browser

    localStorage.setItem(
        "realTimeSales",
        JSON.stringify(realTimeSales)
    );


    // Clear input

    realTimeQuantity.value = "";


    // Update everything

    updateAllSalesDisplays();


    realTimeQuantity.focus();

}


// =====================================================
// DISPLAY LIVE SALES
// =====================================================

function displayRealTimeSales() {

    if (
        !realTimeHistory ||
        !realTimeDay ||
        !realTimeTotal
    ) {
        return;
    }


    const currentDay =
        getCurrentSalesDay();


    // Current day heading

    realTimeDay.textContent =
        "Sales Day " + currentDay;


    // Current day total

    let todayQuantity = 0;


    realTimeSales.forEach(
        sale => {

            const day =
                getSalesDayForSale(sale);


            if (
                day === currentDay
            ) {

                todayQuantity +=
                    Number(sale.quantity);

            }

        }
    );


    const cost =
        getCost();


    const todayAmount =
        todayQuantity * cost;


    realTimeTotal.textContent =
        todayQuantity +
        " stocks = ₹" +
        todayAmount.toFixed(2);


    // Clear history

    realTimeHistory.innerHTML = "";


    // No sales

    if (
        realTimeSales.length === 0
    ) {

        realTimeHistory.innerHTML =
            "<p>No sales recorded yet.</p>";

        return;
    }


    // Find highest sales day

    let highestDay = 1;


    realTimeSales.forEach(
        sale => {

            const day =
                getSalesDayForSale(sale);

            if (
                day > highestDay
            ) {
                highestDay = day;
            }

        }
    );


    // Display every day separately

    for (
        let day = 1;
        day <= highestDay;
        day++
    ) {

        const daySales =
            realTimeSales.filter(
                sale =>
                    getSalesDayForSale(sale)
                    === day
            );


        if (
            daySales.length === 0
        ) {
            continue;
        }


        // -----------------------------------------
        // DAY BOX
        // -----------------------------------------

        const dayBox =
            document.createElement("div");

        dayBox.className =
            "real-time-day";


        // -----------------------------------------
        // DAY TITLE
        // -----------------------------------------

        const heading =
            document.createElement("h3");

        heading.textContent =
            "Sales Day " + day;


        dayBox.appendChild(
            heading
        );


        // -----------------------------------------
        // DAY QUANTITY
        // -----------------------------------------

        let dayQuantity = 0;


        daySales.forEach(
            sale => {

                dayQuantity +=
                    Number(sale.quantity);

            }
        );


        // -----------------------------------------
        // DAY AMOUNT
        // -----------------------------------------

        const dayAmount =
            dayQuantity * cost;


        // -----------------------------------------
        // DAY TOTAL DISPLAY
        // -----------------------------------------

        const dayTotal =
            document.createElement("p");


        dayTotal.innerHTML =
            "<strong>" +
            dayQuantity +
            " stocks</strong> = ₹" +
            dayAmount.toFixed(2);


        dayBox.appendChild(
            dayTotal
        );


        // -----------------------------------------
        // INDIVIDUAL SALES
        // -----------------------------------------

        daySales.forEach(
            sale => {

                const entry =
                    document.createElement("p");


                const time =
                    new Date(
                        sale.time
                    );


                entry.textContent =
                    time.toLocaleTimeString() +
                    " → " +
                    sale.quantity +
                    " stocks";


                dayBox.appendChild(
                    entry
                );

            }
        );


        // Add day to history

        realTimeHistory.appendChild(
            dayBox
        );

    }

}


// =====================================================
// START OLD DAILY CALCULATOR
// =====================================================

startButton.addEventListener(
    "click",
    () => {

        const days =
            Number(
                daysInput.value
            );


        if (
            !Number.isInteger(days) ||
            days < 1 ||
            days > 366
        ) {

            alert(
                "Enter a whole number of days from 1 to 366."
            );

            return;
        }


        dailyInputs.innerHTML = "";

        stockInputs = [];


        // -----------------------------------------
        // CREATE DAILY ROWS
        // -----------------------------------------

        for (
            let i = 1;
            i <= days;
            i++
        ) {

            const box =
                document.createElement("div");

            box.className =
                "day";


            const title =
                document.createElement("div");

            title.className =
                "day-title";

            title.textContent =
                "Day " + i;


            const input =
                document.createElement("input");

            input.type =
                "number";

            input.min =
                "0";

            input.step =
                "1";

            input.placeholder =
                "Number of stocks sold";


            const dailyTotal =
                document.createElement("div");

            dailyTotal.className =
                "daily-total";

            dailyTotal.textContent =
                "Daily sale: ₹0.00";


            // -----------------------------------------
            // UPDATE DAILY AMOUNT
            // -----------------------------------------

            input.addEventListener(
                "input",
                () => {

                    const stocks =
                        Number(
                            input.value
                        ) || 0;


                    const cost =
                        getCost();


                    dailyTotal.textContent =
                        "Daily sale: ₹" +
                        (
                            stocks * cost
                        ).toFixed(2);

                }
            );


            box.append(
                title,
                input,
                dailyTotal
            );


            dailyInputs.appendChild(
                box
            );


            stockInputs.push(
                input
            );

        }


        dailySection.classList.remove(
            "hidden"
        );


        result.classList.add(
            "hidden"
        );


        dailySection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// =====================================================
// CALCULATE MANUAL DAILY SALES
// =====================================================

calculateButton.addEventListener(
    "click",
    () => {

        const cost =
            Number(
                costInput.value
            );


        if (
            !Number.isFinite(cost) ||
            cost < 0
        ) {

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


            totalStocks +=
                stocks;


            totalSales +=
                sale;


            rows += `
                <div class="summary-row">
                    Day ${i + 1}:
                    ${stocks} stocks =
                    ₹${sale.toFixed(2)}
                </div>
            `;

        }


        result.innerHTML = `

            <h2>Calculator Summary</h2>

            ${rows}

            <hr>

            <div class="summary-row">
                <b>Total Stock Sold:</b>
                ${totalStocks}
            </div>

            <div class="summary-row total">
                Total Sales:
                ₹${totalSales.toFixed(2)}
            </div>

        `;


        result.classList.remove(
            "hidden"
        );


        result.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// =====================================================
// GRAND TOTAL OF LIVE SALES
// =====================================================

function displayGrandTotal() {

    if (!realTimeHistory) {
        return;
    }


    let totalQuantity = 0;


    realTimeSales.forEach(
        sale => {

            totalQuantity +=
                Number(sale.quantity);

        }
    );


    const cost =
        getCost();


    const totalAmount =
        totalQuantity * cost;


    const grandTotal =
        document.createElement("div");


    grandTotal.className =
        "grand-total";


    grandTotal.innerHTML = `

        <hr>

        <h2>Grand Total</h2>

        <p>
            <strong>
                ${totalQuantity} stocks
            </strong>
        </p>

        <p>
            Total Sales:
            <strong>
                ₹${totalAmount.toFixed(2)}
            </strong>
        </p>

    `;


    realTimeHistory.appendChild(
        grandTotal
    );

}


// =====================================================
// UPDATE EVERYTHING
// =====================================================

function updateAllSalesDisplays() {

    displayRealTimeSales();

    displayGrandTotal();

}


// =====================================================
// CLEAR CALCULATOR
// =====================================================

clearButton.addEventListener(
    "click",
    () => {

        costInput.value = "";

        daysInput.value = "";

        localStorage.removeItem(
            "salesCost"
        );


        dailyInputs.innerHTML = "";

        stockInputs = [];


        dailySection.classList.add(
            "hidden"
        );


        result.classList.add(
            "hidden"
        );


        result.innerHTML = "";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// =====================================================
// CLEAR LIVE SALES
// =====================================================

clearRealTimeButton.addEventListener(
    "click",
    () => {

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


        updateAllSalesDisplays();

    }
);


// =====================================================
// BUTTON CONNECTIONS
// =====================================================

if (addRealTimeButton) {

    addRealTimeButton.addEventListener(
        "click",
        addRealTimeSale
    );

}


// =====================================================
// LOAD DATA WHEN WEBSITE OPENS
// =====================================================

updateAllSalesDisplays();


// =====================================================
// UPDATE AUTOMATICALLY EVERY MINUTE
// =====================================================

setInterval(
    updateAllSalesDisplays,
    60000
);

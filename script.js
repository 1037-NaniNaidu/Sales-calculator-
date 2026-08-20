// =====================================================
// COMBINED SALES CALCULATOR
// + AUTOMATIC REAL-TIME SALES TRACKER
// =====================================================


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const costInput =
    document.getElementById("cost");

const quantityInput =
    document.getElementById("quantity");

const addSaleButton =
    document.getElementById("addSale");

const currentDayDisplay =
    document.getElementById("currentDay");

const todayTotalDisplay =
    document.getElementById("todayTotal");

const salesHistory =
    document.getElementById("salesHistory");

const grandTotalDisplay =
    document.getElementById("grandTotal");

const clearSalesButton =
    document.getElementById("clearSales");


// =====================================================
// LOAD SAVED COST
// =====================================================

const savedCost =
    localStorage.getItem("salesCost");


if (savedCost !== null) {

    costInput.value = savedCost;

}


// =====================================================
// SAVE COST
// =====================================================

costInput.addEventListener(
    "input",
    function () {

        localStorage.setItem(
            "salesCost",
            costInput.value
        );

        displayAllSales();

    }
);


// =====================================================
// LOAD SAVED SALES
// =====================================================

let sales = [];


try {

    sales =
        JSON.parse(
            localStorage.getItem("salesData")
        ) || [];

} catch (error) {

    sales = [];

}


// =====================================================
// GET DATE ONLY
// =====================================================

function getDateOnly(date) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

}


// =====================================================
// GET FIRST SALES DATE
// =====================================================

function getFirstSalesDate() {

    if (sales.length === 0) {

        return getDateOnly(
            new Date()
        );

    }


    return getDateOnly(
        new Date(
            sales[0].time
        )
    );

}


// =====================================================
// GET CURRENT SALES DAY
// =====================================================

function getCurrentSalesDay() {

    if (sales.length === 0) {

        return 1;

    }


    const firstDate =
        getFirstSalesDate();


    const today =
        getDateOnly(
            new Date()
        );


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
// GET DAY NUMBER OF A SALE
// =====================================================

function getSaleDay(sale) {

    const firstDate =
        getFirstSalesDate();


    const saleDate =
        getDateOnly(
            new Date(
                sale.time
            )
        );


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
// GET COST
// =====================================================

function getCost() {

    const cost =
        Number(
            costInput.value
        );


    if (
        !Number.isFinite(cost) ||
        cost < 0
    ) {

        return 0;

    }


    return cost;

}


// =====================================================
// ADD SALE
// =====================================================

function addSale() {

    const quantity =
        Number(
            quantityInput.value
        );


    // Check quantity

    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Enter a valid number of stocks sold."
        );

        quantityInput.focus();

        return;

    }


    // Check cost

    const cost =
        Number(
            costInput.value
        );


    if (
        !Number.isFinite(cost) ||
        cost < 0
    ) {

        alert(
            "Enter the cost per stock first."
        );

        costInput.focus();

        return;

    }


    // Create the sale

    const sale = {

        quantity: quantity,

        time:
            new Date().toISOString()

    };


    // Save in memory

    sales.push(sale);


    // Save permanently in browser

    localStorage.setItem(
        "salesData",
        JSON.stringify(sales)
    );


    // Clear the ONE input

    quantityInput.value = "";


    // Automatically update calculator
    // and real-time tracker

    displayAllSales();


    // Ready for next sale

    quantityInput.focus();

}


// =====================================================
// DISPLAY EVERYTHING
// =====================================================

function displayAllSales() {

    const cost =
        getCost();


    const currentDay =
        getCurrentSalesDay();


    // =================================================
    // CURRENT DAY
    // =================================================

    currentDayDisplay.textContent =
        "Sales Day " +
        currentDay;


    // =================================================
    // TODAY'S TOTAL
    // =================================================

    let todayQuantity = 0;


    sales.forEach(
        function (sale) {

            if (
                getSaleDay(sale)
                === currentDay
            ) {

                todayQuantity +=
                    Number(
                        sale.quantity
                    );

            }

        }
    );


    const todayAmount =
        todayQuantity * cost;


    todayTotalDisplay.textContent =
        todayQuantity +
        " stocks = ₹" +
        todayAmount.toFixed(2);


    // =================================================
    // CLEAR HISTORY DISPLAY
    // =================================================

    salesHistory.innerHTML = "";


    // =================================================
    // NO SALES
    // =================================================

    if (sales.length === 0) {

        salesHistory.innerHTML =
            "<p>No sales recorded yet.</p>";

        updateGrandTotal();

        return;

    }


    // =================================================
    // FIND LAST DAY
    // =================================================

    let highestDay = 1;


    sales.forEach(
        function (sale) {

            const day =
                getSaleDay(sale);


            if (
                day > highestDay
            ) {

                highestDay = day;

            }

        }
    );


    // =================================================
    // DISPLAY EACH DAY SEPARATELY
    // =================================================

    for (
        let day = 1;
        day <= highestDay;
        day++
    ) {


        const daySales =
            sales.filter(
                function (sale) {

                    return (
                        getSaleDay(sale)
                        === day
                    );

                }
            );


        if (
            daySales.length === 0
        ) {

            continue;

        }


        // =============================================
        // DAY BOX
        // =============================================

        const dayBox =
            document.createElement(
                "div"
            );


        dayBox.className =
            "real-time-day";


        // =============================================
        // DAY HEADING
        // =============================================

        const heading =
            document.createElement(
                "h3"
            );


        heading.textContent =
            "Sales Day " +
            day;


        dayBox.appendChild(
            heading
        );


        // =============================================
        // DAY TOTAL
        // =============================================

        let dayQuantity = 0;


        daySales.forEach(
            function (sale) {

                dayQuantity +=
                    Number(
                        sale.quantity
                    );

            }
        );


        const dayAmount =
            dayQuantity * cost;


        const dayTotal =
            document.createElement(
                "p"
            );


        dayTotal.innerHTML =
            "<strong>" +
            dayQuantity +
            " stocks</strong> = ₹" +
            dayAmount.toFixed(2);


        dayBox.appendChild(
            dayTotal
        );


        // =============================================
        // INDIVIDUAL SALES
        // =============================================

        daySales.forEach(
            function (sale) {

                const entry =
                    document.createElement(
                        "p"
                    );


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


        // =============================================
        // ADD TO TRACKER
        // =============================================

        salesHistory.appendChild(
            dayBox
        );

    }


    // =================================================
    // GRAND TOTAL
    // =================================================

    updateGrandTotal();

}


// =====================================================
// GRAND TOTAL
// =====================================================

function updateGrandTotal() {

    let totalQuantity = 0;


    sales.forEach(
        function (sale) {

            totalQuantity +=
                Number(
                    sale.quantity
                );

        }
    );


    const cost =
        getCost();


    const totalAmount =
        totalQuantity * cost;


    grandTotalDisplay.innerHTML = `

        <h2>Grand Total</h2>

        <p>
            <strong>
                ${totalQuantity} stocks
            </strong>
            = ₹${totalAmount.toFixed(2)}
        </p>

    `;

}


// =====================================================
// ADD SALE BUTTON
// =====================================================

addSaleButton.addEventListener(
    "click",
    addSale
);


// =====================================================
// ENTER KEY ALSO ADDS SALE
// =====================================================

quantityInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            addSale();

        }

    }
);


// =====================================================
// CLEAR ALL SALES
// =====================================================

clearSalesButton.addEventListener(
    "click",
    function () {

        if (
            sales.length === 0
        ) {

            return;

        }


        const confirmation =
            confirm(
                "Are you sure you want to delete all saved sales?"
            );


        if (!confirmation) {

            return;

        }


        // Delete sales

        sales = [];


        localStorage.removeItem(
            "salesData"
        );


        // Update screen

        displayAllSales();

    }
);


// =====================================================
// INITIAL LOAD
// =====================================================

displayAllSales();


// =====================================================
// CHECK FOR NEW DAY EVERY MINUTE
// =====================================================

setInterval(
    displayAllSales,
    60000
);

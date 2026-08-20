// =====================================================
// COMBINED SALES CALCULATOR + REAL-TIME SALES TRACKER
// =====================================================


// =====================================================
// GET ELEMENTS
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
// SAVE COST AUTOMATICALLY
// =====================================================

costInput.addEventListener(
    "input",
    () => {

        localStorage.setItem(
            "salesCost",
            costInput.value
        );

        displaySales();

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
// GET DATE WITHOUT TIME
// =====================================================

function getDateOnly(date) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

}


// =====================================================
// GET THE FIRST SALES DATE
// =====================================================

function getFirstSalesDate() {

    if (sales.length === 0) {
        return getDateOnly(new Date());
    }

    return getDateOnly(
        new Date(sales[0].time)
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
        getDateOnly(new Date());


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
// GET DAY NUMBER FOR A SALE
// =====================================================

function getSaleDay(sale) {

    const firstDate =
        getFirstSalesDate();


    const saleDate =
        getDateOnly(
            new Date(sale.time)
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
// ADD SALE
// =====================================================

function addSale() {

    const quantity =
        Number(
            quantityInput.value
        );


    // Validate quantity

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


    // Validate cost

    const cost =
        Number(costInput.value);


    if (
        !Number.isFinite(cost) ||
        cost < 0
    ) {

        alert(
            "Enter a valid cost per stock first."
        );

        costInput.focus();

        return;

    }


    // Create sale

    const newSale = {

        quantity: quantity,

        time:
            new Date().toISOString()

    };


    // Add sale

    sales.push(newSale);


    // Save automatically

    localStorage.setItem(
        "salesData",
        JSON.stringify(sales)
    );


    // Clear quantity input

    quantityInput.value = "";


    // Update calculator and tracker

    displaySales();


    // Put cursor back in quantity box

    quantityInput.focus();

}


// =====================================================
// DISPLAY EVERYTHING
// =====================================================

function displaySales() {

    const cost =
        getCost();


    const currentDay =
        getCurrentSalesDay();


    // -----------------------------------------------
    // CURRENT DAY
    // -----------------------------------------------

    currentDayDisplay.textContent =
        "Sales Day " + currentDay;


    // -----------------------------------------------
    // CALCULATE TODAY'S TOTAL
    // -----------------------------------------------

    let todayQuantity = 0;


    sales.forEach(
        sale => {

            if (
                getSaleDay(sale)
                === currentDay
            ) {

                todayQuantity +=
                    Number(sale.quantity);

            }

        }
    );


    const todayAmount =
        todayQuantity * cost;


    todayTotalDisplay.textContent =
        todayQuantity +
        " stocks = ₹" +
        todayAmount.toFixed(2);


    // -----------------------------------------------
    // CLEAR HISTORY
    // -----------------------------------------------

    salesHistory.innerHTML = "";


    // -----------------------------------------------
    // NO SALES
    // -----------------------------------------------

    if (sales.length === 0) {

        salesHistory.innerHTML =
            "<p>No sales recorded yet.</p>";

        updateGrandTotal();

        return;

    }


    // -----------------------------------------------
    // FIND HIGHEST DAY
    // -----------------------------------------------

    let highestDay = 1;


    sales.forEach(
        sale => {

            const day =
                getSaleDay(sale);


            if (
                day > highestDay
            ) {

                highestDay = day;

            }

        }
    );


    // -----------------------------------------------
    // DISPLAY EACH DAY
    // -----------------------------------------------

    for (
        let day = 1;
        day <= highestDay;
        day++
    ) {

        const daySales =
            sales.filter(
                sale =>
                    getSaleDay(sale)
                    === day
            );


        if (
            daySales.length === 0
        ) {

            continue;

        }


        // -------------------------------------------
        // DAY CONTAINER
        // -------------------------------------------

        const dayBox =
            document.createElement("div");


        dayBox.className =
            "real-time-day";


        // -------------------------------------------
        // DAY HEADING
        // -------------------------------------------

        const heading =
            document.createElement("h3");


        heading.textContent =
            "Sales Day " + day;


        dayBox.appendChild(
            heading
        );


        // -------------------------------------------
        // CALCULATE DAY TOTAL
        // -------------------------------------------

        let dayQuantity = 0;


        daySales.forEach(
            sale => {

                dayQuantity +=
                    Number(sale.quantity);

            }
        );


        const dayAmount =
            dayQuantity * cost;


        // -------------------------------------------
        // DAY TOTAL
        // -------------------------------------------

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


        // -------------------------------------------
        // INDIVIDUAL SALES
        // -------------------------------------------

        daySales.forEach(
            sale => {

                const entry =
                    document.createElement("p");


                const saleTime =
                    new Date(
                        sale.time
                    );


                entry.textContent =
                    saleTime.toLocaleTimeString() +
                    " → " +
                    sale.quantity +
                    " stocks";


                dayBox.appendChild(
                    entry
                );

            }
        );


        // -------------------------------------------
        // ADD DAY TO TRACKER
        // -------------------------------------------

        salesHistory.appendChild(
            dayBox
        );

    }


    // -----------------------------------------------
    // UPDATE GRAND TOTAL
    // -----------------------------------------------

    updateGrandTotal();

}


// =====================================================
// GRAND TOTAL
// =====================================================

function updateGrandTotal() {

    let totalQuantity = 0;


    sales.forEach(
        sale => {

            totalQuantity +=
                Number(sale.quantity);

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
// PRESS ENTER TO ADD SALE
// =====================================================

quantityInput.addEventListener(
    "keydown",
    event => {

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
    () => {

        if (sales.length === 0) {

            return;

        }


        const confirmation =
            confirm(
                "Are you sure you want to delete all sales?"
            );


        if (!confirmation) {

            return;

        }


        // Delete saved sales

        sales = [];


        localStorage.removeItem(
            "salesData"
        );


        // Update screen

        displaySales();

    }
);


// =====================================================
// INITIAL DISPLAY
// =====================================================

displaySales();


// =====================================================
// CHECK FOR NEW DAY
// =====================================================

setInterval(
    displaySales,
    60000
);

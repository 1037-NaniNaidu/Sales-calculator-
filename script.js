// =====================================================
// STORE SALES MANAGER
// =====================================================


// =====================================================
// GET ELEMENTS
// =====================================================

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const addProductButton =
    document.getElementById("addProduct");

const productList =
    document.getElementById("productList");


const customerName =
    document.getElementById("customerName");

const addCustomerButton =
    document.getElementById("addCustomer");

const customerList =
    document.getElementById("customerList");


const saleCustomer =
    document.getElementById("saleCustomer");

const saleProduct =
    document.getElementById("saleProduct");

const saleQuantity =
    document.getElementById("saleQuantity");

const selectedPrice =
    document.getElementById("selectedPrice");

const saleAmount =
    document.getElementById("saleAmount");

const addSaleButton =
    document.getElementById("addSale");


const currentDay =
    document.getElementById("currentDay");

const dailySales =
    document.getElementById("dailySales");

const customerSales =
    document.getElementById("customerSales");

const overallTotal =
    document.getElementById("overallTotal");

const clearAll =
    document.getElementById("clearAll");


// =====================================================
// DATA
// =====================================================

let products =
    JSON.parse(
        localStorage.getItem("storeProducts")
    ) || [];


let customers =
    JSON.parse(
        localStorage.getItem("storeCustomers")
    ) || [];


let sales =
    JSON.parse(
        localStorage.getItem("storeSales")
    ) || [];


// =====================================================
// SAVE DATA
// =====================================================

function saveProducts() {

    localStorage.setItem(
        "storeProducts",
        JSON.stringify(products)
    );

}


function saveCustomers() {

    localStorage.setItem(
        "storeCustomers",
        JSON.stringify(customers)
    );

}


function saveSales() {

    localStorage.setItem(
        "storeSales",
        JSON.stringify(sales)
    );

}


// =====================================================
// CREATE ID
// =====================================================

function createId() {

    return (
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2)
    );

}


// =====================================================
// ADD PRODUCT
// =====================================================

function addProduct() {

    const name =
        productName.value.trim();

    const price =
        Number(productPrice.value);


    if (name === "") {

        alert("Enter a product name.");

        productName.focus();

        return;

    }


    if (
        productPrice.value === "" ||
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert("Enter a valid product price.");

        productPrice.focus();

        return;

    }


    const exists =
        products.some(
            product =>
                product.name.toLowerCase()
                === name.toLowerCase()
        );


    if (exists) {

        alert(
            "This product already exists."
        );

        return;

    }


    products.push({

        id: createId(),

        name: name,

        price: price

    });


    saveProducts();


    productName.value = "";

    productPrice.value = "";


    displayProducts();

    updateProductDropdown();

}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts() {

    productList.innerHTML = "";


    if (products.length === 0) {

        productList.innerHTML =
            "<p>No products added yet.</p>";

        return;

    }


    products.forEach(
        product => {

            const box =
                document.createElement("div");


            const text =
                document.createElement("p");


            text.textContent =
                product.name +
                " — ₹" +
                Number(product.price)
                    .toFixed(2);


            const deleteButton =
                document.createElement("button");


            deleteButton.type = "button";

            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function() {

                    products =
                        products.filter(
                            item =>
                                item.id !==
                                product.id
                        );


                    saveProducts();

                    displayProducts();

                    updateProductDropdown();

                }
            );


            box.appendChild(text);

            box.appendChild(
                deleteButton
            );

            productList.appendChild(box);

        }
    );

}


// =====================================================
// UPDATE PRODUCT DROPDOWN
// =====================================================

function updateProductDropdown() {

    saleProduct.innerHTML = "";

    const firstOption =
        document.createElement("option");

    firstOption.value = "";

    firstOption.textContent =
        "Select Product";

    saleProduct.appendChild(
        firstOption
    );


    products.forEach(
        product => {

            const option =
                document.createElement("option");

            option.value =
                product.id;

            option.textContent =
                product.name;

            saleProduct.appendChild(
                option
            );

        }
    );


    updateSaleAmount();

}


// =====================================================
// ADD CUSTOMER
// =====================================================

function addCustomer() {

    const name =
        customerName.value.trim();


    if (name === "") {

        alert(
            "Enter a customer name."
        );

        customerName.focus();

        return;

    }


    const exists =
        customers.some(
            customer =>
                customer.name.toLowerCase()
                === name.toLowerCase()
        );


    if (exists) {

        alert(
            "This customer already exists."
        );

        return;

    }


    customers.push({

        id: createId(),

        name: name

    });


    saveCustomers();


    customerName.value = "";


    displayCustomers();

    updateCustomerDropdown();

}


// =====================================================
// DISPLAY CUSTOMERS
// =====================================================

function displayCustomers() {

    customerList.innerHTML = "";


    if (customers.length === 0) {

        customerList.innerHTML =
            "<p>No customers added yet.</p>";

        return;

    }


    customers.forEach(
        customer => {

            const box =
                document.createElement("div");


            const text =
                document.createElement("p");


            text.textContent =
                customer.name;


            const deleteButton =
                document.createElement("button");


            deleteButton.type = "button";

            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function() {

                    customers =
                        customers.filter(
                            item =>
                                item.id !==
                                customer.id
                        );


                    saveCustomers();

                    displayCustomers();

                    updateCustomerDropdown();

                }
            );


            box.appendChild(text);

            box.appendChild(
                deleteButton
            );

            customerList.appendChild(box);

        }
    );

}


// =====================================================
// UPDATE CUSTOMER DROPDOWN
// =====================================================

function updateCustomerDropdown() {

    saleCustomer.innerHTML = "";


    const firstOption =
        document.createElement("option");

    firstOption.value = "";

    firstOption.textContent =
        "Walk-in / No Regular Customer";

    saleCustomer.appendChild(
        firstOption
    );


    customers.forEach(
        customer => {

            const option =
                document.createElement("option");

            option.value =
                customer.id;

            option.textContent =
                customer.name;

            saleCustomer.appendChild(
                option
            );

        }
    );

}


// =====================================================
// UPDATE PRICE
// =====================================================

function updateSaleAmount() {

    const product =
        products.find(
            item =>
                item.id ===
                saleProduct.value
        );


    if (!product) {

        selectedPrice.textContent =
            "Price: ₹0.00";

        saleAmount.textContent =
            "Sale Amount: ₹0.00";

        return;

    }


    selectedPrice.textContent =
        "Price: ₹" +
        Number(product.price)
            .toFixed(2);


    const quantity =
        Number(saleQuantity.value);


    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        saleAmount.textContent =
            "Sale Amount: ₹0.00";

        return;

    }


    saleAmount.textContent =
        "Sale Amount: ₹" +
        (
            product.price *
            quantity
        ).toFixed(2);

}


// =====================================================
// GET DATE
// =====================================================

function getDateString(date) {

    return (
        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            date.getDate()
        ).padStart(2, "0")
    );

}


// =====================================================
// GET SALES DAY
// =====================================================

function getSalesDay(dateString) {

    if (sales.length === 0) {

        return 1;

    }


    const firstDate =
        new Date(
            sales[0].date +
            "T00:00:00"
        );


    const thisDate =
        new Date(
            dateString +
            "T00:00:00"
        );


    const difference =
        thisDate - firstDate;


    return (
        Math.floor(
            difference /
            (24 * 60 * 60 * 1000)
        ) + 1
    );

}


// =====================================================
// ADD SALE
// =====================================================

function addSale() {

    const product =
        products.find(
            item =>
                item.id ===
                saleProduct.value
        );


    const quantity =
        Number(
            saleQuantity.value
        );


    const customer =
        customers.find(
            item =>
                item.id ===
                saleCustomer.value
        );


    // PRODUCT CHECK

    if (!product) {

        alert(
            "Please select a product."
        );

        saleProduct.focus();

        return;

    }


    // QUANTITY CHECK

    if (
        saleQuantity.value === "" ||
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Please enter a valid quantity."
        );

        saleQuantity.focus();

        return;

    }


    const now =
        new Date();


    const date =
        getDateString(now);


    const day =
        getSalesDay(date);


    const newSale = {

        id:
            createId(),

        date:
            date,

        day:
            day,

        time:
            now.toISOString(),

        productId:
            product.id,

        productName:
            product.name,

        price:
            Number(product.price),

        quantity:
            quantity,

        amount:
            Number(product.price) *
            quantity,

        customerId:
            customer
                ? customer.id
                : "",

        customerName:
            customer
                ? customer.name
                : ""

    };


    sales.push(newSale);


    saveSales();


    // RESET INPUT

    saleProduct.value = "";

    saleQuantity.value = "";

    saleCustomer.value = "";


    selectedPrice.textContent =
        "Price: ₹0.00";


    saleAmount.textContent =
        "Sale Amount: ₹0.00";


    // UPDATE SCREEN

    displayAll();

}


// =====================================================
// DAILY SALES
// =====================================================

function displayDailySales() {

    dailySales.innerHTML = "";


    if (sales.length === 0) {

        dailySales.innerHTML =
            "<p>No sales recorded yet.</p>";

        return;

    }


    const days = {};


    sales.forEach(
        sale => {

            if (!days[sale.day]) {

                days[sale.day] = [];

            }


            days[sale.day].push(
                sale
            );

        }
    );


    Object.keys(days)
        .map(Number)
        .sort(
            (a, b) =>
                a - b
        )
        .forEach(
            day => {

                const box =
                    document.createElement("div");


                box.className =
                    "real-time-day";


                const heading =
                    document.createElement("h3");


                heading.textContent =
                    "Sales Day " + day;


                box.appendChild(
                    heading
                );


                const productTotals = {};

                let dayTotal = 0;

                let totalQuantity = 0;


                days[day].forEach(
                    sale => {

                        dayTotal +=
                            sale.amount;

                        totalQuantity +=
                            sale.quantity;


                        if (
                            !productTotals[
                                sale.productName
                            ]
                        ) {

                            productTotals[
                                sale.productName
                            ] = {

                                quantity: 0,

                                amount: 0

                            };

                        }


                        productTotals[
                            sale.productName
                        ].quantity +=
                            sale.quantity;


                        productTotals[
                            sale.productName
                        ].amount +=
                            sale.amount;

                    }
                );


                Object.keys(
                    productTotals
                ).forEach(
                    productName => {

                        const data =
                            productTotals[
                                productName
                            ];


                        const row =
                            document.createElement(
                                "p"
                            );


                        row.textContent =
                            productName +
                            ": " +
                            data.quantity +
                            " × = ₹" +
                            data.amount
                                .toFixed(2);


                        box.appendChild(
                            row
                        );

                    }
                );


                const total =
                    document.createElement(
                        "p"
                    );


                total.innerHTML =
                    "<strong>" +
                    "Day " +
                    day +
                    " Grand Total: ₹" +
                    dayTotal.toFixed(2) +
                    "</strong>" +
                    "<br>" +
                    "Total Stocks: " +
                    totalQuantity;


                box.appendChild(
                    total
                );


                dailySales.appendChild(
                    box
                );

            }
        );

}


// =====================================================
// CUSTOMER SALES
// =====================================================

function displayCustomerSales() {

    customerSales.innerHTML = "";


    let foundCustomerSales = false;


    customers.forEach(
        customer => {

            const customerRecords =
                sales.filter(
                    sale =>
                        sale.customerId ===
                        customer.id
                );


            if (
                customerRecords.length === 0
            ) {

                return;

            }


            foundCustomerSales = true;


            const box =
                document.createElement("div");


            box.className =
                "customer-sales";


            const heading =
                document.createElement("h3");


            heading.textContent =
                "👤 " +
                customer.name;


            box.appendChild(
                heading
            );


            const days = {};


            customerRecords.forEach(
                sale => {

                    if (!days[sale.day]) {

                        days[sale.day] = [];

                    }


                    days[sale.day].push(
                        sale
                    );

                }
            );


            let customerOverall = 0;


            Object.keys(days)
                .map(Number)
                .sort(
                    (a, b) =>
                        a - b
                )
                .forEach(
                    day => {

                        const dayTitle =
                            document.createElement(
                                "h4"
                            );


                        dayTitle.textContent =
                            "Day " + day;


                        box.appendChild(
                            dayTitle
                        );


                        let dayTotal = 0;


                        days[day].forEach(
                            sale => {

                                dayTotal +=
                                    sale.amount;


                                const row =
                                    document.createElement(
                                        "p"
                                    );


                                row.textContent =
                                    sale.productName +
                                    " — " +
                                    sale.quantity +
                                    " × ₹" +
                                    sale.price
                                        .toFixed(2) +
                                    " = ₹" +
                                    sale.amount
                                        .toFixed(2);


                                box.appendChild(
                                    row
                                );

                            }
                        );


   
             

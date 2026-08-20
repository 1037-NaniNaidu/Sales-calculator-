// =====================================================
// STORE SALES MANAGEMENT SYSTEM
// =====================================================
// Products
// Prices
// Regular Customers
// Daily Sales
// Individual Customer History
// Individual Customer Overall Total
// =====================================================


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const productNameInput =
    document.getElementById("productName");

const productPriceInput =
    document.getElementById("productPrice");

const addProductButton =
    document.getElementById("addProduct");

const productList =
    document.getElementById("productList");


const customerNameInput =
    document.getElementById("customerName");

const addCustomerButton =
    document.getElementById("addCustomer");

const customerList =
    document.getElementById("customerList");


const saleProduct =
    document.getElementById("saleProduct");

const saleCustomer =
    document.getElementById("saleCustomer");

const saleQuantity =
    document.getElementById("saleQuantity");

const selectedPrice =
    document.getElementById("selectedPrice");

const saleAmount =
    document.getElementById("saleAmount");

const addSaleButton =
    document.getElementById("addSale");


const currentDayDisplay =
    document.getElementById("currentDay");

const dailySales =
    document.getElementById("dailySales");

const customerSales =
    document.getElementById("customerSales");

const overallTotal =
    document.getElementById("overallTotal");

const clearAllButton =
    document.getElementById("clearAll");


// =====================================================
// LOAD SAVED DATA
// =====================================================

let products = [];
let customers = [];
let sales = [];


try {

    products =
        JSON.parse(
            localStorage.getItem("storeProducts")
        ) || [];

} catch (error) {

    products = [];

}


try {

    customers =
        JSON.parse(
            localStorage.getItem("storeCustomers")
        ) || [];

} catch (error) {

    customers = [];

}


try {

    sales =
        JSON.parse(
            localStorage.getItem("storeSales")
        ) || [];

} catch (error) {

    sales = [];

}


// =====================================================
// SAVE FUNCTIONS
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
// CREATE UNIQUE ID
// =====================================================

function createId() {

    return (
        Date.now().toString() +
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
        productNameInput.value.trim();

    const price =
        Number(
            productPriceInput.value
        );


    if (name === "") {

        alert(
            "Enter a product name."
        );

        productNameInput.focus();

        return;

    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert(
            "Enter a valid product price."
        );

        productPriceInput.focus();

        return;

    }


    const alreadyExists =
        products.some(
            product =>
                product.name.toLowerCase()
                === name.toLowerCase()
        );


    if (alreadyExists) {

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


    productNameInput.value = "";
    productPriceInput.value = "";


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
        function(product) {

            const box =
                document.createElement("div");

            box.className =
                "product-item";


            const text =
                document.createElement("p");


            text.textContent =
                product.name +
                " — ₹" +
                product.price.toFixed(2);


            const editButton =
                document.createElement("button");


            editButton.textContent =
                "Edit Price";


            editButton.addEventListener(
                "click",
                function() {

                    editProductPrice(
                        product.id
                    );

                }
            );


            const deleteButton =
                document.createElement("button");


            deleteButton.textContent =
                "Delete";


            deleteButton.className =
                "secondary";


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteProduct(
                        product.id
                    );

                }
            );


            box.append(
                text,
                editButton,
                deleteButton
            );


            productList.appendChild(
                box
            );

        }
    );

}


// =====================================================
// EDIT PRODUCT PRICE
// =====================================================

function editProductPrice(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {
        return;
    }


    const newPrice =
        prompt(
            "Enter new price for " +
            product.name,
            product.price
        );


    if (newPrice === null) {
        return;
    }


    const price =
        Number(newPrice);


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert(
            "Enter a valid price."
        );

        return;

    }


    product.price = price;


    saveProducts();


    displayProducts();
    updateProductDropdown();
    updateSaleCalculation();

}


// =====================================================
// DELETE PRODUCT
// =====================================================

function deleteProduct(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {
        return;
    }


    const confirmation =
        confirm(
            "Delete " +
            product.name +
            " from the product list?"
        );


    if (!confirmation) {
        return;
    }


    products =
        products.filter(
            item =>
                item.id !== productId
        );


    saveProducts();


    displayProducts();
    updateProductDropdown();

}


// =====================================================
// PRODUCT DROPDOWN
// =====================================================

function updateProductDropdown() {

    saleProduct.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Select Product";

    saleProduct.appendChild(
        defaultOption
    );


    products.forEach(
        function(product) {

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


    updateSaleCalculation();

}


// =====================================================
// ADD CUSTOMER
// =====================================================

function addCustomer() {

    const name =
        customerNameInput.value.trim();


    if (name === "") {

        alert(
            "Enter a customer name."
        );

        customerNameInput.focus();

        return;

    }


    const alreadyExists =
        customers.some(
            customer =>
                customer.name.toLowerCase()
                === name.toLowerCase()
        );


    if (alreadyExists) {

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


    customerNameInput.value = "";


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
            "<p>No regular customers added yet.</p>";

        return;

    }


    customers.forEach(
        function(customer) {

            const box =
                document.createElement("div");

            box.className =
                "customer-item";


            const text =
                document.createElement("p");

            text.textContent =
                customer.name;


            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "Delete";

            deleteButton.className =
                "secondary";


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteCustomer(
                        customer.id
                    );

                }
            );


            box.append(
                text,
                deleteButton
            );


            customerList.appendChild(
                box
            );

        }
    );

}


// =====================================================
// DELETE CUSTOMER
// =====================================================

function deleteCustomer(customerId) {

    const customer =
        customers.find(
            item =>
                item.id === customerId
        );


    if (!customer) {
        return;
    }


    const confirmation =
        confirm(
            "Delete " +
            customer.name +
            " from the customer list?"
        );


    if (!confirmation) {
        return;
    }


    customers =
        customers.filter(
            item =>
                item.id !== customerId
        );


    saveCustomers();


    displayCustomers();
    updateCustomerDropdown();

}


// =====================================================
// CUSTOMER DROPDOWN
// =====================================================

function updateCustomerDropdown() {

    saleCustomer.innerHTML = "";


    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "No Regular Customer";

    saleCustomer.appendChild(
        defaultOption
    );


    customers.forEach(
        function(customer) {

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
// UPDATE AUTOMATIC PRICE
// =====================================================

function updateSaleCalculation() {

    const productId =
        saleProduct.value;


    const quantity =
        Number(
            saleQuantity.value
        );


    const product =
        products.find(
            item =>
                item.id === productId
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
        product.price.toFixed(2);


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        saleAmount.textContent =
            "Sale Amount: ₹0.00";

        return;

    }


    const amount =
        quantity * product.price;


    saleAmount.textContent =
        "Sale Amount: ₹" +
        amount.toFixed(2);

}


// =====================================================
// GET DATE
// =====================================================

function getDateOnly(date) {

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
// FIRST SALES DATE
// =====================================================

function getFirstSalesDate() {

    if (sales.length === 0) {

        return getDateOnly(
            new Date()
        );

    }


    return sales[0].date;

}


// =====================================================
// GET SALES DAY NUMBER
// =====================================================

function getSalesDayNumber(dateString) {

    const firstDate =
        new Date(
            getFirstSalesDate()
            + "T00:00:00"
        );


    const currentDate =
        new Date(
            dateString
            + "T00:00:00"
        );


    const difference =
        currentDate -
        firstDate;


    const oneDay =
        24 *
        60 *
        60 *
        1000;


    return (
        Math.floor(
            difference /
            oneDay
        ) + 1
    );

}


// =====================================================
// ADD SALE
// =====================================================

function addSale() {

    const productId =
        saleProduct.value;


    const customerId =
        saleCustomer.value;


    const quantity =
        Number(
            saleQuantity.value
        );


    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        alert(
            "Select a product."
        );

        saleProduct.focus();

        return;

    }


    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Enter a valid quantity."
        );

        saleQuantity.focus();

        return;

    }


    let customer = null;


    if (customerId !== "") {

        customer =
            customers.find(
                item =>
                    item.id === customerId
            );

    }


    const now =
        new Date();


    const date =
        getDateOnly(now);


    /*
     IMPORTANT:

     The price is saved with the sale.

     Example:

     Day 1 Shampoo = ₹50

     Later price becomes ₹55.

     Day 1 remains ₹50.
    */


    const sale = {

        id: createId(),

        date: date,

        time:
            now.toISOString(),

        day:
            getSalesDayNumber(date),

        productId:
            product.id,

        productName:
            product.name,

        price:
            product.price,

        quantity:
            quantity,

        amount:
            product.price *
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


    sales.push(sale);


    saveSales();


    saleQuantity.value = "";


    displayAll();


    updateSaleCalculation();


    saleQuantity.focus();

}


// =====================================================
// DISPLAY EVERYTHING
// =====================================================

function displayAll() {

    displayCurrentDay();

    displayDailySales();

    displayCustomerSales();

    displayOverallTotal();

}


// =====================================================
// CURRENT DAY
// =====================================================

function displayCurrentDay() {

    const today =
        getDateOnly(
            new Date()
        );


    const day =
        getSalesDayNumber(
            today
        );


    currentDayDisplay.textContent =
        "Sales Day " +
        day;

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
        function(sale) {

            if (!days[sale.day]) {

                days[sale.day] = [];

            }


            days[sale.day].push(
                sale
            );

        }
    );


    const dayNumbers =
        Object.keys(days)
            .map(Number)
            .sort(
                (a, b) =>
                    a - b
            );


    dayNumbers.forEach(
        function(day) {

            const dayBox =
                document.createElement(
                    "div"
                );


            dayBox.className =
                "real-time-day";


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


            const productGroups = {};


            let dayTotal = 0;

            let dayQuantity = 0;


            days[day].forEach(
                function(sale) {

                    dayTotal +=
                        sale.amount;


                    dayQuantity +=
                        sale.quantity;


                    if (
                        !productGroups[
                            sale.productName
                        ]
                    ) {

                        productGroups[
                            sale.productName
                        ] = {

                            quantity: 0,

                            amount: 0

                        };

                    }


                    productGroups[
                        sale.productName
                    ].quantity +=
                        sale.quantity;


                    productGroups[
                        sale.productName
                    ].amount +=
                        sale.amount;

                }
            );


            Object.keys(
                productGroups
            ).forEach(
                function(productName) {

                    const group =
                        productGroups[
                            productName
                        ];


                    const row =
                        document.createElement(
                            "p"
                        );


                    row.textContent =
                        productName +
                        " → " +
                        group.quantity +
                        " stocks = ₹" +
             

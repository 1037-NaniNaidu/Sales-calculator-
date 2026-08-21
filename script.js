document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // DATA
    // ==========================================

    let customers =
        JSON.parse(localStorage.getItem("storeCustomers")) || [];

    let selectedCustomerId = null;


    // ==========================================
    // ELEMENTS
    // ==========================================

    const customerScreen =
        document.getElementById("customerScreen");

    const customerMenu =
        document.getElementById("customerMenu");

    const customerList =
        document.getElementById("customerList");

    const addCustomerButton =
        document.getElementById("addCustomer");

    const backToCustomers =
        document.getElementById("backToCustomers");

    const customerTitle =
        document.getElementById("customerTitle");

    const productName =
        document.getElementById("productName");

    const productPrice =
        document.getElementById("productPrice");

    const addProductButton =
        document.getElementById("addProduct");

    const productList =
        document.getElementById("productList");

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

    const daySales =
        document.getElementById("daySales");

    const totalSales =
        document.getElementById("totalSales");

    const salesHistory =
        document.getElementById("salesHistory");

    const printSales =
        document.getElementById("printSales");


    // ==========================================
    // SAVE DATA
    // ==========================================

    function saveCustomers() {
        localStorage.setItem(
            "storeCustomers",
            JSON.stringify(customers)
        );
    }


    // ==========================================
    // DATE
    // ==========================================

    function getToday() {

        const date = new Date();

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function getReadableDate(dateString) {

        const date =
            new Date(dateString + "T00:00:00");

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    // ==========================================
    // CUSTOMER LIST
    // ==========================================

    function displayCustomers() {

        customerList.innerHTML = "";

        if (customers.length === 0) {

            customerList.innerHTML =
                "<p>No customers added yet.</p>";

            return;
        }

        customers.forEach(function (customer) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.textContent =
                "👤 " + customer.name;

            button.addEventListener(
                "click",
                function () {
                    openCustomer(customer.id);
                }
            );

            customerList.appendChild(button);
        });
    }


    // ==========================================
    // ADD CUSTOMER
    // ==========================================

    addCustomerButton.addEventListener(
        "click",
        function () {

            const name =
                prompt("Enter customer name:");

            if (!name) {
                return;
            }

            const cleanName =
                name.trim();

            if (cleanName === "") {

                alert(
                    "Please enter a customer name."
                );

                return;
            }

            const customer = {

                id:
                    Date.now().toString(),

                name:
                    cleanName,

                products: [],

                sales: []
            };

            customers.push(customer);

            saveCustomers();

            displayCustomers();
        }
    );


    // ==========================================
    // OPEN CUSTOMER
    // ==========================================

    function openCustomer(customerId) {

        const customer =
            customers.find(
                function (item) {
                    return item.id === customerId;
                }
            );

        if (!customer) {
            return;
        }

        selectedCustomerId =
            customerId;

        customerScreen.classList.add(
            "hidden"
        );

        customerMenu.classList.remove(
            "hidden"
        );

        customerTitle.textContent =
            "👤 " + customer.name;

        clearProductInputs();

        updateCustomerMenu();
    }


    // ==========================================
    // BACK TO CUSTOMERS
    // ==========================================

    backToCustomers.addEventListener(
        "click",
        function () {

            selectedCustomerId = null;

            customerMenu.classList.add(
                "hidden"
            );

            customerScreen.classList.remove(
                "hidden"
            );

            displayCustomers();
        }
    );


    // ==========================================
    // GET SELECTED CUSTOMER
    // ==========================================

    function getSelectedCustomer() {

        return customers.find(
            function (customer) {

                return customer.id ===
                    selectedCustomerId;
            }
        );
    }


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    addProductButton.addEventListener(
        "click",
        function () {

            const customer =
                getSelectedCustomer();

            if (!customer) {
                return;
            }

            const name =
                productName.value.trim();

            const price =
                Number(productPrice.value);

            if (name === "") {

                alert(
                    "Please enter the product name."
                );

                return;
            }

            if (
                productPrice.value === "" ||
                isNaN(price) ||
                price < 0
            ) {

                alert(
                    "Please enter a valid cost."
                );

                return;
            }

            const product = {

                id:
                    Date.now().toString(),

                name:
                    name,

                price:
                    price
            };

            customer.products.push(product);

            saveCustomers();

            clearProductInputs();

            updateCustomerMenu();
        }
    );


    // ==========================================
    // CLEAR PRODUCT INPUTS
    // ==========================================

    function clearProductInputs() {

        productName.value = "";

        productPrice.value = "";
    }


    // ==========================================
    // DISPLAY PRODUCTS
    // ==========================================

    function displayProducts(customer) {

        productList.innerHTML = "";

        if (customer.products.length === 0) {

            productList.innerHTML =
                "<p>No products added yet.</p>";

            return;
        }

        customer.products.forEach(
            function (product) {

                const div =
                    document.createElement("div");

                div.className = "day";

                div.innerHTML = `
                    <strong>
                        ${escapeHTML(product.name)}
                    </strong>
                    <br>
                    ₹${product.price.toFixed(2)}
                `;

                productList.appendChild(div);
            }
        );
    }


    // ==========================================
    // PRODUCT SELECT
    // ==========================================

    function updateProductSelect(customer) {

        saleProduct.innerHTML =
            '<option value="">Select Product</option>';

        customer.products.forEach(
            function (product) {

                const option =
                    document.createElement("option");

                option.value =
                    product.id;

                option.textContent =
                    product.name +
                    " - ₹" +
                    product.price.toFixed(2);

                saleProduct.appendChild(option);
            }
        );

        selectedPrice.textContent =
            "Price: ₹0.00";

        saleAmount.textContent =
            "Sale Amount: ₹0.00";
    }


    // ==========================================
    // SALE AMOUNT
    // ==========================================

    saleProduct.addEventListener(
        "change",
        updateSaleAmount
    );

    saleQuantity.addEventListener(
        "input",
        updateSaleAmount
    );


    function updateSaleAmount() {

        const customer =
            getSelectedCustomer();

        if (!customer) {
            return;
        }

        const product =
            customer.products.find(
                function (item) {

                    return item.id ===
                        saleProduct.value;
                }
            );

        if (!product) {

            selectedPrice.textContent =
                "Price: ₹0.00";

            saleAmount.textContent =
                "Sale Amount: ₹0.00";

            return;
        }

        const quantity =
            Number(saleQuantity.value) || 0;

        const amount =
            product.price * quantity;

        selectedPrice.textContent =
            "Price: ₹" +
            product.price.toFixed(2);

        saleAmount.textContent =
            "Sale Amount: ₹" +
            amount.toFixed(2);
    }


    // ==========================================
    // ADD SALE
    // ==========================================

    addSaleButton.addEventListener(
        "click",
        function () {

            const customer =
                getSelectedCustomer();

            if (!customer) {
                return;
            }

            const product =
                customer.products.find(
                    function (item) {

                        return item.id ===
                            saleProduct.value;
                    }
                );

            if (!product) {

                alert(
                    "Please select a product."
                );

                return;
            }

            const quantity =
                Number(saleQuantity.value);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {

                alert(
                    "Please enter a valid quantity."
                );

                return;
            }

            const amount =
                product.price * quantity;

            const sale = {

                id:
                    Date.now().toString(),

                date:
                    getToday(),

                productName:
                    product.name,

                price:
                    product.price,

                quantity:
                    quantity,

                amount:
                    amount,

                time:
                    new Date().toLocaleTimeString(
                        "en-IN",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
            };

            customer.sales.push(sale);

            saveCustomers();

            saleProduct.value = "";

            saleQuantity.value = "";

            selectedPrice.textContent =
                "Price: ₹0.00";

            saleAmount.textContent =
                "Sale Amount: ₹0.00";

            updateCustomerMenu();
        }
    );


    // ==========================================
    // UPDATE CUSTOMER MENU
    // ==========================================

    function updateCustomerMenu() {

        const customer =
            getSelectedCustomer();

        if (!customer) {
            return;
        }

        currentDay.textContent =
            "Today: " +
            getReadableDate(getToday());

        displayProducts(customer);

        updateProductSelect(customer);

        displayDaySales(customer);

        displayTotalSales(customer);

        displaySalesHistory(customer);
    }


    // ==========================================
    // DAY SALES
    // ==========================================

    function displayDaySales(customer) {

        const today =
            getToday();

        const todaySales =
            customer.sales.filter(
                function (sale) {

                    return sale.date === today;
                }
            );

        const total =
            todaySales.reduce(
                function (sum, sale) {

                    return sum + sale.amount;

                },
                0
            );

        const items =
            todaySales.reduce(
                function (sum, sale) {

                    return sum + sale.quantity;

                },
                0
            );

        daySales.innerHTML = `

            <div class="summary-row">
                Items Sold:
                <strong>${items}</strong>
            </div>

            <div class="summary-row total">
                Today's Sales:
                ₹${total.toFixed(2)}
            </div>

        `;
    }


    // ==========================================
    // TOTAL SALES
    // ==========================================

    function displayTotalSales(customer) {

        const total =
            customer.sales.reduce(
                function (sum, sale) {

                    return sum + sale.amount;

                },
                0
            );

        const items =
            customer.sales.reduce(
                function (sum, sale) {

                    return sum + sale.quantity;

                },
                0
            );

        totalSales.innerHTML = `

            <div class="summary-row">
                Total Items Sold:
                <strong>${items}</strong>
            </div>

            <div class="summary-row total">
                Total Sales:
                ₹${total.toFixed(2)}
            </div>

        `;
    }


    // ==========================================
    // SALES HISTORY
    // ==========================================

    function displaySalesHistory(customer) {

        salesHistory.innerHTML = "";

        if (customer.sales.length === 0) {

            salesHistory.innerHTML =
                "<p>No sales recorded yet.</p>";

            return;
        }

        const grouped = {};

        customer.sales.forEach(
            function (sale) {

                if (!grouped[sale.date]) {

                    grouped[sale.date] = [];
                }

                grouped[sale.date].push(sale);
            }
        );

        const dates =
            Object.keys(grouped)
                .sort()
                .reverse();

        dates.forEach(
            function (date) {

                const salesForDay =
                    grouped[date];

                const total =
                    salesForDay.reduce(
                        function (sum, sale) {

                            return sum +
                                sale.amount;

                        },
                        0
                    );

                const items =
                    salesForDay.reduce(
                        function (sum, sale) {

                            return sum +
                                sale.quantity;

                        },
                        0
                    );

                const dayDiv =
                    document.createElement("div");

                dayDiv.className = "day";

                let html = `

                    <div class="day-title">
                        📅
                        ${getReadableDate(date)}
                    </div>

                    <div>
                        Items: ${items}
                    </div>

                    <div class="daily-total">
                        Day Total:
                        ₹${total.toFixed(2)}
                    </div>

                    <hr>

                `;

                salesForDay.forEach(
                    function (sale) {

                        html += `

                            <div class="summary-row">

                                ${escapeHTML(
                                    sale.productName
                                )}

                                × ${sale.quantity}

                                =
                                ₹${sale.amount.toFixed(2)}

                                <br>

                                <small>
                                    ${escapeHTML(
                                        sale.time
                                    )}
                                </small>

                            </div>

                        `;
                    }
                );

                dayDiv.innerHTML =
                    html;

                salesHistory.appendChild(
                    dayDiv
                );
            }
        );
    }


    // ==========================================
    // PRINT SALES
    // ==========================================

    printSales.addEventListener(
        "click",
        function () {

            const customer =
                getSelectedCustomer();

            if (!customer) {
                return;
            }

            if (customer.sales.length === 0) {

                alert(
                    "There are no sales to print."
                );

                return;
            }

            const grouped = {};

            customer.sales.forEach(
                function (sale) {

                    if (!grouped[sale.date]) {

                        grouped[sale.date] = [];
                    }

                    grouped[sale.date].push(
                        sale
                    );
                }
            );

            const dates =
                Object.keys(grouped)
                    .sort()
                    .reverse();

            let printHTML = `

                <!DOCTYPE html>

                <html>

                <head>

                    <title>
                        Sales -
                        ${escapeHTML(customer.name)}
                    </title>

                    <style>

                        body {
                            font-family: Arial, sans-serif;
                            padding: 25px;
                            color: #111;
                        }

                        h1 {
                            margin-bottom: 5px;
                        }

                        h2 {
                            margin-top: 25px;
                            border-bottom: 1px soli

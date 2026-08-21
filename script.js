alert("SCRIPT.JS IS LOADING");
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
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==========================================
    // DATE
    // ==========================================

    function getToday() {

        const date = new Date();

        const year =
            date.getFullYear();

        const month =
            String(date.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(date.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function getReadableDate(dateString) {

        const date =
            new Date(dateString + "T00:00:00");

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    // ==========================================
    // CUSTOMER LIST
    // ==========================================

    function displayCustomers() {

        if (!customerList) {
            return;
        }

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

    if (addCustomerButton) {

        addCustomerButton.addEventListener(
            "click",
            function () {

                const name =
                    prompt("Enter customer name:");

                if (name === null) {
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
    }


    // ==========================================
    // OPEN CUSTOMER
    // ==========================================

    function openCustomer(customerId) {

        const customer =
            customers.find(
                function (item) {

                    return item.id ===
                        customerId;
                }
            );

        if (!customer) {
            return;
        }

        // Make sure old data does not break
        if (!Array.isArray(customer.products)) {
            customer.products = [];
        }

        if (!Array.isArray(customer.sales)) {
            customer.sales = [];
        }

        selectedCustomerId =
            customerId;

        if (customerScreen) {

            customerScreen.classList.add(
                "hidden"
            );
        }

        if (customerMenu) {

            customerMenu.classList.remove(
                "hidden"
            );
        }

        if (customerTitle) {

            customerTitle.textContent =
                "👤 " + customer.name;
        }

        clearProductInputs();

        updateCustomerMenu();
    }


    // ==========================================
    // BACK TO CUSTOMERS
    // ==========================================

    if (backToCustomers) {

        backToCustomers.addEventListener(
            "click",
            function () {

                selectedCustomerId = null;

                if (customerMenu) {

                    customerMenu.classList.add(
                        "hidden"
                    );
                }

                if (customerScreen) {

                    customerScreen.classList.remove(
                        "hidden"
                    );
                }

                displayCustomers();
            }
        );
    }


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

    if (addProductButton) {

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
    }


    // ==========================================
    // CLEAR PRODUCT INPUTS
    // ==========================================

    function clearProductInputs() {

        if (productName) {
            productName.value = "";
        }

        if (productPrice) {
            productPrice.value = "";
        }
    }


    // ==========================================
    // DISPLAY PRODUCTS
    // ==========================================

    function displayProducts(customer) {

        if (!productList) {
            return;
        }

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
                    ₹${Number(product.price).toFixed(2)}
                `;

                productList.appendChild(div);
            }
        );
    }


    // ==========================================
    // PRODUCT SELECT
    // ==========================================

    function updateProductSelect(customer) {

        if (!saleProduct) {
            return;
        }

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
                    Number(product.price).toFixed(2);

                saleProduct.appendChild(option);
            }
        );

        if (selectedPrice) {

            selectedPrice.textContent =
                "Price: ₹0.00";
        }

        if (saleAmount) {

            saleAmount.textContent =
                "Sale Amount: ₹0.00";
        }
    }


    // ==========================================
    // SALE AMOUNT EVENTS
    // ==========================================

    if (saleProduct) {

        saleProduct.addEventListener(
            "change",
            updateSaleAmount
        );
    }

    if (saleQuantity) {

        saleQuantity.addEventListener(
            "input",
            updateSaleAmount
        );
    }


    // ==========================================
    // UPDATE SALE AMOUNT
    // ==========================================

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

            if (selectedPrice) {

                selectedPrice.textContent =
                    "Price: ₹0.00";
            }

            if (saleAmount) {

                saleAmount.textContent =
                    "Sale Amount: ₹0.00";
            }

            return;
        }

        const quantity =
            Number(saleQuantity.value) || 0;

        const amount =
            Number(product.price) * quantity;

        if (selectedPrice) {

            selectedPrice.textContent =
                "Price: ₹" +
                Number(product.price).toFixed(2);
        }

        if (saleAmount) {

            saleAmount.textContent =
                "Sale Amount: ₹" +
                amount.toFixed(2);
        }
    }


    // ==========================================
    // ADD SALE
    // ==========================================

    if (addSaleButton) {

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
                    Number(product.price) *
                    quantity;

                const sale = {

                    id:
                        Date.now().toString(),

                    date:
                        getToday(),

                    productName:
                        product.name,

                    price:
                        Number(product.price),

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

                if (selectedPrice) {

                    selectedPrice.textContent =
                        "Price: ₹0.00";
                }

                if (saleAmount) {

                    saleAmount.textContent =
                        "Sale Amount: ₹0.00";
                }

                updateCustomerMenu();
            }
        );
    }


    // ==========================================
    // UPDATE CUSTOMER MENU
    // ==========================================

    function updateCustomerMenu() {

        const customer =
            getSelectedCustomer();

        if (!customer) {
            return;
        }

        if (currentDay) {

            currentDay.textContent =
                "Today: " +
                getReadableDate(getToday());
        }

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

        if (!daySales) {
            return;
        }

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

                    return sum +
                        Number(sale.amount || 0);

                },
                0
            );

        const items =
            todaySales.reduce(
                function (sum, sale) {

                    return sum +
                        Number(sale.quantity || 0);

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

        if (!totalSales) {
            return;
        }

        const total =
            customer.sales.reduce(
                function (sum, sale) {

                    return sum +
                        Number(sale.amount || 0);

                },
                0
            );

        const items =
            customer.sales.reduce(
                function (sum, sale) {

                    return sum +
                        Number(sale.quantity || 0);

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

        if (!salesHistory) {
            return;
        }

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
                                Number(sale.amount || 0);

                        },
                        0
                    );

                const items =
                    salesForDay.reduce(
                        function (sum, sale) {

                            return sum +
                                Number(sale.quantity || 0);

                        },
                        0
                    );

                const dayDiv =
                    document.createElement("div");

                dayDiv.className = "day";

                let html = `

                  

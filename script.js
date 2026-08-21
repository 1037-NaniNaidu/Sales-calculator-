alert("SCRIPT.JS IS WORKING");
document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // DATA
    // ==========================================

    let customers = loadCustomers();

    let selectedCustomerId = null;


    // ==========================================
    // ELEMENTS
    // ==========================================

    const customerScreen =
        document.getElementById("customerScreen");

    const customerForm =
        document.getElementById("customerForm");

    const customerMenu =
        document.getElementById("customerMenu");

    const customerList =
        document.getElementById("customerList");

    const addCustomer =
        document.getElementById("addCustomer");

    const saveCustomer =
        document.getElementById("saveCustomer");

    const cancelCustomer =
        document.getElementById("cancelCustomer");

    const backButton =
        document.getElementById("backButton");

    const addProduct =
        document.getElementById("addProduct");

    const printSales =
        document.getElementById("printSales");

    const newCustomerName =
        document.getElementById("newCustomerName");

    const customerName =
        document.getElementById("customerName");

    const printCustomerName =
        document.getElementById("printCustomerName");

    const productName =
        document.getElementById("productName");

    const productCost =
        document.getElementById("productCost");

    const productQuantity =
        document.getElementById("productQuantity");

    const productSuggestions =
        document.getElementById("productSuggestions");

    const saleMonth =
        document.getElementById("saleMonth");

    const saleDay =
        document.getElementById("saleDay");

    const productMessage =
        document.getElementById("productMessage");

    const daySales =
        document.getElementById("daySales");

    const allDaysSales =
        document.getElementById("allDaysSales");

    const salesTableContainer =
        document.getElementById("salesTableContainer");


    // ==========================================
    // LOAD CUSTOMERS
    // ==========================================

    function loadCustomers() {

        try {

            const saved =
                localStorage.getItem("storeCustomers");

            if (!saved) {
                return [];
            }

            const data =
                JSON.parse(saved);

            if (!Array.isArray(data)) {
                return [];
            }

            return data.map(function (customer) {

                if (!Array.isArray(customer.sales)) {
                    customer.sales = [];
                }

                if (!customer.prices) {
                    customer.prices = {};
                }

                return customer;

            });

        } catch (error) {

            return [];

        }
    }


    // ==========================================
    // SAVE DATA
    // ==========================================

    function saveData() {

        localStorage.setItem(
            "storeCustomers",
            JSON.stringify(customers)
        );

    }


    // ==========================================
    // MONTH NAMES
    // ==========================================

    const monthNames = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    // ==========================================
    // CURRENT MONTH
    // ==========================================

    function setCurrentMonth() {

        const currentMonth =
            new Date().getMonth() + 1;

        saleMonth.value =
            String(currentMonth);

    }


    // ==========================================
    // NUMBER OF DAYS IN MONTH
    // ==========================================

    function getDaysInMonth(month, year) {

        return new Date(
            year,
            month,
            0
        ).getDate();

    }


    // ==========================================
    // UPDATE DAY LIMIT
    // ==========================================

    function updateDayLimit() {

        const month =
            Number(saleMonth.value);

        const year =
            new Date().getFullYear();

        const maxDays =
            getDaysInMonth(month, year);

        saleDay.max =
            String(maxDays);

        if (
            saleDay.value !== "" &&
            Number(saleDay.value) > maxDays
        ) {

            saleDay.value =
                maxDays;

        }

    }


    // ==========================================
    // INITIAL MONTH
    // ==========================================

    setCurrentMonth();

    updateDayLimit();


    saleMonth.addEventListener(
        "change",
        function () {

            updateDayLimit();

            updateSelectedDayTotal();

        }
    );


    saleDay.addEventListener(
        "input",
        function () {

            updateSelectedDayTotal();

        }
    );


    // ==========================================
    // TODAY DATE
    // ==========================================

    function getCurrentDateInfo() {

        const now =
            new Date();

        return {

            year:
                now.getFullYear(),

            month:
                now.getMonth() + 1,

            day:
                now.getDate()

        };

    }


    // ==========================================
    // DATE KEY
    // ==========================================

    function makeDateKey(
        year,
        month,
        day
    ) {

        return (
            year +
            "-" +
            String(month).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0")
        );

    }


    // ==========================================
    // DISPLAY DATE
    // ==========================================

    function displayDate(
        month,
        day
    ) {

        return (
            String(day).padStart(2, "0") +
            "/" +
            String(month).padStart(2, "0")
        );

    }


    // ==========================================
    // MONEY
    // ==========================================

    function money(value) {

        return Number(value || 0)
            .toFixed(2);

    }


    // ==========================================
    // MAIN SCREEN
    // ==========================================

    function showCustomerScreen() {

        customerScreen.classList.remove("hidden");

        customerForm.classList.add("hidden");

        customerMenu.classList.add("hidden");

        selectedCustomerId = null;

        renderCustomers();

    }


    // ==========================================
    // CUSTOMER LIST
    // ==========================================

    function renderCustomers() {

        customerList.innerHTML = "";


        if (customers.length === 0) {

            customerList.innerHTML =
                '<div class="card empty">' +
                'No customers added yet.' +
                '</div>';

            return;
        }


        customers.forEach(function (customer) {

            const button =
                document.createElement("button");

            button.className =
                "customer-button";

            button.textContent =
                customer.name;

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
    // ADD CUSTOMER BUTTON
    // ==========================================

    addCustomer.addEventListener(
        "click",
        function () {

            customerScreen.classList.add("hidden");

            customerMenu.classList.add("hidden");

            customerForm.classList.remove("hidden");

            newCustomerName.value = "";

            newCustomerName.focus();

        }
    );


    // ==========================================
    // SAVE CUSTOMER
    // ==========================================

    saveCustomer.addEventListener(
        "click",
        function () {

            const name =
                newCustomerName.value.trim();


            if (name === "") {

                alert(
                    "Please enter customer name."
                );

                return;
            }


            const customer = {

                id:
                    Date.now().toString(),

                name:
                    name,

                sales:
                    [],

                prices:
                    {}

            };


            customers.push(customer);

            saveData();

            showCustomerScreen();

        }
    );


    // ==========================================
    // CANCEL CUSTOMER
    // ==========================================

    cancelCustomer.addEventListener(
        "click",
        function () {

            showCustomerScreen();

        }
    );


    // ==========================================
    // OPEN CUSTOMER
    // ==========================================

    function openCustomer(id) {

        selectedCustomerId =
            String(id);

        customerScreen.classList.add("hidden");

        customerForm.classList.add("hidden");

        customerMenu.classList.remove("hidden");

        setCurrentMonth();

        updateDayLimit();

        saleDay.value = "";

        productName.value = "";

        productCost.value = "";

        productQuantity.value = "";

        renderCustomer();

    }


    // ==========================================
    // GET SELECTED CUSTOMER
    // ==========================================

    function getSelectedCustomer() {

        return customers.find(
            function (customer) {

                return String(customer.id) ===
                    String(selectedCustomerId);

            }
        );

    }


    // ==========================================
    // RENDER CUSTOMER
    // ==========================================

    function renderCustomer() {

        const customer =
            getSelectedCustomer();


        if (!customer) {

            showCustomerScreen();

            return;
        }


        customerName.textContent =
            customer.name;

        printCustomerName.textContent =
            customer.name;


        updateProductSuggestions(customer);

        updateSelectedDayTotal();

        calculateAllDaysTotal(customer);

        renderSalesTable(customer);

    }


    // ==========================================
    // PRODUCT SUGGESTIONS
    // ==========================================

    function updateProductSuggestions(customer) {

        productSuggestions.innerHTML = "";


        Object.keys(customer.prices)
            .forEach(function (key) {

                const option =
                    document.createElement("option");

                option.value =
                    customer.prices[key].name;

                productSuggestions.appendChild(option);

            });

    }


    // ==========================================
    // PRODUCT INPUT
    // ==========================================

    productName.addEventListener(
        "input",
        function () {

            const customer =
                getSelectedCustomer();


            if (!customer) {
                return;
            }


            const name =
                productName.value.trim()
                    .toLowerCase();


            if (
                name !== "" &&
                customer.prices[name]
            ) {

                productCost.value =
                    customer.prices[name].cost;

            }

        }
    );


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    addProduct.addEventListener(
        "click",
        function () {

            const customer =
                getSelectedCustomer();


            if (!customer) {

                alert("Customer not found.");

                return;
            }


            const name =
                productName.value.trim();

            const cost =
                Number(productCost.value);

            const quantity =
                Number(productQuantity.value);

            const month =
                Number(saleMonth.value);

            const day =
                Number(saleDay.value);


            // --------------------------------------
            // PRODUCT VALIDATION
            // --------------------------------------

            if (name === "") {

                alert(
                    "Please enter the product."
                );

                return;
            }


            // --------------------------------------
            // COST VALIDATION
            // --------------------------------------

            if (
                productCost.value === "" ||
                !Number.isFinite(cost) ||
                cost < 0
            ) {

                alert(
                    "Please enter a valid cost."
                );

                return;
            }


            // --------------------------------------
            // QUANTITY VALIDATION
            // --------------------------------------

            if (
                productQuantity.value === "" ||
                !Number.isFinite(quantity) ||
                quantity <= 0
            ) {

                alert(
                    "Please enter a valid quantity."
                );

                return;
            }


            // --------------------------------------
            // MONTH VALIDATION
            // --------------------------------------

            if (
                !Number.isInteger(month) ||
                month < 1 ||
                month > 12
            ) {

                alert(
                    "Please select a valid month."
                );

                return;
            }


            // --------------------------------------
            // DAY VALIDATION
            // --------------------------------------

            const year =
                new Date().getFullYear();

            const maxDays =
                getDaysInMonth(
                    month,
                    year
                );


            if (
                !Number.isInteger(day) ||
                day < 1 ||
                day > maxDays
            ) {

                alert(
                    "Please enter a valid day for " +
                    monthNames[month] +
                    ". This month has " +
                    maxDays +
                    " days."
                );

                return;
            }


            // --------------------------------------
            // PRODUCT PRICE MEMORY
            //
            // USER CONTROLS THIS.
            //
            // If product is new:
            // save entered cost.
            //
            // If product already exists:
            // entered cost becomes the new saved
            // cost because the USER entered it.
            // --------------------------------------

            const productKey =
                name.toLowerCase();


            customer.prices[productKey] = {

                name:
                    name,

                cost:
                    cost

            };


            // --------------------------------------
            // CALCULATE TOTAL
            // --------------------------------------

            const total =
                cost * quantity;


            // --------------------------------------
            // SAVE SALE
            // --------------------------------------

            customer.sales.push({

                year:
                    year,

                month:
                    month,

                day:
                    day,

                dateKey:
                    makeDateKey(
                        year,
                        month,
                        day
                    ),

                product:
                    name,

                cost:
                    cost,

                quantity:
                    quantity,

                total:
                    total

            });


            // --------------------------------------
            // SAVE PERMANENTLY
            // --------------------------------------

            saveData();


            // --------------------------------------
            // CLEAR PRODUCT INPUT
            // --------------------------------------

            productName.value = "";

            productCost.value = "";

            productQuantity.value = "";

            productMessage.textContent =
                "Product saved successfully.";


            // --------------------------------------
            // REFRESH DISPLAY
            // --------------------------------------

            renderCustomer();

            productName.focus();

        }
    );


    // ==========================================
    // SELECTED DAY TOTAL
    // ==========================================

    function updateSelectedDayTotal() {

        const customer =
            getSelectedCustomer();


        if (!customer) {

            daySales.textContent =
                "0.00";

            return;
        }


        const month =
            Number(saleMonth.value);

        const day =
            Number(saleDay.value);


        if (
            !Number.isInteger(month) ||
            !Number.isInteger(day) ||
            day < 1
        ) {

            daySales.textContent =
                "0.00";

            return;
        }


        let total = 0;


        customer.sales.forEach(
            function (sale) {

                if (
                    Number(sale.month) === month &&
                    Number(sale.day) === day
                ) {

                    total +=
                        Number(sale.total) || 0;

                }

            }
        );


        daySales.textContent =
            money(total);

    }


    // ==========================================
    // ALL DAYS TOTAL
    // ==========================================

    function calculateAllDaysTotal(customer) {

        let total = 0;


        customer.sales.forEach(
            function (sale) {

                total +=
                    Number(sale.total) || 0;

            }
        );


        allDaysSales.textContent =
            money(total);

    }


    // ==========================================
    // SORT SALES
    // ==========================================

    function sortSales(sales) {

        return sales.slice().sort(
            function (a, b) {

                const dateA =
                    a.dateKey || "";

                const dateB =
                    b.dateKey || "";

                if (dateA !== dateB) {

                    return dateA.localeCompare(dateB);

                }

                return 0;

            }
        );

    }


    // ==========================================
    // SALES TABLE
    //
    // UNLIMITED PRODUCTS
    //
    // Three products are shown per table row.
    // This is NOT a product limit.
    // ==========================================

    function renderSalesTable(customer) {

        salesTableContainer.innerHTML = "";


        if (
            !customer.sales ||
            customer.sales.length === 0
        ) {

            salesTableContainer.innerHTML =
       

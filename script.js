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

    const addCustomerButton =
        document.getElementById("addCustomer");

    const saveCustomerButton =
        document.getElementById("saveCustomer");

    const cancelCustomerButton =
        document.getElementById("cancelCustomer");

    const backButton =
        document.getElementById("backButton");

    const addProductButton =
        document.getElementById("addProduct");

    const printSalesButton =
        document.getElementById("printSales");

    const newCustomerName =
        document.getElementById("newCustomerName");

    const customerName =
        document.getElementById("customerName");

    const printCustomerName =
        document.getElementById("printCustomerName");

    const printMonthName =
        document.getElementById("printMonthName");

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

    const monthMessage =
        document.getElementById("monthMessage");

    const productMessage =
        document.getElementById("productMessage");

    const daySales =
        document.getElementById("daySales");

    const allDaysSales =
        document.getElementById("allDaysSales");

    const salesTableContainer =
        document.getElementById("salesTableContainer");


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
    // LOAD DATA
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

                if (typeof customer.month !== "number") {
                    customer.month = null;
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

        try {

            localStorage.setItem(
                "storeCustomers",
                JSON.stringify(customers)
            );

        } catch (error) {

            alert(
                "The browser could not save the data."
            );

        }
    }


    // ==========================================
    // MONEY
    // ==========================================

    function money(value) {

        return Number(value || 0).toFixed(2);

    }


    // ==========================================
    // CURRENT DATE
    // ==========================================

    function getCurrentDate() {

        const now = new Date();

        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };

    }


    // ==========================================
    // NUMBER OF DAYS IN MONTH
    // ==========================================

    function getDaysInMonth(
        year,
        month
    ) {

        return new Date(
            year,
            month,
            0
        ).getDate();

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
    // GET CUSTOMER
    // ==========================================

    function getSelectedCustomer() {

        return customers.find(function (customer) {

            return String(customer.id) ===
                String(selectedCustomerId);

        });

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

            button.type = "button";

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
    // ADD CUSTOMER
    // ==========================================

    addCustomerButton.addEventListener(
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

    saveCustomerButton.addEventListener(
        "click",
        function () {

            const name =
                newCustomerName.value.trim();


            if (name === "") {

                alert(
                    "Please enter a customer name."
                );

                return;
            }


            const customer = {

                id:
                    Date.now().toString(),

                name:
                    name,

                month:
                    null,

                prices:
                    {},

                sales:
                    []

            };


            customers.push(customer);

            saveData();

            showCustomerScreen();

        }
    );


    // ==========================================
    // CANCEL ADD CUSTOMER
    // ==========================================

    cancelCustomerButton.addEventListener(
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

        renderCustomer();

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


        // --------------------------------------
        // RESTORE SAVED MONTH
        // --------------------------------------

        if (
            customer.month !== null &&
            customer.month >= 1 &&
            customer.month <= 12
        ) {

            saleMonth.value =
                String(customer.month);

        } else {

            // First time: current month

            const current =
                getCurrentDate();

            customer.month =
                current.month;

            saleMonth.value =
                String(current.month);

            saveData();

        }


        updateMonthInformation();

        updateProductSuggestions();

        updateTotals();

        renderSalesTable();

    }


    // ==========================================
    // MONTH SELECTED
    // ==========================================

    saleMonth.addEventListener(
        "change",
        function () {

            const customer =
                getSelectedCustomer();


            if (!customer) {
                return;
            }


            customer.month =
                Number(saleMonth.value);


            saveData();

            updateMonthInformation();

            updateTotals();

            renderSalesTable();

        }
    );


    // ==========================================
    // MONTH INFORMATION
    // ==========================================

    function updateMonthInformation() {

        const customer =
            getSelectedCustomer();


        if (!customer) {
            return;
        }


        const month =
            Number(customer.month);


        const current =
            getCurrentDate();


        const days =
            getDaysInMonth(
                current.year,
                month
            );


        monthMessage.textContent =
            monthNames[month] +
            " has " +
            days +
            " days.";


        printMonthName.textContent =
            monthNames[month];

    }


    // ==========================================
    // PRODUCT SUGGESTIONS
    // ==========================================

    function updateProductSuggestions() {

        const customer =
            getSelectedCustomer();


        if (!customer) {
            return;
        }


        productSuggestions.innerHTML = "";


        Object.keys(customer.prices)
            .forEach(function (key) {

                const savedProduct =
                    customer.prices[key];

                const option =
                    document.createElement("option");

                option.value =
                    savedProduct.name;

                productSuggestions.appendChild(
                    option
                );

            });

    }


    // ==========================================
    // PRODUCT ENTERED
    // ==========================================

    productName.addEventListener(
        "input",
        function () {

            const customer =
                getSelectedCustomer();


            if (!customer) {
                return;
            }


            const key =
                productName.value
                    .trim()
                    .toLowerCase();


            if (
                key !== "" &&
                customer.prices[key]
            ) {

                productCost.value =
                    customer.prices[key].cost;

            }

        }
    );


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    addProductButton.addEventListener(
        "click",
        function () {

            const customer =
                getSelectedCustomer();


            if (!customer) {

                alert(
                    "Customer not found."
                );

                return;
            }


            // --------------------------------------
            // CURRENT DATE
            // --------------------------------------

            const current =
                getCurrentDate();


            // --------------------------------------
            // SELECTED MONTH
            // --------------------------------------

            const selectedMonth =
                Number(customer.month);


            // --------------------------------------
            // PRODUCT
            // --------------------------------------

            const name =
                productName.value.trim();


            // --------------------------------------
            // COST
            // --------------------------------------

            const cost =
                Number(productCost.value);


            // --------------------------------------
            // QUANTITY
            // --------------------------------------

            const quantity =
                Number(productQuantity.value);


            // --------------------------------------
            // VALIDATION
            // --------------------------------------

            if (name === "") {

                alert(
                    "Please enter the product."
                );

                return;
            }


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
            // MAKE SURE CURRENT DAY BELONGS TO
            // SELECTED MONTH
            // --------------------------------------

            if (
                current.month !== selectedMonth
            ) {

                alert(
                    "The selected month is " +
                    monthNames[selectedMonth] +
                    ", but today is " +
                    monthNames[current.month] +
                    ". Select the current month to add today's sale."
                );

                return;
            }


            // --------------------------------------
            // SAVE PRODUCT COST
            //
            // The USER controls this.
            // If they enter a different cost,
            // that becomes the new saved cost.
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
            // PRODUCT TOTAL
            // --------------------------------------

            const total =
                cost * quantity;


            // --------------------------------------
            // SAVE SALE
            // --------------------------------------

            customer.sales.push({

                year:
                    current.year,

                month:
                    current.month,

                day:
                    current.day,

                dateKey:
                    makeDateKey(
                        current.year,
                        current.month,
                        current.day
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
            // SAVE
            // --------------------------------------

            saveData();


            // --------------------------------------
            // CLEAR ONLY PRODUCT INPUTS
            //
            // MONTH STAYS SELECTED.
            // --------------------------------------

            productName.value = "";

            productCost.value = "";

            productQuantity.value = "";

            productMessage.textContent =
                "Product added successfully.";


            updateProductSuggestions();

            updateTotals();

            renderSalesTable();

            productName.focus();

        }
    );


    // ==========================================
    // TOTALS
    // ==========================================

    function updateTotals() {

        const customer =
            getSelectedCustomer();


        if (!customer) {

            daySales.textContent =
                "0.00";

            allDaysSales.textContent =
                "0.00";

            return;
        }


        const current =
            getCurrentDate();


        let todayTotal = 0;

        let allDaysTotal = 0;


        customer.sales.forEach(
            function (sale) {

                const saleTotal =
                    Number(sale.total) || 0;


                allDaysTotal +=
                    saleTotal;


                if (
                    sale.year === current.year &&
                    sale.month === current.month &&
                    sale.day === current.day
                ) {

                    todayTotal +=
                        saleTotal;

                }

            }
        );


        daySales.textContent =
            money(todayTotal);

        allDaysSales.textContent =
            money(allDaysTotal);

    }


    // ==========================================
    // SORT SALES
    // ==========================================

    function sortSales(sales) {

        return sales.slice().sort(
            function (a, b) {

                return (
                    a.dateKey.localeCompare(
                        b.dateKey
                    )
                );

            }
        );

    }


    // ==========================================
    // SALES TABLE
    // ==========================================

    function renderSalesTable() {

        const customer =
            getSelectedCustomer();


        

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

    const productName =
        document.getElementById("productName");

    const productCost =
        document.getElementById("productCost");

    const productQuantity =
        document.getElementById("productQuantity");

    const daySales =
        document.getElementById("daySales");

    const allDaysSales =
        document.getElementById("allDaysSales");

    const salesTableContainer =
        document.getElementById("salesTableContainer");


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
    // TODAY'S DATE
    // ==========================================

    function getToday() {

        const date = new Date();

        const year =
            date.getFullYear();

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const day =
            String(date.getDate()).padStart(2, "0");

        return year + "-" + month + "-" + day;
    }


    // ==========================================
    // SHOW CUSTOMER SCREEN
    // ==========================================

    function showCustomerScreen() {

        customerScreen.classList.remove("hidden");

        customerForm.classList.add("hidden");

        customerMenu.classList.add("hidden");

        selectedCustomerId = null;

        renderCustomers();

    }


    // ==========================================
    // SHOW ADD CUSTOMER FORM
    // ==========================================

    function showCustomerForm() {

        customerScreen.classList.add("hidden");

        customerMenu.classList.add("hidden");

        customerForm.classList.remove("hidden");

        newCustomerName.value = "";

        newCustomerName.focus();

    }


    // ==========================================
    // RENDER CUSTOMERS
    // ==========================================

    function renderCustomers() {

        customerList.innerHTML = "";

        if (customers.length === 0) {

            customerList.innerHTML =
                '<div class="card empty">No customers added yet.</div>';

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
            showCustomerForm();
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

                alert("Please enter a customer name.");

                return;
            }


            const newCustomer = {

                id: Date.now(),

                name: name,

                sales: []

            };


            customers.push(newCustomer);

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

        selectedCustomerId = id;

        customerScreen.classList.add("hidden");

        customerForm.classList.add("hidden");

        customerMenu.classList.remove("hidden");

        renderCustomer();

    }


    // ==========================================
    // GET SELECTED CUSTOMER
    // ==========================================

    function getSelectedCustomer() {

        return customers.find(
            function (customer) {
                return customer.id === selectedCustomerId;
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


        calculateTotals(customer);

        renderSalesTable(customer);

    }


    // ==========================================
    // CALCULATE TOTALS
    // ==========================================

    function calculateTotals(customer) {

        const today =
            getToday();

        let todayTotal = 0;

        let allDaysTotal = 0;


        customer.sales.forEach(
            function (sale) {

                const amount =
                    Number(sale.total) || 0;


                allDaysTotal += amount;


                if (sale.date === today) {

                    todayTotal += amount;

                }

            }
        );


        daySales.textContent =
            todayTotal.toFixed(2);

        allDaysSales.textContent =
            allDaysTotal.toFixed(2);

    }


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    addProduct.addEventListener(
        "click",
        function () {

            const name =
                productName.value.trim();

            const cost =
                Number(productCost.value);

            const quantity =
                Number(productQuantity.value);


            if (name === "") {

                alert("Please enter the product name.");

                return;
            }


            if (
                productCost.value === "" ||
                !Number.isFinite(cost) ||
                cost < 0
            ) {

                alert("Please enter a valid cost.");

                return;
            }


            if (
                productQuantity.value === "" ||
                !Number.isFinite(quantity) ||
                quantity <= 0
            ) {

                alert("Please enter a valid quantity.");

                return;
            }


            const customer =
                getSelectedCustomer();


            if (!customer) {

                alert("Customer not found.");

                return;
            }


            // COST × QUANTITY
            const total =
                cost * quantity;


            customer.sales.push({

                product: name,

                cost: cost,

                quantity: quantity,

                total: total,

                date: getToday()

            });


            saveData();


            // CLEAR THE SAME INPUT AREA
            productName.value = "";

            productCost.value = "";

            productQuantity.value = "";


            productName.focus();


            // UPDATE TABLE AND TOTALS
            renderCustomer();

        }
    );


    // ==========================================
    // RENDER SALES TABLE
    // ==========================================

    function renderSalesTable(customer) {

        salesTableContainer.innerHTML = "";


        if (customer.sales.length === 0) {

            salesTableContainer.innerHTML =
                '<div class="empty">No products added yet.</div>';

            return;
        }


        const table =
            document.createElement("table");


        // ======================================
        // HEADER
        // ======================================

        const headerRow =
            document.createElement("tr");


        const detailsHeader =
            document.createElement("th");

        detailsHeader.textContent =
            "Details";

        headerRow.appendChild(detailsHeader);


        customer.sales.forEach(
            function (sale, index) {

                const th =
                    document.createElement("th");

                th.textContent =
                    "Product " + (index + 1);

                headerRow.appendChild(th);

            }
        );


        table.appendChild(headerRow);


        // ======================================
        // PRODUCT ROW
        // ======================================

        addTableRow(
            table,
            "Product",
            customer.sales.map(
                function (sale) {
                    return sale.product;
                }
            )
        );


        // ======================================
        // COST ROW
        // ======================================

        addTableRow(
            table,
            "Cost",
            customer.sales.map(
                function (sale) {
                    return "₹" + Number(sale.cost).toFixed(2);
                }
            )
        );


        // ======================================
        // QUANTITY ROW
        // ======================================

        addTableRow(
            table,
            "Quantity",
            customer.sales.map(
                function (sale) {
                    return sale.quantity;
                }
            )
        );


        // ======================================
        // TOTAL ROW
        // ======================================

        addTableRow(
            table,
            "Total",
            customer.sales.map(
                function (sale) {
                    return "₹" + Number(sale.total).toFixed(2);
                }
            )
        );


        // ======================================
        // DATE ROW
        // ======================================

        addTableRow(
            table,
            "Date",
            customer.sales.map(
                function (sale) {
                    return sale.date;
                }
            )
        );


        const container =
            document.createElement("div");

        container.className =
            "table-container";

        container.appendChild(table);

        salesTableContainer.appendChild(container);

    }


    // ==========================================
    // ADD ROW TO TABLE
    // ==========================================

    function addTableRow(
        table,
        title,
        values
    ) {

        const row =
            document.createElement("tr");


        const titleCell =
            document.createElement("th");

        titleCell.textContent =
            title;

        row.appendChild(titleCell);


        values.forEach(
            function (value) {

                const cell =
                    document.createElement("td");

                cell.textContent =
                    value;

                row.appendChild(cell);

            }
        );


        table.appendChild(row);

    }


    // ==========================================
    // BACK BUTTON
    // ==========================================

    backButton.addEventListener(
        "click",
        function () {
            showCustomerScreen();
        }
    );


    // ==========================================
    // PRINT ALL-DAYS SALES
    // ==========================================

    printSales.addEventListener(
        "click",
        function () {

            const customer =
                getSelectedCustomer();


            if (!customer) {

                alert("Customer not found.");

                return;
            }


            window.print();

        }
    );


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    showCustomerScreen();

});

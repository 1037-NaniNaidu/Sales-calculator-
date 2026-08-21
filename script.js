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

    const customerForm =
        document.getElementById("customerForm");

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

    const newCustomerName =
        document.getElementById("newCustomerName");

    const customerName =
        document.getElementById("customerName");

    const productName =
        document.getElementById("productName");

    const productCost =
        document.getElementById("productCost");

    const daySales =
        document.getElementById("daySales");

    const totalSales =
        document.getElementById("totalSales");

    const salesList =
        document.getElementById("salesList");


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
    // GET TODAY'S DATE
    // ==========================================

    function getToday() {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return year + "-" + month + "-" + day;
    }


    // ==========================================
    // SHOW CUSTOMER LIST
    // ==========================================

    function showCustomerScreen() {

        customerScreen.classList.remove("hidden");
        customerMenu.classList.add("hidden");
        customerForm.classList.add("hidden");

        renderCustomers();
    }


    // ==========================================
    // RENDER CUSTOMERS
    // ==========================================

    function renderCustomers() {

        customerList.innerHTML = "";

        if (customers.length === 0) {

            customerList.innerHTML =
                '<div class="card empty">No customers yet.</div>';

            return;
        }


        customers.forEach(function (customer) {

            const button =
                document.createElement("button");

            button.className = "customer-button";

            button.textContent = customer.name;

            button.addEventListener("click", function () {
                openCustomer(customer.id);
            });

            customerList.appendChild(button);

        });
    }


    // ==========================================
    // ADD CUSTOMER BUTTON
    // ==========================================

    addCustomer.addEventListener("click", function () {

        customerScreen.classList.add("hidden");
        customerMenu.classList.add("hidden");
        customerForm.classList.remove("hidden");

        newCustomerName.value = "";
        newCustomerName.focus();

    });


    // ==========================================
    // SAVE CUSTOMER
    // ==========================================

    saveCustomer.addEventListener("click", function () {

        const name =
            newCustomerName.value.trim();

        if (name === "") {
            alert("Please enter customer name.");
            return;
        }


        const customer = {

            id: Date.now(),

            name: name,

            sales: []

        };


        customers.push(customer);

        saveData();

        showCustomerScreen();

    });


    // ==========================================
    // CANCEL ADD CUSTOMER
    // ==========================================

    cancelCustomer.addEventListener("click", function () {
        showCustomerScreen();
    });


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
    // RENDER CUSTOMER
    // ==========================================

    function renderCustomer() {

        const customer =
            customers.find(function (item) {
                return item.id === selectedCustomerId;
            });


        if (!customer) {
            showCustomerScreen();
            return;
        }


        customerName.textContent =
            customer.name;


        calculateSales(customer);

        renderSales(customer);

    }


    // ==========================================
    // CALCULATE SALES
    // ==========================================

    function calculateSales(customer) {

        const today =
            getToday();

        let todayTotal = 0;
        let overallTotal = 0;


        customer.sales.forEach(function (sale) {

            const cost =
                Number(sale.cost) || 0;

            overallTotal += cost;


            if (sale.date === today) {
                todayTotal += cost;
            }

        });


        daySales.textContent =
            todayTotal.toFixed(2);

        totalSales.textContent =
            overallTotal.toFixed(2);

    }


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    addProduct.addEventListener("click", function () {

        const name =
            productName.value.trim();

        const cost =
            Number(productCost.value);


        if (name === "") {
            alert("Please enter product name.");
            return;
        }


        if (
            productCost.value === "" ||
            isNaN(cost) ||
            cost < 0
        ) {
            alert("Please enter a valid cost.");
            return;
        }


        const customer =
            customers.find(function (item) {
                return item.id === selectedCustomerId;
            });


        if (!customer) {
            return;
        }


        customer.sales.push({

            product: name,

            cost: cost,

            date: getToday()

        });


        saveData();


        productName.value = "";
        productCost.value = "";


        renderCustomer();

    });


    // ==========================================
    // SHOW SALES
    // ==========================================

    function renderSales(customer) {

        salesList.innerHTML = "";


        if (customer.sales.length === 0) {

            salesList.innerHTML =
                '<div class="empty">No sales yet.</div>';

            return;
        }


        const reversedSales =
            [...customer.sales].reverse();


        reversedSales.forEach(function (sale) {

            const item =
                document.createElement("div");

            item.className = "sale-item";


            item.innerHTML =
                "<strong>" +
                escapeHTML(sale.product) +
                "</strong>" +
                "<br>₹" +
                Number(sale.cost).toFixed(2) +
                "<br><small>" +
                sale.date +
                "</small>";


            salesList.appendChild(item);

        });

    }


    // ==========================================
    // ESCAPE TEXT
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    // ==========================================
    // BACK BUTTON
    // ==========================================

    backButton.addEventListener("click", function () {

        selectedCustomerId = null;

        showCustomerScreen();

    });


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    showCustomerScreen();

});

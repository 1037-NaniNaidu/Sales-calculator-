window.onload = function () {

    let customers =
        JSON.parse(localStorage.getItem("storeCustomers")) || [];

    let selectedCustomerId = null;

    const customerScreen = document.getElementById("customerScreen");
    const customerMenu = document.getElementById("customerMenu");
    const addCustomerButton = document.getElementById("addCustomer");
    const customerList = document.getElementById("customerList");
    const backToCustomers = document.getElementById("backToCustomers");
    const customerTitle = document.getElementById("customerTitle");

    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const addProductButton = document.getElementById("addProduct");
    const productList = document.getElementById("productList");

    const saleProduct = document.getElementById("saleProduct");
    const selectedPrice = document.getElementById("selectedPrice");
    const saleQuantity = document.getElementById("saleQuantity");
    const saleAmount = document.getElementById("saleAmount");
    const addSaleButton = document.getElementById("addSale");

    const currentDay = document.getElementById("currentDay");
    const daySales = document.getElementById("daySales");
    const totalSales = document.getElementById("totalSales");
    const salesHistory = document.getElementById("salesHistory");
    const printSalesButton = document.getElementById("printSales");


    function saveCustomers() {
        localStorage.setItem(
            "storeCustomers",
            JSON.stringify(customers)
        );
    }


    function getSelectedCustomer() {
        return customers.find(function (customer) {
            return customer.id === selectedCustomerId;
        });
    }


    function getToday() {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return year + "-" + month + "-" + day;
    }


    function formatDate(dateString) {
        const date = new Date(dateString + "T00:00:00");

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }


    function money(amount) {
        return "₹" + Number(amount).toFixed(2);
    }


    function renderCustomers() {

        customerList.innerHTML = "";

        if (customers.length === 0) {
            customerList.innerHTML =
                "<p>No customers added yet.</p>";
            return;
        }

        customers.forEach(function (customer) {

            const button = document.createElement("button");

            button.type = "button";
            button.textContent = customer.name;

            button.onclick = function () {
                selectedCustomerId = customer.id;
                openCustomer();
            };

            customerList.appendChild(button);
        });
    }


    addCustomerButton.onclick = function () {

        const name = prompt("Enter customer name:");

        if (name === null || name.trim() === "") {
            return;
        }

        const customer = {
            id: Date.now(),
            name: name.trim(),
            products: [],
            sales: []
        };

        customers.push(customer);

        saveCustomers();
        renderCustomers();
    };


    function openCustomer() {

        const customer = getSelectedCustomer();

        if (!customer) {
            return;
        }

        customerScreen.classList.add("hidden");
        customerMenu.classList.remove("hidden");

        customerTitle.textContent = customer.name;

        updateCurrentDay();
        renderProducts();
        renderSales();
    }


    backToCustomers.onclick = function () {

        customerMenu.classList.add("hidden");
        customerScreen.classList.remove("hidden");

        selectedCustomerId = null;
    };


    function renderProducts() {

        const customer = getSelectedCustomer();

        if (!customer) {
            return;
        }

        productList.innerHTML = "";

        saleProduct.innerHTML =
            '<option value="">Select Product</option>';

        if (customer.products.length === 0) {

            productList.innerHTML =
                "<p>No products added yet.</p>";

            return;
        }

        customer.products.forEach(function (product) {

            const item = document.createElement("p");

            item.textContent =
                product.name + " - " + money(product.price);

            productList.appendChild(item);

            const option = document.createElement("option");

            option.value = product.id;

            option.textContent =
                product.name + " - " + money(product.price);

            saleProduct.appendChild(option);
        });
    }


    addProductButton.onclick = function () {

        const name = productName.value.trim();
        const price = Number(productPrice.value);

        if (name === "") {
            alert("Please enter a product name.");
            return;
        }

        if (
            productPrice.value === "" ||
            isNaN(price) ||
            price < 0
        ) {
            alert("Please enter a valid cost.");
            return;
        }

        const customer = getSelectedCustomer();

        if (!customer) {
            return;
        }

        customer.products.push({
            id: Date.now(),
            name: name,
            price: price
        });

        saveCustomers();

        productName.value = "";
        productPrice.value = "";

        renderProducts();
    };


    saleProduct.onchange = function () {
        updateSaleAmount();
    };


    saleQuantity.oninput = function () {
        updateSaleAmount();
    };


    function updateSaleAmount() {

        const customer = getSelectedCustomer();

        if (!customer) {
            return;
        }

        const productId = Number(saleProduct.value);
        const quantity = Number(saleQuantity.value) || 0;

        const product = customer.products.find(function (item) {
            return item.id === productId;
        });

        if (!product) {

            selectedPrice.textContent =
                "Price: ₹0.00";

            saleAmount.textContent =
                "Sale Amount: ₹0.00";

            return;
        }

        selectedPrice.textContent =
            "Price: " + money(product.price);

        saleAmount.textContent =
            "Sale Amount: " +
            money(product.price * quantity);
    }


    addSaleButton.onclick = function () {

        const customer = getSelectedCustomer();

        if (!customer) {
            return;
        }

        const productId = Number(saleProduct.value);
        const quantity = Number(saleQuantity.value);

        if (!productId) {
            alert("Please select a product.");
            return;
        }

        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        const product = customer.products.find(function (item) {
            return item.id === productId;
        });

        if (!product) {
            return;
        }

        const amount = product.price * quantity;

        customer.sales.push({
            id: Date.now(),
            productName: product.name,
            price: product.price,
            quantity: quantity,
            amount: amount,
            date: getToday()
        });

        saveCustomers();

        saleProduct.value = "";
        saleQuantity.value = "";

        selectedPrice.textContent =
            "Price: ₹0.00";

        saleAmount.textContent =
            "Sale Amount: ₹0.00";

        renderSales();
    };


    function updateCurrentDay() {

        currentDay.textContent =
            "Today: " + formatDate(getToday());
    }


    function renderSales() {

        const customer = getSelectedCustomer();

        if (!customer) {
            return;
        }

        const today = getToday();

        let todayTotal = 0;
        let allTotal = 0;

        salesHistory.innerHTML = "";

        if (customer.sales.length === 0) {

            salesHistory.innerHTML =
                "<p>No sales recorded yet.</p>";
        }

        customer.sales.forEach(function (sale) {

            allTotal += Number(sale.amount);

            if (sale.date === today) {
                todayTotal += Number(sale.amount);
            }

            const item = document.createElement("div");

            item.innerHTML =
                "<strong>" +
                sale.productName +
                "</strong><br>" +
                "Quantity: " +
                sale.quantity +
                "<br>" +
                "Amount: " +
                money(sale.amount) +
                "<br>" +
                "Date: " +
                formatDate(sale.date) +
                "<hr>";

            salesHistory.appendChild(item);
        });

        daySales.innerHTML =
            "<p>" + money(todayTotal) + "</p>";

        totalSales.innerHTML =
            '<p class="total">' +
            money(allTotal) +
            "</p>";
    }


    printSalesButton.onclick = function () {
        window.print();
    };


    updateCurrentDay();
    renderCustomers();

};

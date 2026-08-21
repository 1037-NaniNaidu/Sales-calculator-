document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // GET HTML ELEMENTS
    // ==============================

    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const addProductButton = document.getElementById("addProduct");
    const productList = document.getElementById("productList");

    const customerName = document.getElementById("customerName");
    const addCustomerButton = document.getElementById("addCustomer");
    const customerList = document.getElementById("customerList");

    const saleCustomer = document.getElementById("saleCustomer");
    const saleProduct = document.getElementById("saleProduct");
    const selectedPrice = document.getElementById("selectedPrice");
    const saleQuantity = document.getElementById("saleQuantity");
    const saleAmount = document.getElementById("saleAmount");
    const addSaleButton = document.getElementById("addSale");

    const dailySales = document.getElementById("dailySales");
    const customerSales = document.getElementById("customerSales");
    const overallTotal = document.getElementById("overallTotal");

    const clearAllButton = document.getElementById("clearAll");
    const currentDay = document.getElementById("currentDay");


    // ==============================
    // DATA
    // ==============================

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let sales = JSON.parse(localStorage.getItem("sales")) || [];


    // ==============================
    // SAVE DATA
    // ==============================

    function saveData() {
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("customers", JSON.stringify(customers));
        localStorage.setItem("sales", JSON.stringify(sales));
    }


    // ==============================
    // DISPLAY PRODUCTS
    // ==============================

    function displayProducts() {

        productList.innerHTML = "";

        if (products.length === 0) {
            productList.innerHTML = "<p>No products added yet.</p>";
        } else {

            products.forEach(function (product, index) {

                const div = document.createElement("div");

                div.innerHTML =
                    "<strong>" + product.name + "</strong>" +
                    " - ₹" + product.price.toFixed(2);

                productList.appendChild(div);
            });
        }

        updateProductDropdown();
    }


    // ==============================
    // ADD PRODUCT
    // ==============================

    addProductButton.addEventListener("click", function () {

        const name = productName.value.trim();
        const price = Number(productPrice.value);

        if (name === "") {
            alert("Please enter a product name.");
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert("Please enter a valid product price.");
            return;
        }

        products.push({
            name: name,
            price: price
        });

        saveData();

        productName.value = "";
        productPrice.value = "";

        displayProducts();

        alert("Product added successfully!");
    });


    // ==============================
    // DISPLAY CUSTOMERS
    // ==============================

    function displayCustomers() {

        customerList.innerHTML = "";

        if (customers.length === 0) {
            customerList.innerHTML = "<p>No customers added yet.</p>";
        } else {

            customers.forEach(function (customer) {

                const div = document.createElement("div");

                div.textContent = customer.name;

                customerList.appendChild(div);
            });
        }

        updateCustomerDropdown();
    }


    // ==============================
    // ADD CUSTOMER
    // ==============================

    addCustomerButton.addEventListener("click", function () {

        const name = customerName.value.trim();

        if (name === "") {
            alert("Please enter a customer name.");
            return;
        }

        customers.push({
            name: name
        });

        saveData();

        customerName.value = "";

        displayCustomers();

        alert("Customer added successfully!");
    });


    // ==============================
    // PRODUCT DROPDOWN
    // ==============================

    function updateProductDropdown() {

        saleProduct.innerHTML =
            '<option value="">Select Product</option>';

        products.forEach(function (product, index) {

            const option = document.createElement("option");

            option.value = index;
            option.textContent =
                product.name + " - ₹" + product.price.toFixed(2);

            saleProduct.appendChild(option);
        });
    }


    // ==============================
    // CUSTOMER DROPDOWN
    // ==============================

    function updateCustomerDropdown() {

        saleCustomer.innerHTML =
            '<option value="">Walk-in / No Regular Customer</option>';

        customers.forEach(function (customer, index) {

            const option = document.createElement("option");

            option.value = index;
            option.textContent = customer.name;

            saleCustomer.appendChild(option);
        });
    }


    // ==============================
    // PRODUCT PRICE
    // ==============================

    saleProduct.addEventListener("change", function () {

        const index = saleProduct.value;

        if (index === "") {

            selectedPrice.textContent = "Price: ₹0.00";
            saleAmount.textContent = "Sale Amount: ₹0.00";

            return;
        }

        const price = products[index].price;

        selectedPrice.textContent =
            "Price: ₹" + price.toFixed(2);

        calculateSaleAmount();
    });


    // ==============================
    // CALCULATE SALE AMOUNT
    // ==============================

    saleQuantity.addEventListener("input", calculateSaleAmount);

    function calculateSaleAmount() {

        const productIndex = saleProduct.value;
        const quantity = Number(saleQuantity.value);

        if (productIndex === "" || quantity <= 0) {

            saleAmount.textContent =
                "Sale Amount: ₹0.00";

            return;
        }

        const price = products[productIndex].price;
        const amount = price * quantity;

        saleAmount.textContent =
            "Sale Amount: ₹" + amount.toFixed(2);
    }


    // ==============================
    // ADD SALE
    // ==============================

    addSaleButton.addEventListener("click", function () {

        const productIndex = saleProduct.value;
        const quantity = Number(saleQuantity.value);
        const customerIndex = saleCustomer.value;

        if (productIndex === "") {
            alert("Please select a product.");
            return;
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        const product = products[productIndex];

        const customer =
            customerIndex === ""
                ? "Walk-in"
                : customers[customerIndex].name;

        const amount = product.price * quantity;

        sales.push({
            product: product.name,
            price: product.price,
            quantity: quantity,
            customer: customer,
            amount: amount,
            date: new Date().toISOString()
        });

        saveData();

        saleProduct.value = "";
        saleCustomer.value = "";
        saleQuantity.value = "";

        selectedPrice.textContent = "Price: ₹0.00";
        saleAmount.textContent = "Sale Amount: ₹0.00";

        displaySales();

        alert("Sale added successfully!");
    });


    // ==============================
    // DISPLAY SALES
    // ==============================

    function displaySales() {

        dailySales.innerHTML = "";
        customerSales.innerHTML = "";

        if (sales.length === 0) {

            dailySales.innerHTML =
                "<p>No sales recorded yet.</p>";

            customerSales.innerHTML =
                "<p>No customer sales recorded yet.</p>";

            updateTotal();

            return;
        }


        // DAILY SALES

        sales.forEach(function (sale) {

            const div = document.createElement("div");

            div.textContent =
                sale.product +
                " × " +
                sale.quantity +
                " = ₹" +
                sale.amount.toFixed(2) +
                " (" +
                sale.customer +
                ")";

            dailySales.appendChild(div);
        });


        // CUSTOMER SALES

        const customerTotals = {};

        sales.forEach(function (sale) {

            if (!customerTotals[sale.customer]) {
                customerTotals[sale.customer] = 0;
            }

            customerTotals[sale.customer] += sale.amount;
        });


        Object.keys(customerTotals).forEach(function (customer) {

            const div = document.createElement("div");

            div.textContent =
                customer +
                " = ₹" +
                customerTotals[customer].toFixed(2);

            customerSales.appendChild(div);
        });


        updateTotal();
    }


    // ==============================
    // GRAND TOTAL
    // ==============================

    function updateTotal() {

        let totalItems = 0;
        let totalAmount = 0;

        sales.forEach(function (sale) {

            totalItems += sale.quantity;
            totalAmount += sale.amount;

        });

        overallTotal.innerHTML =
            "<h2>💰 Store Grand Total</h2>" +
            "<p>" +
            totalItems +
            " items = ₹" +
            totalAmount.toFixed(2) +
            "</p>";
    }


    // ==============================
    // CLEAR ALL SALES
    // ==============================

    clearAllButton.addEventListener("click", function () {

        if (sales.length === 0) {
            alert("There are no sales to clear.");
            return;
        }

        const confirmClear =
            confirm("Are you sure you want to clear all sales?");

        if (!confirmClear) {
            return;
        }

        sales = [];

        saveData();

        displaySales();

        alert("All sales cleared.");
    });


    // ==============================
    // INITIAL DISPLAY
    // ==============================

    displayProducts();
    displayCustomers();
    displaySales();

});


   
             

// =====================================================
// STORE SALES MANAGER
// COMPLETE FINAL WORKING SCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // GET HTML ELEMENTS
    // =================================================

    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const addProductButton = document.getElementById("addProduct");
    const productList = document.getElementById("productList");

    const customerName = document.getElementById("customerName");
    const addCustomerButton = document.getElementById("addCustomer");
    const customerList = document.getElementById("customerList");

    const saleCustomer = document.getElementById("saleCustomer");
    const saleProduct = document.getElementById("saleProduct");
    const saleQuantity = document.getElementById("saleQuantity");

    const selectedPrice = document.getElementById("selectedPrice");
    const saleAmount = document.getElementById("saleAmount");
    const addSaleButton = document.getElementById("addSale");

    const currentDay = document.getElementById("currentDay");
    const dailySales = document.getElementById("dailySales");
    const customerSales = document.getElementById("customerSales");
    const overallTotal = document.getElementById("overallTotal");
    const clearAll = document.getElementById("clearAll");


    // =================================================
    // CHECK HTML ELEMENTS
    // =================================================

    if (
        !productName ||
        !productPrice ||
        !addProductButton ||
        !productList ||
        !customerName ||
        !addCustomerButton ||
        !customerList ||
        !saleCustomer ||
        !saleProduct ||
        !saleQuantity ||
        !selectedPrice ||
        !saleAmount ||
        !addSaleButton ||
        !currentDay ||
        !dailySales ||
        !customerSales ||
        !overallTotal ||
        !clearAll
    ) {
        console.error(
            "Store Sales Manager: One or more HTML elements are missing."
        );

        alert(
            "There is an HTML connection problem. Please make sure you are using the correct index.html."
        );

        return;
    }


    // =================================================
    // LOAD DATA SAFELY
    // =================================================

    function loadData(key) {

        try {

            const savedData =
                localStorage.getItem(key);

            if (!savedData) {
                return [];
            }

            const parsedData =
                JSON.parse(savedData);

            if (Array.isArray(parsedData)) {
                return parsedData;
            }

            return [];

        } catch (error) {

            console.error(
                "Error loading " + key,
                error
            );

            return [];
        }
    }


    let products =
        loadData("storeProducts");

    let customers =
        loadData("storeCustomers");

    let sales =
        loadData("storeSales");


    // =================================================
    // SAVE DATA
    // =================================================

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


    // =================================================
    // CREATE UNIQUE ID
    // =================================================

    function createId() {

        return (
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2)
        );
    }


    // =================================================
    // GET TODAY'S DATE
    // =================================================

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


    // =================================================
    // GET FIRST SALES DATE
    // =================================================

    function getFirstSalesDate() {

        if (sales.length === 0) {

            return getDateString(
                new Date()
            );
        }


        const dates =
            sales
                .map(
                    sale => sale.date
                )
                .filter(
                    date =>
                        typeof date === "string"
                )
                .sort();


        if (dates.length === 0) {

            return getDateString(
                new Date()
            );
        }


        return dates[0];
    }


    // =================================================
    // GET SALES DAY
    // =================================================

    function getSalesDay(dateString) {

        const firstDate =
            new Date(
                getFirstSalesDate() +
                "T00:00:00"
            );


        const currentDate =
            new Date(
                dateString +
                "T00:00:00"
            );


        const difference =
            currentDate - firstDate;


        return (
            Math.floor(
                difference /
                (24 * 60 * 60 * 1000)
            ) + 1
        );
    }


    // =================================================
    // UPDATE CURRENT DAY
    // =================================================

    function updateCurrentDay() {

        const today =
            getDateString(
                new Date()
            );


        const day =
            getSalesDay(today);


        currentDay.textContent =
            "Sales Day " + day;
    }


    // =================================================
    // ADD PRODUCT
    // =================================================

    function addProduct() {

        const name =
            productName.value.trim();


        const price =
            Number(
                productPrice.value
            );


        if (name === "") {

            alert(
                "Please enter a product name."
            );

            productName.focus();

            return;
        }


        if (
            productPrice.value === "" ||
            !Number.isFinite(price) ||
            price < 0
        ) {

            alert(
                "Please enter a valid product price."
            );

            productPrice.focus();

            return;
        }


        const alreadyExists =
            products.some(
                product =>
                    String(
                        product.name
                    ).toLowerCase() ===
                    name.toLowerCase()
            );


        if (alreadyExists) {

            alert(
                "This product already exists."
            );

            productName.focus();

            return;
        }


        products.push({

            id:
                createId(),

            name:
                name,

            price:
                price

        });


        saveProducts();


        productName.value = "";
        productPrice.value = "";


        displayProducts();
        updateProductDropdown();


        alert(
            name +
            " added successfully."
        );


        productName.focus();
    }


    // =================================================
    // DISPLAY PRODUCTS
    // =================================================

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
                    document.createElement(
                        "div"
                    );


                box.className =
                    "product-item";


                const text =
                    document.createElement(
                        "p"
                    );


                text.textContent =
                    product.name +
                    " — ₹" +
                    Number(
                        product.price
                    ).toFixed(2);


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        const confirmed =
                            confirm(
                                "Delete " +
                                product.name +
                                "?"
                            );


                        if (!confirmed) {
                            return;
                        }


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


                productList.appendChild(
                    box
                );

            }
        );
    }


    // =================================================
    // UPDATE PRODUCT DROPDOWN
    // =================================================

    function updateProductDropdown() {

        saleProduct.innerHTML = "";


        const firstOption =
            document.createElement(
                "option"
            );


        firstOption.value = "";

        firstOption.textContent =
            "Select Product";


        saleProduct.appendChild(
            firstOption
        );


        products.forEach(
            product => {

                const option =
                    document.createElement(
                        "option"
                    );


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


    // =================================================
    // ADD CUSTOMER
    // =================================================

    function addCustomer() {

        const name =
            customerName.value.trim();


        if (name === "") {

            alert(
                "Please enter a customer name."
            );

            customerName.focus();

            return;
        }


        const alreadyExists =
            customers.some(
                customer =>
                    String(
                        customer.name
                    ).toLowerCase() ===
                    name.toLowerCase()
            );


        if (alreadyExists) {

            alert(
                "This customer already exists."
            );

            customerName.focus();

            return;
        }


        customers.push({

            id:
                createId(),

            name:
                name

        });


        saveCustomers();


        customerName.value = "";


        displayCustomers();
        updateCustomerDropdown();


        alert(
            name +
            " added successfully."
        );


        customerName.focus();
    }


    // =================================================
    // DISPLAY CUSTOMERS
    // =================================================

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
                    document.createElement(
                        "div"
                    );


                box.className =
                    "customer-item";


                const text =
                    document.createElement(
                        "p"
                    );


                text.textContent =
                    customer.name;


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.type =
                    "button";


                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        const confirmed =
                            confirm(
                                "Delete " +
                                customer.name +
                                "?"
                            );


                        if (!confirmed) {
                            return;
                        }


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


                customerList.appendChild(
                    box
                );

            }
        );
    }


    // =================================================
    // UPDATE CUSTOMER DROPDOWN
    // =================================================

    function updateCustomerDropdown() {

        saleCustomer.innerHTML = "";


        const firstOption =
            document.createElement(
                "option"
            );


        firstOption.value = "";


        firstOption.textContent =
            "Walk-in / No Regular Customer";


        saleCustomer.appendChild(
            firstOption
        );


        customers.forEach(
            customer => {

                const option =
                    document.createElement(
                        "option"
                    );


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


    // =================================================
    // UPDATE PRICE AND SALE AMOUNT
    // =================================================

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


        const price =
            Number(
                product.price
            );


        selectedPrice.textContent =
            "Price: ₹" +
            price.toFixed(2);


        const quantity =
            Number(
                saleQuantity.value
            );


        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            saleAmount.textContent =
                "Sale Amount: ₹0.00";

            return;
        }


        const amount =
            price *
            quantity;


        saleAmount.textContent =
            "Sale Amount: ₹" +
            amount.toFixed(2);
    }


    // =================================================
    // ADD SALE
    // =================================================

    function addSale() {

        const product =
            products.find(
                item =>
                    item.id ===
                    saleProduct.value
            );


        const customer =
            customers.find(
                item =>
                    item.id ===
                    saleCustomer.value
            );


        const quantity =
            Number(
                saleQuantity.value
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


        const price =
            Number(
                product.price
            );


        const amount =
            price *
            quantity;


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
                price,

            quantity:
                quantity,

            amount:
                amount,

            customerId:
                customer
                    ? customer.id
                    : "",

            customerName:
                customer
                    ? customer.name
                    : ""

        };


        sales.push(
            newSale
        );


        saveSales();


        // CLEAR INPUTS

        saleProduct.value = "";

        saleQuantity.value = "";

        saleCustomer.value = "";


        selectedPrice.textContent =
            "Price: ₹0.00";


        saleAmount.textContent =
            "Sale Amount: ₹0.00";


        // REFRESH

        displayAll();

    }


    // =================================================
    // DISPLAY DAILY SALES
    // =================================================

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

                const day =
                    Number(
                        sale.day
                    );
                        if (!days[day]) {
            days[day] = [];
        }

        days[day].push(sale);
    });

    // Sort days from lowest to highest
    const sortedDays = Object.keys(days)
        .map(Number)
        .sort((a, b) => a - b);

    sortedDays.forEach(day => {
        const daySales = days[day];

        // Calculate total sales for this day
        const dayTotal = daySales.reduce(
            (total, sale) => total + Number(sale.total || 0),
            0
        );

        // Calculate total quantity for this day
        const dayQuantity = daySales.reduce(
            (total, sale) => total + Number(sale.quantity || 0),
            0
        );

        console.log(
            `Day ${day}: ${dayQuantity} items, Total Sales: ₹${dayTotal.toFixed(2)}`
        );
    });

    // Refresh everything on the page
    if (typeof displayAll === "function") {
        displayAll();
    }

});


  


   
             

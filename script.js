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

                          

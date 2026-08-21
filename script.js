alert("SCRIPT.JS IS WORKING");

document.addEventListener("DOMContentLoaded", function () {

    const addCustomerButton =
        document.getElementById("addCustomer");

    if (!addCustomerButton) {
        alert("ADD CUSTOMER BUTTON NOT FOUND");
        return;
    }

    addCustomerButton.addEventListener("click", function () {

        alert("ADD CUSTOMER BUTTON IS WORKING");

    });

});

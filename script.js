document.addEventListener("DOMContentLoaded", function () {

    const addCustomerButton = document.getElementById("addCustomer");

    if (addCustomerButton) {
        addCustomerButton.addEventListener("click", function () {
            alert("ADD CUSTOMER BUTTON FOUND AND WORKING!");
        });
    } else {
        alert("ADD CUSTOMER BUTTON NOT FOUND!");
    }

});


   
             

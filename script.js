alert("New script test 123");

document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("addCustomer");

    if (button) {
        alert("ADD CUSTOMER BUTTON FOUND");

        button.addEventListener("click", function () {
            alert("ADD CUSTOMER CLICKED");
        });

    } else {
        alert("ADD CUSTOMER BUTTON NOT FOUND");
    }

});  
        

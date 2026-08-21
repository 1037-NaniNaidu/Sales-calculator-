alert("SCRIPT.JS WORKING");

document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("addCustomer");

    if (button) {
        alert("BUTTON FOUND");

        button.onclick = function () {
            alert("ADD CUSTOMER WORKING");
        };

    } else {
        alert("BUTTON NOT FOUND");
    }

});

document.addEventListener("DOMContentLoaded", function () {

    alert("JavaScript is working!");

    const buttons = document.querySelectorAll("button");

    let found = false;

    buttons.forEach(function (button) {

        if (button.textContent.trim() === "Add Product") {

            found = true;

            button.addEventListener("click", function () {
                alert("ADD PRODUCT BUTTON FOUND AND WORKING!");
            });

        }

    });

    if (!found) {
        alert("ADD PRODUCT BUTTON STILL NOT FOUND!");
    }

});


   
             

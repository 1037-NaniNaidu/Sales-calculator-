document.addEventListener("DOMContentLoaded", function () {

    alert("JavaScript is working!");

    const addProductButton = document.getElementById("addProductButton");

    if (addProductButton) {
        addProductButton.addEventListener("click", function () {
            alert("Add Product button is working!");
        });
    } else {
        alert("Add Product button NOT found!");
    }

});

  


   
             

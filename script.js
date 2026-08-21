document.addEventListener("DOMContentLoaded", function () {

    alert("TEST STARTED");

    alert("Page HTML length: " + document.documentElement.outerHTML.length);

    alert("Add Product exists: " +
        (document.getElementById("addProduct") !== null));

});


   
             

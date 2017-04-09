var mysql = require("mysql");
var inquirer = require("inquirer");


var available = 0;
var price = 0;
var totalCost = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});


connection.connect(function(err) {
    if(err) throw err;
});



var selection = 3;
var desired = 2;

listItems();


// getAvailable(selection);

// purchaseItem(selection, desired);


function listItems(){
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i=0; i<res.length; i++) {
            printItems(res, i);
        }
        getAvailable(selection);
    });
}



function getAvailable(id) {
    connection.query("SELECT stock_quantity, price FROM products WHERE ?", 
    {id: selection}, function(err, res) {
        available = res[0].stock_quantity;
        price = res[0].price;
        purchaseItem(selection, desired);
    });   
};


function purchaseItem(selection, desired){
    if(desired>available) {
        console.log("too many");
    } else {
        console.log("can purchase");
        totalCost = desired * price;
        completePurchase(selection, desired);
    }
};


function printItems(results, i){
    console.log("ID: " + results[i].id + " | " + results[i].product_name + " | Price: " + results[i].price);
};


function completePurchase(selection, desired){
    var newQuantity = available-desired;

    
    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {id: selection}], 
        function(err){
            if(err) throw err;
        });
    console.log("Total Cost: " + totalCost);
};


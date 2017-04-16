var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require("table");


var available = 0;
var price = 0;
var totalCost = 0;
var selection = 0;
var desired = 0;
var data = [["Product ID", "Product Name", "Price"]];
var output;

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



function mainMenu(){
  console.log(""); 
  console.log(""); 
  inquirer.prompt([
    {
      type: "input",
      name: "selection",
      message: "Enter the ID of the product you want to buy.",
    },
    {
      type: "input",
      name: "wants",
      message: "Enter the quantity you want to purchase.",
    }

  ]).then(function(user) {
    selection = user.selection;
    desired = user.wants;

    getAvailable(selection);

  });
}



listItems();


// getAvailable(selection);

// purchaseItem(selection, desired);


function listItems(){
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i=0; i<res.length; i++) {
            printItems(res, i);
        }
        output = table(data);
        console.log(output);        
        mainMenu();
        
    });
}


function newTransaction(){
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to purchase another item?",
            name: "newTxn",
            choices: ["Yes", "No"]
        }
    ]).then(function(resp){
        switch(resp.newTxn){
            case "Yes":
                listItems();
                break;
            default:
                break;
        }
    })
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
        console.log("Sorry, we don't have enough of that item in stock to fulfill your order.");
        newTransaction();
    } else {
        totalCost = parseFloat(desired * price).toFixed(2);
        completePurchase(selection, desired);
    }
};


function printItems(results, i){
    var currentRow = [];
    currentRow = [results[i].id, results[i].product_name, results[i].price];
    data.push(currentRow);
    // console.log("ID: " + results[i].id + " | " + results[i].product_name + " | Price: " + results[i].price);
};


function completePurchase(selection, desired){
    var newQuantity = available-desired;

    
    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQuantity}, {id: selection}], 
        function(err){
            if(err) throw err;
        });

    connection.query("UPDATE products SET product_sales = product_sales + " + totalCost + " WHERE ?", [{id: selection}], 
        function(err){
            if(err) throw err;
        });

    connection.query(
        "UPDATE departments JOIN products ON departments.department_name = products.department_name SET departments.total_sales = departments.total_sales + " + totalCost + "WHERE products.id = " + selection, 
            function(err){
            if(err) throw err;
        });        
    console.log("Thank you for your purchase. Your total cost today is $" + totalCost);
    newTransaction();
};


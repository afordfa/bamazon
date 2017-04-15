

var mysql = require("mysql");
var inquirer = require("inquirer");


var available = 0;
var price = 0;
var totalCost = 0;
var selection = 0;
var desired = 0;
var data = [];

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

mainMenu();


function mainMenu(){
  console.log(""); 
  console.log(""); 
  inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: "Please make a selection below",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
  ]).then(function(user) {
        switch(user.selection){
            case "View Products for Sale":
                viewProducts();
                // If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
                break;
            case "View Low Inventory":
                viewLowInventory();
                // If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
                break;
            case "Add to Inventory":
                addInventory();
                // If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
                break;
            case "Add New Product":
                addNewProduct();
                // If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
                break;
            default:
                break;
        }
  });
}



var columnify = require('columnify')
var columns = columnify(data)
console.log(columns)


// var data = [{
//   "item id": 13,
//   name: 'some description',
//   price: 63.12,
//   quantity: 45
// }, {
//   "item id": 42,
//   name: 'go frogs',
//   price: 13.64,
//   quantity: 12
// }]





function viewProducts(){
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("");
        console.log("");
        for (var i=0; i<res.length; i++) {
            console.log("ID: " + res[i].id + 
            "  |  Name: " + res[i].product_name + 
            "  |  Price: " + res[i].price + 
            "  |  Quantity: " + res[i].stock_quantity);
            
            // printItems(res, i);
        }    
        mainMenu();
    });
    
};




function viewLowInventory(){
// If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        console.log("");
        console.log("");
        for (var i=0; i<res.length; i++) {
            console.log("ID: " + res[i].id + 
            "  |  Name: " + res[i].product_name + 
            "  |  Price: " + res[i].price + 
            "  |  Quantity: " + res[i].stock_quantity);
            
            // printItems(res, i);
        }    
        mainMenu();
    });
};

function addInventory(){
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of 
// any item currently in the store.

  inquirer.prompt([
    {
      type: "input",
      name: "selection",
      message: "Enter the product ID that you want to restock",
    }, 
    {
        type: "input",
        name: "restock",
        message: "Enter the number of items to add to the stock"
    }
  ]).then(function(user) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity + " + user.restock + " WHERE ?", [{id: user.selection}], 
            function(err){
                if(err) throw err;
            });
        mainMenu();
  });



    
};

function addNewProduct(){
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name fo the product you want to add.",
    }, 
    {
        type: "input",
        name: "department",
        message: "What department does the product belong in?"
    },
        {
        type: "input",
        name: "price",
        message: "What is the retail price of the item?"
    },
    {
        type: "input",
        name: "quantity",
        message: "How many items do you have in stock?"
    }
  ]).then(function(user) {
      priceFloat = parseFloat(user.price);
      quantityInt = parseInt(user.quantity);
        connection.query("INSERT INTO products SET ?", 
        {product_name: user.name, department_name: user.department, price: priceFloat, stock_quantity: quantityInt},
        function(err){
            if(err) throw err;
        });
        mainMenu();
  });

};






var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');


var data = [['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']];
var output;


var available = 0;
var price = 0;
var totalCost = 0;
var selection = 0;
var desired = 0;


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
      choices: ["View Product Sales by Department", "Create New Department"]
    }
  ]).then(function(user) {
        switch(user.selection){
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                createDepartment();
                break;
            default:
                break;
        }
  });
};


function viewSales(){
    connection.query("SELECT * FROM departments", function(err, res) {
        for (var i=0; i<res.length; i++) {
            printItems(res, i);
        }
        output = table(data);
        console.log(output);
        mainMenu();
    });
}

function printItems(results, i){
    profit = results[i].total_sales - results[i].over_head_costs;
    profit = parseFloat(profit).toFixed(2);
    var currentRow = [];
    currentRow = [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].total_sales, profit]
    data.push(currentRow);
    // console.log(currentRow);
    // console.log("ID: " + results[i].department_id + " | " + results[i].department_name + " | Overhead: " + results[i].over_head_costs + "  |  Product Sales: " + results[i].total_sales + "  |  Total Profit: " + profit);
};




function createDepartment(){
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name fo the department you want to add.",
    }, 
    {
        type: "input",
        name: "overhead",
        message: "What is the overhead cost for the department?"
    },
        {
        type: "input",
        name: "total",
        message: "What are the total sales for the department?"
    }
  ]).then(function(user) {
      var overheadFloat = parseFloat(user.overhead);
      var totalFloat = parseFloat(user.total);
        connection.query("INSERT INTO departments SET ?", 
        {department_name: user.name, over_head_costs: overheadFloat, total_sales: totalFloat},
        function(err){
            if(err) throw err;
        });
        mainMenu();
  });
};

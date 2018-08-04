var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "H121j112*",
  database: "bamazon"
});


connection.connect(function(err) {
  if (err) throw err;
;
});

buyProduct();




function buyProduct() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

  inquirer
    .prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].product_name);
          }
          return choiceArray;
        },
      message: "What is the id of the item you would like to purchase?"
    },
    {
      name: "quantity",
      type: "input",
      message: "How many of the units would you like to buy?"
    }
  ])
    .then(function(answer) {
      var chosenAmount;
      
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name == answer.choice) {
          chosenAmount = results[i];
        }
      }
          if (chosenAmount.stock_quantity >= parseInt(answer.quantity)) {
            connection.query(
              "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: chosenAmount.stock_quantity - answer.quantity
              },
              {
                product_name: chosenAmount.product_name
              }
            ],
          
            function(error) {
              if (error) throw err;
              var totalAmount = answer.quantity * chosenAmount.price
              console.log("Your total for your purchase is: " + "$" + (totalAmount).toFixed(2));
              buyProduct();
            }
          );
        } else {
          console.log("Insufficient Quantity!!!");
          buyProduct();
        }
        
      
        })
      
    });
  }
      
      



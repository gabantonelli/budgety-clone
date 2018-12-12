// BUDGET CONTROLLER
var budgetController = (function() {
  //IIFE that will return an object
  /**
     return {
         method:
         property:
     }
     */
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, description, value) {
      var newItem, ID;
      if (data.allItems[type].length > 0) {
        //take the last id and add 1
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "exp") {
        newItem = new Expense(ID, description, value);
      } else if (type === "inc") {
        newItem = new Income(ID, description, value);
      }
      data.allItems[type].push(newItem);
      return newItem;
    }
  };
})();

// UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(newItem, type) {
      var html, newHtml, element;

      // cretate HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace the placeholder text with our data
      newHtml = html.replace("%id%", newItem.id);
      newHtml = newHtml.replace("%description%", newItem.description);
      newHtml = newHtml.replace("%value%", newItem.value);

      // insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    // method to delete the input fields for example after submitting
    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      //querySelectorAll doesn't return an array, but a list. We need to covert to array
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(element, index, array) {
        element.value = "";
      });

      //focus on the first input
      fieldsArr[0].focus();
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  //creo una funzione per raggruppare insieme tutti gli event listeners che creerò
  var setupEventListeners = function() {
    var DOMstrings = UICtrl.getDOMstrings();

    document
      .querySelector(DOMstrings.inputBtn)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(e) {
      // e è un key event passato dall'event listener
      // uso la proprietà keycode per verificare che sia il tasto enter
      // alcuni vecchi browsers usano la proprietà which invece di keyCOde quindi
      // le devo verificare entrambe
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    var input, newItem;

    // TO DO 1. get filed input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. add item to UI
      UICtrl.addListItem(newItem, input.type);
      // 4. clear input fields
      UICtrl.clearFields();
      // 5. calculate/update budget
    }
  };

  return {
    init: function() {
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();

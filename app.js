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
})();

// UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
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
    // TO DO 1. get filed input data
    var input = UICtrl.getInput();
    // 2. add item to budget controller
    // 3. add item to UI
    // 4. calculate budget
    // 5. display the budget
  };

  return {
    init: function() {
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();

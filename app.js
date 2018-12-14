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
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
    },
    budget: 0,
    percentage: -1
  };

  var calculateTotal = function(type) {
    var total = 0;
    data.allItems[type].forEach(function(cur) {
      total += cur.value;
    });
    data.totals[type] = total;
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
    },

    deleteItem: function(type, id) {
      var arrIds, indexToDelete;
      // map works like foreach but it creates a new array
      // in this case i want to create an array with all the ids
      arrIds = data.allItems[type].map(function(cur) {
        return cur.id;
      });
      indexToDelete = arrIds.indexOf(id);

      if (indexToDelete >= 0) {
        data.allItems[type].splice(indexToDelete, 1);
      }
    },

    calculateBudget: function() {
      // calculate total of income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // calculate budget income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(item) {
        item.calculatePercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var percentages = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return percentages;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage"
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace the placeholder text with our data
      newHtml = html.replace("%id%", newItem.id);
      newHtml = newHtml.replace("%description%", newItem.description);
      newHtml = newHtml.replace("%value%", newItem.value);

      // insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selectorId) {
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
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

    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function(arrPercentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); //return a list of Nodes

      var nodeListForEach = function(list, func) {
        for (var i = 0; i < list.length; i++) {
          func(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if (arrPercentages[index] > 0) {
          current.textContent = arrPercentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
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

    document
      .querySelector(DOMstrings.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. calculate the budget
    budgetCtrl.calculateBudget();
    // 2. return the budget
    var budget = budgetCtrl.getBudget();
    // 3. update budget on UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    // calculate percentages
    // read them from budgetController
    // update UI
    budgetCtrl.calculatePercentages();
    var percentages = budgetCtrl.getPercentages();
    UICtrl.displayPercentages(percentages);
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
    updateBudget();
    updatePercentages();
  };

  var ctrlDeleteItem = function(e) {
    function findParent(el, className) {
      while ((el = el.parentElement) && !el.classList.contains(className));
      return el;
    }
    var itemID;
    itemDelete = findParent(event.target, "item__delete");
    if (itemDelete) itemID = itemDelete.parentNode.parentNode.id;

    if (itemID) {
      var splitID, type, id;
      splitID = itemID.split("-");
      type = splitID[0];
      id = parseInt(splitID[1]);
      // delete the item from data in budgetctrl
      budgetCtrl.deleteItem(type, id);
      // delete the item from UI
      UICtrl.deleteListItem(itemID);
      // 3. update the budget and display the new one
      updateBudget();
      // update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    }
  };
})(budgetController, UIController);

controller.init();

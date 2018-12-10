// BUDGET CONTROLLER
var budgetController = (function() {
  //IIFE that will return an object
  /**
     return {
         method:
         property:
     }
     */
})();

// UI CONTROLLER
var UIController = (function() {})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  var ctrlAddItem = function() {
    // TO DO 1. get filed input data
    // 2. add item to budget controller
    // 3. add item to UI
    // 4. calculate budget
    // 5. display the budget
    console.log("test succeed");
  };

  document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

  document.addEventListener("keypress", function(e) {
    // e è un key event passato dall'event listener
    // uso la proprietà keycode per verificare che sia il tasto enter
    // alcuni vecchi browsers usano la proprietà which invece di keyCOde quindi
    // le devo verificare entrambe
    if (e.keyCode === 13 || e.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);

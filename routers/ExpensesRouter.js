const express = require("express");
const router = express.Router();

class ExpensesRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // router.get("/", this.controller.getAll.bind(this.controller));
    // router.get("/:groupId", this.controller.getOneGroup.bind(this.controller));
    // router.post("/", this.controller.createOneGroup.bind(this.controller));
    router.get(
      "/invoice/:invoiceId",
      this.controller.getExpenses.bind(this.controller)
    );
    router.get(
      "/:expenseId",
      this.controller.getSpenders.bind(this.controller)
    );
    router.get(
      "/invoice/:invoiceId/spender/:spenderId",
      this.controller.getEachUserExpenses.bind(this.controller)
    );
    router.get(
      "/group/:groupId",
      this.controller.getEachGroupExpenses.bind(this.controller)
    );
    router.post(
      "/invoice/:invoiceId",
      this.controller.createOneExpense.bind(this.controller)
    );
    router.get(
      "/user/:userId",
      this.controller.getUserTotalExpenses.bind(this.controller)
    );
    return router;
  }
}

module.exports = ExpensesRouter;

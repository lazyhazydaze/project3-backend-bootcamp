const express = require("express");
const router = express.Router();

class InvoicesRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // router.get("/", this.controller.getAll.bind(this.controller));
    // router.get("/:groupId", this.controller.getOneGroup.bind(this.controller));
    // router.post("/", this.controller.createOneGroup.bind(this.controller));
    router.get(
      "/group/:groupId",
      this.controller.getInvoices.bind(this.controller)
    );
    router.get(
      "/invoice/:invoiceId",
      this.controller.getOneInvoice.bind(this.controller)
    );
    router.post(
      "/group/:groupId",
      this.controller.createOneInvoice.bind(this.controller)
    );
    return router;
  }
}

module.exports = InvoicesRouter;

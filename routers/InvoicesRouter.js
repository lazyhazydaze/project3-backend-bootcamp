const express = require("express");
const router = express.Router();

class InvoicesRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get(
      "/group/:groupId",
      this.controller.getInvoices.bind(this.controller)
    );

    router.get(
      "/invoice/:invoiceId",
      this.controller.getOneInvoice.bind(this.controller)
    );

    router.put(
      "/invoice/:invoiceId",
      this.controller.editOneInvoice.bind(this.controller)
    );

    router.delete(
      "/:invoiceId",
      this.controller.deleteOneInvoice.bind(this.controller)
    );

    router.post(
      "/group/:groupId",
      this.controller.createOneInvoice.bind(this.controller)
    );
    return router;
  }
}

module.exports = InvoicesRouter;

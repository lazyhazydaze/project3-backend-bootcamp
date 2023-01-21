const express = require("express");
const router = express.Router();

class GroupsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get(
      "/user/:userId",
      this.controller.getGroups.bind(this.controller)
    );
    router.get("/:groupId", this.controller.getOneGroup.bind(this.controller));
    router.post("/", this.controller.createOneGroup.bind(this.controller));

    return router;
  }
}

module.exports = GroupsRouter;

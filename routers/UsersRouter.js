const express = require("express");
const router = express.Router();

class UsersRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll.bind(this.controller));
    //router.get("/:sightingId", this.controller.getOne.bind(this.controller));
    router.post("/", this.controller.createOrGetUser.bind(this.controller));
    router.get(
      "/:groupId",
      this.controller.getUsersOfGroup.bind(this.controller)
    );

    // router.get(
    //   "/:sightingId/comments",
    //   this.controller.getComments.bind(this.controller)
    // );
    // router.post(
    //   "/:sightingId/comments",
    //   this.controller.addComment.bind(this.controller)
    // );
    return router;
  }
}

module.exports = UsersRouter;

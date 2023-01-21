const express = require("express");
const router = express.Router();

class FriendsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // router.get("/", this.controller.getAll.bind(this.controller));
    // router.get("/:sightingId", this.controller.getOne.bind(this.controller));
    router.post("/", this.controller.createFriendRequest.bind(this.controller));
    router.get(
      "/user/:userId",
      this.controller.getFriendList.bind(this.controller)
    );
    router.get(
      "/requests-sent/sender/:senderId",
      this.controller.getAllRequestSent.bind(this.controller)
    );
    router.get(
      "/requests-received/recipient/:recipientId",
      this.controller.getAllRequestReceived.bind(this.controller)
    );
    router.post(
      "/requests-accept/table/:tableId",
      this.controller.acceptFriendRequest.bind(this.controller)
    );
    router.delete(
      "/requests-delete/table/:tableId",
      this.controller.rejectFriendRequest.bind(this.controller)
    );
    router.delete(
      "/friends-delete/table/:tableId",
      this.controller.deleteFriend.bind(this.controller)
    );
    // router.post(
    //   "/:sightingId/comments",
    //   this.controller.addComment.bind(this.controller)
    // );
    return router;
  }
}

module.exports = FriendsRouter;

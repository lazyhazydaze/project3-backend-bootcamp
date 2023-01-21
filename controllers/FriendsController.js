const { Op } = require("sequelize");

class FriendsController {
  constructor(friendRequestModel, friendListModel, userModel) {
    this.friendRequestModel = friendRequestModel;
    this.friendListModel = friendListModel;
    this.userModel = userModel;
  }

  // Create friend request
  // Two parameters required: sender and recipient
  // Create a router

  async createFriendRequest(req, res) {
    const { sender_id, recipient_email } = req.body;
    try {
      let output = await this.userModel.findAll({
        where: { email: recipient_email },
      });
      if (output.length == 1) {
        const recipient_id = output[0].id;

        if (recipient_id == sender_id) {
          // User cannot add himself (done)
          return res
            .status(400)
            .json({ error: true, msg: "Cannot send to yourself" });
        }

        // Recipient is already a friend in list
        output = await this.friendListModel.findAll({
          where: {
            [Op.or]: [
              { user1_id: sender_id, user2_id: recipient_id },
              { user1_id: recipient_id, user2_id: sender_id },
            ],
          },
        });

        if (output.length > 0) {
          return res.status(400).json({ error: true, msg: "Already friends" });
        }

        output = await this.friendRequestModel.findAll({
          where: { sender_id: recipient_id, recipient_id: sender_id },
        });
        // Receiver cannot send friend request to user who sent him and still pending (done).
        if (output.length > 0) {
          return res
            .status(400)
            .json({ error: true, msg: "Accept the pending request." });
        }

        output = await this.friendRequestModel.findAll({
          where: { sender_id: sender_id, recipient_id: recipient_id },
        });

        if (output.length > 0) {
          // User cannot resend pending request (done)
          return res
            .status(400)
            .json({ error: true, msg: "Sent before. Cannot send again." });
        } else {
          // Send friend request (done)
          const newRequest = await this.friendRequestModel.create({
            sender_id: sender_id,
            recipient_id: recipient_id,
          });
          return res.json(newRequest);
        }
      }
      // User does not exist in database (done)
      return res.status(400).json({ error: true, msg: "Invalid Email" });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Friend request from me
  // View friend requests sent by the user
  // One parameter required: sender_id
  // Create a router

  async getAllRequestSent(req, res) {
    const { senderId } = req.params;
    try {
      const sentRequests = await this.friendRequestModel.findAll({
        where: { sender_id: senderId },
        include: { model: this.userModel, as: "recipient" },
      });
      return res.json(sentRequests);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Friend request to
  // View friends received by the user
  // One parameter required: recipient_id
  // Create a router

  async getAllRequestReceived(req, res) {
    const { recipientId } = req.params;
    try {
      const receivedRequests = await this.friendRequestModel.findAll({
        where: { recipient_id: recipientId },
        include: { model: this.userModel, as: "sender" },
        // as: "sender" is taken from db > models > friendrequest > alias
        // if alias is not provided, it will take the foreign key which is sender_id
      });
      return res.json(receivedRequests);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Reject (recipient POV) or delete (sender POV) friend request
  async rejectFriendRequest(req, res) {
    const id = req.params.tableId;
    try {
      let output = await this.friendRequestModel.findByPk(id);
      if (output) {
        await output.destroy(); // deletes the row
      }
      return res.json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Accept friend request
  // Removes from friendrequest table
  // Adds to friendlist table
  async acceptFriendRequest(req, res) {
    const id = req.params.tableId;
    try {
      let output = await this.friendRequestModel.findByPk(id);
      if (output) {
        console.log("output: ", output);
        const { sender_id, recipient_id } = output;
        await output.destroy(); // deletes the row
        const newFriend = await this.friendListModel.create({
          user1_id: sender_id,
          user2_id: recipient_id,
        });
        return res.json(newFriend);
      }
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // 1 send to 2 (sender_id = 1, recipient_id = 2)
  // 2 send to 3 (sender_id = 2, recipient_id = 3)
  // 3 send to 4 (sender_id = 3, recipient_id = 4)
  // 4 send to 1 (sender_id = 4, recipient_id = 1)
  // if user = 3, getAllRequestSent --> recipient_id 4, getAllRequestReceived --> sender_id 2
  // if user 3 accepts sender_id 2 request, frontend will go query backend sender_id = 2 and recipient id = 3 and return the tableId = 8

  // Delete existing friend
  async deleteFriend(req, res) {
    const id = req.params.tableId;
    try {
      let output = await this.friendListModel.findByPk(id);
      if (output) {
        await output.destroy(); // deletes the row
      }
      return res.json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // View friendlist
  async getFriendList(req, res) {
    const id = req.params.userId;
    // const { userId } = req.params;
    try {
      const output = await this.friendListModel.findAll({
        where: { [Op.or]: [{ user1_id: id }, { user2_id: id }] },
        include: [
          { model: this.userModel, as: "user1" },
          { model: this.userModel, as: "user2" },
        ],
      });
      return res.json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

// How to get friendlist of the specific user alone? Use OR conditional [Op. or]
// Friendlist just need to create, read, and view? what if users change their username? Will it be reflected in friendlist?
// Reminder: create validation for addFriend (the various cases)

module.exports = FriendsController;

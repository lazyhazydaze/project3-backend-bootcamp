const BaseController = require("./BaseController");

class GroupsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  // retrieve all groups from a specific user
  async getGroups(req, res) {
    const { userId } = req.params;
    try {
      const groups = await this.userModel.findByPk(userId, {
        include: this.model,
      });
      return res.json(groups);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  //from bigfoot ex
  // retrieve all users of a specific group
  async getOneGroup(req, res) {
    const { groupId } = req.params;
    try {
      const group = await this.model.findByPk(groupId, {
        include: this.userModel,
      });
      return res.json(group);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  //from bigfoot ex
  async createOneGroup(req, res) {
    const { name, selectedUserIds } = req.body;
    try {
      const newGroup = await this.model.create({
        name: name,
      });
      // Retrieve selected users
      const selectedUsers = await this.userModel.findAll({
        where: {
          id: selectedUserIds,
        },
      });
      // Associated new group with selected users
      await newGroup.setUsers(selectedUsers);
      // Respond with new group
      return res.json(newGroup);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = GroupsController;

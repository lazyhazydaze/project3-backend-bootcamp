const BaseController = require("./BaseController");

class UsersController extends BaseController {
  constructor(model, groupModel) {
    super(model);
    this.groupModel = groupModel;
  }

  // Retrieve all users of a specific group
  async getUsersOfGroup(req, res) {
    const { groupId } = req.params;
    try {
      const users = await this.groupModel.findByPk(groupId, {
        include: [this.model],
      });
      return res.json(users);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async createOrGetUser(req, res) {
    try {
      const { email } = req.body;
      let output = await this.model.findAll({ where: { email: email } });
      if (output.length == 0) {
        const data = { ...req.body };
        output = await this.model.create(data);
      }
      return res.json(output[0]);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = UsersController;

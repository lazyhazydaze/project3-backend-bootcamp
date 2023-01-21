class InvoicesController {
  constructor(model, groupModel, userModel) {
    this.model = model;
    this.groupModel = groupModel;
    this.userModel = userModel;
  }

  // From bigfoot ex
  // Retrieve all invoices from a specific group
  async getInvoices(req, res) {
    const { groupId } = req.params;
    try {
      const invoices = await this.model.findAll({
        where: { invoice_group_id: groupId },
        include: { model: this.userModel, as: "author" },
      });
      return res.json(invoices);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve one invoice
  async getOneInvoice(req, res) {
    const { invoiceId } = req.params;
    try {
      const invoice = await this.model.findByPk(invoiceId, {
        include: [
          { model: this.userModel, as: "author" },
          { model: this.groupModel, as: "group" },
        ],
      });
      return res.json(invoice);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // From bigfoot ex
  // Add invoices on specific group
  async createOneInvoice(req, res) {
    const { groupId } = req.params;
    const { name, date, authorId } = req.body;
    // console.log("groupId: ", groupId);
    // console.log("name: ", name);
    // console.log("date: ", date);
    // console.log("authorId: ", authorId);
    try {
      const newInvoice = await this.model.create({
        name: name,
        date: date,
        author_id: authorId,
        invoice_group_id: groupId,
      });
      return res.json(newInvoice);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

// Do validation to make sure author is in the group.
// Reminder: to include Allow Null false for the fields
// Use group model to return group name

module.exports = InvoicesController;

class InvoicesController {
  constructor(model, groupModel, userModel, expenseModel, splitExpenseModel) {
    this.model = model;
    this.groupModel = groupModel;
    this.userModel = userModel;
    this.expenseModel = expenseModel;
    this.splitExpenseModel = splitExpenseModel;
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
  // Edit one invoice name and date
  async editOneInvoice(req, res) {
    const { invoiceId } = req.params;
    const { name, date } = req.body;
    try {
      let output = await this.model.findByPk(invoiceId);
      if (output) {
        await output.update({
          updated_at: new Date(),
          name: name,
          date: date,
        });
      }
      output = await this.model.findByPk(invoiceId);
      return res.json(output);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Delete one invoice
  // to delete selected invoice, 1. delete all split expenses related to invoice
  // 2. delete all expenses inside the invoice (is there a way to get the deleteAllExpenses function from ExpensesController? )
  // 3. delete the invoice itself
  async deleteOneInvoice(req, res) {
    const { invoiceId } = req.params;
    try {
      let expenses = await this.expenseModel.findAll({
        where: { invoice_id: invoiceId },
      });
      console.log("myconsolelog expenses.length is ", expenses.length);

      for (let i = 0; i < expenses.length; i++) {
        await this.splitExpenseModel.destroy({
          where: { expense_id: expenses[i].id },
        });
      }

      expenses = await this.expenseModel.destroy({
        where: { invoice_id: invoiceId },
      });

      let invoice = await this.model.findByPk(invoiceId);
      if (invoice) {
        await invoice.destroy();
      }

      return res.json(expenses);
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

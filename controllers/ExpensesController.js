const { sequelize } = require("../db/models");

class ExpensesController {
  constructor(model, userModel, splitExpenseModel, expenseModel) {
    this.model = model;
    this.userModel = userModel;
    this.splitExpenseModel = splitExpenseModel;
    this.expenseModel = expenseModel;
  }

  // Retrieve all expenses from a specific invoice
  async getExpenses(req, res) {
    const { invoiceId } = req.params;
    try {
      const expenses = await this.model.findAll({
        where: { invoice_id: invoiceId },
        include: [{ model: this.userModel, as: "payer" }],
      });
      return res.json(expenses);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve the spenders for a specific expense
  async getSpenders(req, res) {
    const { expenseId } = req.params;
    try {
      const spenders = await this.splitExpenseModel.findAll({
        where: { expense_id: expenseId },
        include: [{ model: this.userModel, as: "splitby" }],
      });
      return res.json(spenders);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  //Retrieve all expenses made by each spender(user) in specific invoice
  async getEachUserExpenses(req, res) {
    const { invoiceId, spenderId } = req.params;
    try {
      const allexpenses = await this.splitExpenseModel.findAll({
        where: { split_by_id: spenderId },
        include: [
          { model: this.userModel, as: "splitby" },
          {
            model: this.expenseModel,
            as: "expense",
            where: { invoice_id: invoiceId },
          },
        ],
      });
      return res.json(allexpenses);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Add expenses on specific invoice
  async createOneExpense(req, res) {
    const t = await sequelize.transaction();

    const { invoiceId } = req.params;
    const { name, amount, payerId, splitByIds } = req.body;
    const splitAmt = amount / splitByIds.length;
    try {
      const newExpense = await this.model.create(
        {
          name: name,
          amount: amount,
          payer_id: payerId,
          invoice_id: invoiceId,
        },
        { transaction: t }
      );

      const { id } = newExpense;

      //split-expense table: expense-id, split_by_id, paid_by_id, splitted amt
      // for-loop for splitbyId

      for (let i = 0; i < splitByIds.length; i++) {
        await this.splitExpenseModel.create(
          {
            expense_id: id,
            split_by_id: splitByIds[i],
            paid_by_id: payerId,
            amount: splitAmt,
          },
          { transaction: t }
        );
      }
      await t.commit();
      return res.json(newExpense);
    } catch (err) {
      await t.rollback();
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

// rounding off of decimal points.

module.exports = ExpensesController;

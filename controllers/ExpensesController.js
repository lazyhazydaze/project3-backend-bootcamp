const { Sequelize } = require("sequelize");
const { sequelize } = require("../db/models");

class ExpensesController {
  constructor(model, userModel, splitExpenseModel, groupModel, invoiceModel) {
    this.model = model;
    this.userModel = userModel;
    this.splitExpenseModel = splitExpenseModel;
    this.groupModel = groupModel;
    this.invoiceModel = invoiceModel;
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

  // Delete all expenses from a specific invoice
  // to delete selected expense, need to first delete inside split expense model then can delete in expense model
  // but now i have more than one expense id leh
  async deleteAllExpenses(req, res) {
    const { invoiceId } = req.params;
    try {
      let expenses = await this.model.findAll({
        where: { invoice_id: invoiceId },
      });

      for (let i = 0; i < expenses.length; i++) {
        await this.splitExpenseModel.destroy({
          where: { expense_id: expenses[i].id },
        });
      }

      // include transaction

      expenses = await this.model.destroy({
        where: { invoice_id: invoiceId },
      });

      return res.json(expenses);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Delete selected expense
  // to delete selected expense, need to first delete inside split expense model then can delete in expense model
  async deleteOne(req, res) {
    const { expenseId } = req.params;
    try {
      const records = await this.splitExpenseModel.destroy({
        where: { expense_id: expenseId },
      });

      let expense = await this.model.findByPk(expenseId);
      if (expense) {
        await expense.destroy();
      }
      expense = await this.model.findAll();

      return res.json(expense);
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
            model: this.model,
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

  async getEachGroupExpenses(req, res) {
    const { groupId } = req.params;
    try {
      const paidByAggregate = await this.splitExpenseModel.findAll({
        include: {
          model: this.model,
          attributes: [],
          include: {
            model: this.invoiceModel,
            attributes: [],
            include: {
              model: this.groupModel,
              as: "group",
              attributes: [],
              where: { id: groupId },
              required: true,
            },
            required: true,
          },
          required: true,
        },
        attributes: [
          "paid_by_id",
          [Sequelize.fn("sum", Sequelize.col("splitexpense.amount")), "total"],
        ],
        group: ["paid_by_id"],
      });
      const splitByAggregate = await this.splitExpenseModel.findAll({
        include: {
          model: this.model,
          attributes: [],
          include: {
            model: this.invoiceModel,
            attributes: [],
            include: {
              model: this.groupModel,
              as: "group",
              attributes: [],
              where: { id: groupId },
              required: true,
            },
            required: true,
          },
          required: true,
        },
        attributes: [
          "split_by_id",
          [Sequelize.fn("sum", Sequelize.col("splitexpense.amount")), "total"],
        ],
        group: ["split_by_id"],
      });

      const tally = {};

      paidByAggregate.forEach((object) => {
        tally[object.paid_by_id] = Number(object.dataValues.total);
      });

      splitByAggregate.forEach((object) => {
        if (object.split_by_id in tally) {
          tally[object.split_by_id] -= Number(object.dataValues.total);
        } else {
          tally[object.split_by_id] = -Number(object.dataValues.total);
        }
      });

      return res.json(tally);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // get the total expenses of each user from all the groups
  async getUserTotalExpenses(req, res) {
    const { userId } = req.params;
    try {
      const toGet = await this.splitExpenseModel.findAll({
        where: { paid_by_id: userId },
        attributes: [
          "paid_by_id",
          [Sequelize.fn("sum", Sequelize.col("splitexpense.amount")), "total"],
        ],
        group: ["paid_by_id"],
      });

      const toPay = await this.splitExpenseModel.findAll({
        where: { split_by_id: userId },
        attributes: [
          "split_by_id",
          [Sequelize.fn("sum", Sequelize.col("splitexpense.amount")), "total"],
        ],
        group: ["split_by_id"],
      });

      console.log(toGet);

      let netBalance = Number(0);

      if (toGet.length == 1) {
        netBalance += Number(toGet[0].dataValues.total);
      }
      if (toPay.length == 1) {
        netBalance -= Number(toPay[0].dataValues.total);
      }

      return res.json(netBalance);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Add expenses on specific invoice
  async createOneExpense(req, res) {
    const t = await sequelize.transaction();

    const { invoiceId } = req.params;
    const { name, amount, payerId, splitByIds } = req.body;
    const splitAmt = Number(amount / splitByIds.length).toFixed(2);
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

      for (let i = 0; i < splitByIds.length - 1; i++) {
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

      const lastPersonAmt = amount - splitAmt * (splitByIds.length - 1);

      await this.splitExpenseModel.create(
        {
          expense_id: id,
          split_by_id: splitByIds[splitByIds.length - 1],
          paid_by_id: payerId,
          amount: lastPersonAmt,
        },
        { transaction: t }
      );

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

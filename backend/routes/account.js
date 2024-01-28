const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const zod = require("zod");
const { User, Account, History } = require("../db");
const accountRouter = express.Router();
const Pay = require("../payment");

accountRouter.use(express.json());

const payeeSchema = zod.object({
  to: zod.string().email(),
  amount: zod.number(),
});

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account)
      return res.status(404).json({ message: "No such account exist" });
    return res.status(201).json({ balance: account.balance });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const payee = req.body;
    const { success } = payeeSchema.safeParse(payee);
    if (!success) res.status(411).json({ message: "Invalid Inputs" });

    const receiver = await User.findOne({ username: payee.to });
    const sender = await User.findOne({ _id: req.userId });
    if (!receiver) return res.status(404).json({ message: "Payee not found" });
    if (!sender) return res.status(404).json({ message: "Payer not found" });

    const payerAccount = await Account.findOne({ userId: req.userId });
    const payeeAccount = await Account.findOne({ userId: receiver._id });

    try {
      const output = await Pay(
        sender,
        payerAccount,
        receiver,
        payeeAccount,
        payee.amount
      );
      return res
        .status(201)
        .json({ message: "Transaction completed successfully" });
    } catch (e) {
      return res.status(201).json({ message: e.message });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

accountRouter.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const transactions = await History.find({ userId: userId });
    let transaction_dto = [];
    transactions.forEach((transaction) => {
      transaction_dto.push({
        id: transaction._id,
        payee: transaction.payee,
        amount: transaction.amount,
      });
    });

    res.status(201).json({ transactions: transaction_dto });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { accountRouter };

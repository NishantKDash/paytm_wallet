const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const zod = require("zod");
const { User, Account, History } = require("../db");
const accountRouter = express.Router();
const Pay = require("../payment");

accountRouter.use(express.json());

const payeeSchema = zod.object({
  to: zod.string(),
  amount: zod.number(),
});

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account)
      return res.status(404).json({ message: "No such account exist" });
    return res.status(201).json({ balance: account.balance.toFixed(2) });
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
    let output = await Pay(req.userId, payee.to, payee.amount);
    return res.status(201).json({ message: output });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

accountRouter.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    const transactions = await History.find({
      $or: [
        {
          payerName: {
            $regex: user.username,
          },
        },
        {
          payeeName: {
            $regex: user.username,
          },
        },
      ],
    });
    let transaction_dto = [];
    transactions.forEach((transaction) => {
      transaction_dto.push({
        id: transaction._id,
        payee: transaction.payeeName,
        payer: transaction.payerName,
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

const mongoose = require("mongoose");
const { Account, History, db, client } = require("./db");

async function Pay(sender, senderAccount, receiver, receiverAccount, amount) {
  const session = await mongoose.startSession();
  mongoose.session = session;

  try {
    await session.withTransaction(async () => {
      const senderBalance = senderAccount.balance;
      const receiverBalance = receiverAccount.balance;
      if (senderBalance < amount) {
        throw new Error("Insufficient Balance");
      }
      senderAccount.balance = senderBalance - amount;
      receiverAccount.balance = receiverBalance + amount;
      await senderAccount.save();
      await receiverAccount.save();

      await History.create({
        userId: senderAccount.userId,
        payer: sender.username,
        payee: receiver.username,
        amount: amount,
        type: "Debit",
      });
      await History.create({
        userId: receiverAccount.userId,
        payer: sender.username,
        payee: receiver.username,
        amount: amount,
        type: "Credit",
      });
    });
  } finally {
    session.endSession();
  }
}

module.exports = Pay;

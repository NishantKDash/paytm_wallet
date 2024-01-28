const mongoose = require("mongoose");
const { Account, History, User } = require("./db");

async function Pay(from, to, amount) {
  const session = await mongoose.startSession();
  mongoose.session = session;

  session.startTransaction();

  const payerAccount = await Account.findOne({ userId: from }).session(session);
  const payeeAccount = await Account.findOne({ userId: to }).session(session);

  if (!payerAccount || payerAccount.balance < amount || !payeeAccount) {
    await session.abortTransaction();
    return "Insufficient balance";
  }
  await Account.updateOne(
    { userId: from },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);
  await updateHistory(from, to, amount);
  await session.commitTransaction();
  return "Transaction successful";
}

async function updateHistory(from, to, amount) {
  const sender = await User.findOne({ _id: from });
  const receiver = await User.findOne({ _id: to });
  await History.create({
    payee: to,
    payer: from,
    payeeName: receiver.username,
    payerName: sender.username,
    amount: amount,
  });
}

module.exports = Pay;

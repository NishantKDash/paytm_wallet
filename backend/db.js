const mongoose = require("mongoose");
const { dbURL } = require("./config");
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const accountsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const transactionSchema = new mongoose.Schema({
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  payeeName: {
    type: String,
    required: true,
  },
  payerName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountsSchema);
const History = mongoose.model("History", transactionSchema);

module.exports = { User, Account, History };

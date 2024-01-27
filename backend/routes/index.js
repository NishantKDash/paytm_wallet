const express = require("express");
import userRouter from "./user";

const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.get((req, res) => {
  res.json({ message: "This is the root route" });
});

module.exports(rootRouter);

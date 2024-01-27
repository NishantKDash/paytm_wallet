const express = require("express");

const userRouter = express.Router();

// Define a route using the router
userRouter.get("/about", (req, res) => {
  res.json({ message: "This is the route for user" });
});

module.exports(userRouter);

const express = require("express");
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../db");

const userRouter = express.Router();
userRouter.use(express.json());

const signUpSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
  firstName: zod.string().max(50),
  lastName: zod.string().max(50),
});

userRouter.get("/about", (req, res) => {
  res.json({ message: "This is the route for user" });
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { success } = signUpSchema.safeParse(req.body);
    if (!success) return res.status(411).json({ message: "Invalid Input" });
    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser)
      return res.status(411).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const createdUser = User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const userId = createdUser._id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    return res
      .status(201)
      .json({ message: `User created with username ${req.body.username}` });
  } catch (e) {
    console.log(e);
  }
});

module.exports = userRouter;

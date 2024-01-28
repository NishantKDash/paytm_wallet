const express = require("express");
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../db");
const { authMiddleware } = require("../middlewares/authMiddleware");

const userRouter = express.Router();
userRouter.use(express.json());

const signUpSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
  firstName: zod.string().max(50),
  lastName: zod.string().max(50),
});

const updateSchema = zod.object({
  password: zod.string().min(6).optional(),
  firstName: zod.string().max(50).optional(),
  lastName: zod.string().max(50).optional(),
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

    return res.status(201).json({
      message: `User created with username ${req.body.username}`,
      token: token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({
      username: username,
    });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: "Wrong Username / Password" });
    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET);
    return res.status(201).json({ token: token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.put("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { success } = updateSchema.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Error while updating information",
      });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User does not exist" });
    const changes = req.body;
    if (changes.password) {
      const hashedPassword = await bcrypt.hash(changes.password, 10);
      user.password = hashedPassword;
    }
    if (changes.firstName) {
      user.firstName = changes.firstName;
    }
    if (changes.lastName) {
      user.lastName = changes.lastName;
    }
    user.save();
    return res
      .status(201)
      .json({ message: "User has been modified successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    let users_dto = [];
    users.forEach((user) => {
      users_dto.push({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    });
    return res.status(201).json({ users: users_dto });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = userRouter;

const express = require("express");
const rootRouter = require("./routes/index");
const cors = require("cors");

const port = 3000;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, HTTP authentication)
  })
);
app.use("/api/v1", rootRouter);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

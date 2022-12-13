const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8000;
const dbConnect = require("./config/dbConnect");
const authRouter = require("./routes/authRoute");

dbConnect();

app.use(express.json());

app.use("/api/user", authRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

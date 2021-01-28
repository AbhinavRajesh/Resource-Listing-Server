const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");

const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");

const PORT = process.env.PORT || 5000;
require("dotenv").config();

require("./config/passport")(passport);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.PASSWORD_HASH,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => console.log("MongoDB Connection Succesfull!")
);

app.get("/", (req, res) => {
  return res.status(200).send({
    message: "API Working",
  });
});

app.use("/auth", authRouter);
app.use("/api/v1", apiRouter);

app.listen(PORT, () =>
  console.log(`Server Running at http://localhost:${PORT}`)
);

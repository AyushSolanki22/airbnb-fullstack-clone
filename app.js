require("dotenv").config();

const path = require("path");
const rootDir = require("./utils/path");

const multer=require("multer")

const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);


const DB_PATH =process.env.MONGODB_URI;

const storeRouter = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const bookingRouter =
  require("./routes/bookingRouter");
const authRouter = require("./routes/authRouter");

const errorController = require("./controllers/error");

const { default: mongoose } = require("mongoose");

const app = express();
app.set("view engine", "ejs");


const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});


app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads",express.static(path.join(rootDir, "uploads")))
app.use(express.urlencoded({ extended: true }));

//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// //cookie parser middleware
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

app.use(authRouter);
app.use(storeRouter);
app.use(bookingRouter);

app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
});
app.use("/host", hostRouter);

app.use(errorController.error);


// Error-handling middleware ---- At Last 
app.use((err, req, res, next) => {
  console.error("=================================");
  console.error("ERROR:", err);
  console.error("MESSAGE:", err.message);
  console.error("STACK:", err.stack);
  console.error("=================================");

  res.status(500).send("Something went wrong.");
});


const PORT=process.env.PORT;

mongoose
  .connect(DB_PATH)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to Mongo: ", err);
  });

// check for production environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

// require index route
const indexRouter = require("./routes/index");

// configure app
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

// connect to db
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL),
  {
    //useNewUrlParser: true,
  };
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to db"));

// tell app to use index route
app.use("/", indexRouter);

app.listen(process.env.PORT || 3000);

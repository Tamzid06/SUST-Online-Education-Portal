const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middleware/authMiddleware");

const app = express();
app.use(express.urlencoded({ extended: true }));
// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://fahim:fahim@authentication.424jh.mongodb.net/Virtual_classroom?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("/", (req, res) => res.render("index"));
app.get("/courses", requireAuth, (req, res) => res.render("courses"));
app.get("/home", requireAuth, (req, res) => res.render("home"));
app.get("/playlist", requireAuth, (req, res) => res.render("playlist"));
// app.get("/index", requireAuth, (req, res) => res.render("index"));
// app.get("/signup", requireAuth, (req, res) => res.render("signup"));
// app.get('/home', (req, res) => res.render('main_home'));
app.use(authRoutes);

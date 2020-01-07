const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(
  session({
    secret: "passport-authentication",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, callback) => {
  console.log("serializando");
  callback(null, user);
});

passport.deserializeUser(async (id, callback) => {
  console.log("DESserializando");

  try {
    const user = await user.findById(id);
    if (!user) return callback({ message: "el usuario no existe" });
    return callback(null, user);
  } catch (e) {
    console.log(e);
    callback(e);
  }
});

passport.use(
  new localStrategy(async (username, password, next) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return next(null, false, { message: "usuario no existe" });

      if (!bcrypt.compareSync(password, user.password))
        return next(null, false, { message: "contraseña no valida" });

      next(null, user);
    } catch (err) {
      console.log(err);
      next(err);
    }
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
/* app.use(express.json());
app.use(express.urlencoded({ extended: false })); */
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect("mongodb://localhost:27017/passport-login")
  .then(() => console.log("BBDD en el puerto 27017"));
//ojo falta catch
module.exports = app;

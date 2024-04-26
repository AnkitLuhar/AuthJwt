//making the server using express js::
const express = require("express");

const app = express();

const db = require("./Db");
const { error } = require("console");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
//authetication:using session and cookies method::
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await Person.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const isPasswordMatch = user.password == password ? true : false;
      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

app.use(passport.initialize());
app.get("/", passport.authenticate("local", { session: false }), (req, res) => {
  res.send("working");
});

//middleware::
const logRequest = (req, res, next) => {
  console.log(
    `${new Date().toLocaleString()} Request Mode to : ${req.originalUrl} `
  );
  next();
};
app.use(logRequest);
const personRoutes = require("./routes/personRoutes");
const Person = require("./module/person");
//use the routers:
app.use("/person", personRoutes);
app.listen(3000, () => {
  console.log("server is listening");
});

//basics fundamentals:
// const note = require("./notes");
// let _ = require("lodash");
// console.log("server file is created");
// console.log(note.age);
// console.log(note.addNumber(18, 10));
// let arr = [1, 2, 4, 1, 2, "first", "first"];
// console.log(_.uniq(arr));

// app.get("/", function (req, res) {
//   res.send("hello world");
// });
// app.get("/chicken", function (req, res) {
//   res.send("i love to have a chicken");
// });
// app.get("/idli", function (req, res) {
//   res.send("South Indian food Is yUmmm");
// });
//extract personRoutes:

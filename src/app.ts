import Express from "express";
import cors from "cors";
import apiRouter from "./routes";
import config from "./config";
import flash from "connect-flash";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import bcrypt from "bcrypt";
import client_sessions from "client-sessions";

import { schema } from "./routes/User/schema";
import { UserModel } from "./models/user.model";

export const app = Express();

mongoose.connect("mongodb://127.0.0.1:27017/excel");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  client_sessions({
    cookieName: "session",
    secret: config.COOKIE_SECRET!,
    duration: 3 * 60 * 60 * 1000, // 3 hours
  })
);

app.use(flash());
app.use(Express.json());

app.use(Express.static(path.join(__dirname, "../src/assets/static")));
app.use(Express.static(path.join(__dirname, "../src/assets/public")));

app.set("views", path.join(__dirname, "../src/assets/pages/"));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  UserModel.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ error: "Email/password incorrect" });
    }

    req.session.userId = user._id;
    return res.status(200).json({ status: "ok" });
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) return res.status(500).json({ data: error.details[0].message });

  const hashedPassword = bcrypt.hashSync(req.body.password, 14);
  req.body.password = hashedPassword;

  const user = new UserModel(req.body);
  user.save((err: any) => {
    if (err) {
      let errorToReturn = "Something went wrong. Please try again.";

      if (err.code === 11000) {
        errorToReturn = "That email is already taken, please try another";
      }

      return res.status(409).json({ error: errorToReturn });
    }
    return res.json({ status: "ok" });
  });
});

app.get("/dashboard", (req, res, next) => {
  if (req.session === undefined || req.session.userId === undefined) {
    return res.redirect("/");
  }

  UserModel.findById(req.session.userId, (err, user) => {
    if (err) return next(err);

    if (!user) return res.redirect("/");

    res.render("dashboard");
  });
});

app.get("/book", (req, res) => {
  res.render("book");
});

export default app;

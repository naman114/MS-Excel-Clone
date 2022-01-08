import Express from "express";
import cors from "cors";
import apiRouter from "./routes";
import config from "./config";
import flash from "connect-flash";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";

export const app = Express();

mongoose.connect("mongodb://127.0.0.1:27017/excel");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
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
  res.json(req.body);
});

app.get("/register", (req, res) => {
  res.render("register");
});

import { schema } from "./routes/User/schema";
import { UserModel } from "./models/user.model";

app.post("/register", (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) return res.status(500).json({ data: error.details[0].message });

  const user = new UserModel(req.body);
  user.save((err: any) => {
    if (err) {
      let errorToReturn = "Something went wrong. Please try again.";

      if (err.code === 11000) {
        errorToReturn = "That email is already taken, please try another";
      }

      return res.status(409).json({ error: errorToReturn });
    }
  });
  res.redirect("/");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/book", (req, res) => {
  res.render("book");
});

export default app;

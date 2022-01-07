import Express from "express";
import cors from "cors";
import apiRouter from "./routes";
import config from "./config";
import flash from "connect-flash";
import mongoose from "mongoose";
import path from "path";

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

app.set("view engine", "pug");
app.use(Express.static(path.join(__dirname, "../src/assets/static")));
app.use(Express.static(path.join(__dirname, "../src/assets/public")));

app.set("views", path.join(__dirname, "../src/assets/pages/"));

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/book", (req, res) => {
  res.render("book");
});

export default app;

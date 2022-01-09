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
import helmet from "helmet";
import { Types } from "mongoose";

import { schema } from "./routes/User/schema";
import { UserModel } from "./models/user.model";
import { BookModel } from "./models/book.model";

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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
        ],
        // connectSrc: ["'self'", "https://some-domain.com", "https://some.other.domain.com"],
        // styleSrc: ["'self'", "fonts.googleapis.com", "'unsafe-inline'"],
        // fontSrc: ["'self'", "fonts.gstatic.com"],
        // imgSrc: ["'self'", "https://maps.gstatic.com", "https://maps.googleapis.com", "data:", "https://another-domain.com"],
        // frameSrc: ["'self'", "https://www.google.com"]
      },
    },
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

app.use((req, res, next) => {
  if (req.session === undefined || req.session.userId === undefined) {
    return next();
  }

  UserModel.findById(req.session.userId, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next();
    }

    user.password = undefined;

    req.user = user;
    res.locals.user = user;

    next();
  });
});

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.redirect("/");
  }
  next();
}

app.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  } else res.render("login");
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

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/user", (req, res) => {
  res.json({ user: req.user });
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

app.get("/dashboard", loginRequired, (req, res, next) => {
  console.log(req.user);
  res.render("dashboard");
});

app.get("/api/book/:uid", (req, res) => {
  const userId = req.params.uid;

  if (req.user._id != userId) {
    res.status(401).json({ err: "Unauthorized" });
  } else {
    BookModel.find({ user: new Types.ObjectId(userId) }, (err, books) => {
      res.json({ data: books });
    });
  }
});

app.get("/book/:bid", (req, res) => {
  const bookId = req.params.bid;

  BookModel.findOne({ _id: bookId }, (err, book) => {
    if (err || book.length === 0) {
      res.send("<h1>ERR 404: Not found</h1>");
    } else {
      if (!book.user.equals(req.user._id)) {
        res.send("<h1>ERR 401: Unauthorized</h1>");
      } else {
        res.render("book");
      }
    }
  });
});

app.get("/api/book/data/:bid", (req, res) => {
  const bookId = req.params.bid;

  BookModel.findOne({ _id: bookId }, (err, book) => {
    if (err || book.length === 0) {
      res.status(404).json({ error: "404: Not found" });
    } else {
      if (!book.user.equals(req.user._id)) {
        res.status(401).json({ error: "401: Unauthorized" });
      } else {
        res.json({
          bookName: book.bookName,
          bookData: book.bookData,
          selectedSheet: book.selectedSheet,
          totalSheets: book.totalSheets,
          lastAddedSheet: book.lastAddedSheet,
        });
      }
    }
  });
});

app.post("/api/book/data/:bid", (req, res) => {
  const bookId = req.params.bid;

  BookModel.findOneAndUpdate(
    { _id: bookId },
    {
      bookName: req.body.bookName,
      bookData: req.body.cellData,
      selectedSheet: req.body.selectedSheet,
      totalSheets: req.body.totalSheets,
      lastAddedSheet: req.body.lastAddedSheet,
    },
    (err, book) => {
      if (err || book.length === 0) {
        res.status(404).json({ error: "404: Not found" });
      } else {
        if (!book.user.equals(req.user._id)) {
          res.status(401).json({ error: "401: Unauthorized" });
        } else {
          res.json({
            bookName: book.bookName,
            bookData: book.bookData,
            selectedSheet: book.selectedSheet,
            totalSheets: book.totalSheets,
            lastAddedSheet: book.lastAddedSheet,
          });
        }
      }
    }
  );
});

app.get("*", (req, res) => {
  res.send("<h1>404: Not Found</h1>");
});

export default app;

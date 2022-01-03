import Express from "express";
import cors from "cors";
import apiRouter from "./routes";
import config from "./config";
import passport from "passport";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import flash from "connect-flash";

export const app = Express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: [config.COOKIE_SESSION_KEY],
    maxAge: 24 * 60 * 60 * 1000 * 60, // 60 days
  })
);

app.use(flash());
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
app.use(Express.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send(
    'Hello there, see the documentation here: <a href="" target="__blank">Link</a>'
  );
});

export default app;

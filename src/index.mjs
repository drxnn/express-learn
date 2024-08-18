import express from "express";

import { loggingMiddleware } from "./utils/middleware.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

import routes from "./routes/index.mjs";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "drin",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(loggingMiddleware);
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  req.session.visited = true;
  res.cookie("value", "something", { maxAge: 60000 * 60 });
  res.status(201).send({ msg: "hello" });
});

app.listen(PORT, () => {
  console.log(` runnning on ${PORT}`);
});

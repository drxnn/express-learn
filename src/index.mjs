import express from "express";

import { loggingMiddleware } from "./utils/middleware.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";

import routes from "./routes/index.mjs";
import { mockUsers } from "./utils/constants.mjs";
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

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const findUser = mockUsers.find((u) => u.username === username);
  if (!findUser || findUser.password !== password)
    return res.status(401).send({ error: "unauthenticated" });
  // attach the found user to the session object
  req.session.user = findUser;
  return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
    console.log(req.sessionStore);
    console.log(req.session.cart);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ error: "not authenticated" });
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  //renaming to cartItem
  const { body: cartItem } = req;
  const { cart } = req.session;

  if (cart) {
    cart.push(cartItem);
  } else {
    req.session.cart = [cartItem];
  }
  return res.status(201).send(cartItem);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  res.send(req.session.cart ?? []);
});

app.listen(PORT, () => {
  console.log(` runnning on ${PORT}`);
});

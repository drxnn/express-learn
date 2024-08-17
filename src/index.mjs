import express from "express";

import usersRouter from "./routes/users.mjs";

import { loggingMiddleware } from "./utils/middleware.mjs";

const app = express();
app.use(express.json());
app.use(loggingMiddleware);
app.use(usersRouter);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(201).send({ msg: "hello" });
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 123, name: "product", price: 12 }]);
});

app.listen(PORT, () => {
  console.log(` runnning on ${PORT}`);
});

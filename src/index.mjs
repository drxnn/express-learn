import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";

import { validateNewCreatedUser } from "./utils/validationSchemas.mjs";

const app = express();
app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const userIndex = mockUsers.findIndex((u) => u.id === parsedId);
  console.log(userIndex);
  if (userIndex === -1) return res.sendStatus(404);
  req.userIndex = userIndex;
  next();
};

app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "jack", name: "Jack" },
  { id: 2, username: "patrick", name: "Patrick" },
  { id: 3, username: "enzo", name: "Enzo" },
  { id: 4, username: "henry", name: "Henry" },
];

app.get("/", (req, res) => {
  res.status(201).send({ msg: "hello" });
});

app.get(
  "/api/users",
  query("filter")
    .isString()
    .isLength({ min: 2, max: 10 })
    .withMessage("Length must be 2-10 characters")
    .notEmpty()
    .withMessage("must not be empty"),
  (req, res) => {
    console.log(req.query);
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;

    if (filter && value)
      return res.send(mockUsers.filter((u) => u[filter].includes(value)));

    return res.send(mockUsers);
  }
);

app.post("/api/users", checkSchema(validateNewCreatedUser), (req, res) => {
  const result = validationResult(req);
  console.log(result);
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  const {
    body: { username, name },
  } = req;

  const validatedData = matchedData(req);

  console.log("data has been matched:", validatedData);

  if (username && name) {
    const userToAdd = {
      id: mockUsers.length + 1,
      ...validatedData,
    };
    mockUsers.push(userToAdd);
    return res.status(201).send(userToAdd);
  }
  console.log(mockUsers);
});

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;

  const findUser = mockUsers[userIndex];
  if (!findUser) return res.status(404).send("user doesnt exist");
  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 123, name: "product", price: 12 }]);
});

//
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
  console.log(mockUsers[userIndex]);
  return res.sendStatus(204);
});

//PATCH
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
  return res.sendStatus(200);
});

//DELETE
app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;

  mockUsers.splice(userIndex, 1);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(` runnning on ${PORT}`);
});

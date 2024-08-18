import { Router } from "express";

import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { validateNewCreatedUser } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middleware.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .isLength({ min: 2, max: 10 })
    .withMessage("Length must be 2-10 characters")
    .notEmpty()
    .withMessage("must not be empty"),
  (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });

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

router.post("/api/users", checkSchema(validateNewCreatedUser), (req, res) => {
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

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;

  const findUser = mockUsers[userIndex];
  if (!findUser) return res.status(404).send("user doesnt exist");
  return res.send(findUser);
});

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
  console.log(mockUsers[userIndex]);
  return res.sendStatus(204);
});

//PATCH
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
  return res.sendStatus(200);
});

//DELETE
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;

  mockUsers.splice(userIndex, 1);
  return res.sendStatus(200);
});
export default router;

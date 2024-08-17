import { mockUsers } from "./constants.mjs";

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

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

export { resolveIndexByUserId, loggingMiddleware };

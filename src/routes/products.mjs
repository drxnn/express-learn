import { Router } from "express";
const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.cookies);
  if (req.cookies.value && req.cookies.value === "something") {
    res.send([{ id: 123, name: "product", price: 12 }]);
  } else {
    res.status(403).send({ msg: "You need the correct cookie" });
  }
});

export default router;

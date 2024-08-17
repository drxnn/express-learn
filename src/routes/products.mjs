import { Router } from "express";
const router = Router();

router.get("/api/products", (req, res) => {
  res.send([{ id: 123, name: "product", price: 12 }]);
});

export default router;

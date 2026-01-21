import { Router, Request, Response } from "express";

const router = Router();

router.post("/submit", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const record = {
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: record,
  });
});

export default router;

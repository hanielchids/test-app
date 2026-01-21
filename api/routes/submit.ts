import { Router, Request, Response } from "express";

const router = Router();

const records: Array<{
  name: string;
  email: string;
  source: string;
  createdAt: string;
  score: number | null;
  category: string | null;
}> = [];

async function enrichData(name: string): Promise<{ score: number | null; category: string | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`https://mock-api.local/enrich?name=${encodeURIComponent(name)}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer test-token",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok || response.status === 500) {
      return { score: null, category: null };
    }

    const data:any = await response.json();
    return {
      score: data.score ?? null,
      category: data.category ?? null,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return { score: null, category: null };
  }
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post("/submit", async (req: Request, res: Response) => {
  try {
    const { name, email, source } = req.body;

    if (!name || !email || !source) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSource = source.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSource) {
      return res.status(400).json({ error: "Fields cannot be empty" });
    }

    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const enrichment = await enrichData(trimmedName);

    const record = {
      name: trimmedName,
      email: trimmedEmail,
      source: trimmedSource,
      createdAt: new Date().toISOString(),
      score: enrichment.score,
      category: enrichment.category,
    };

    records.push(record);

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

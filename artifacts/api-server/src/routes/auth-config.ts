import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/auth/config", (_req, res) => {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    res.status(503).json({
      error: "Supabase is not configured",
      debug: {
        urlPresent: Boolean(url),
        anonKeyPresent: Boolean(anonKey),
      },
    });
    return;
  }
  res.setHeader("cache-control", "public, max-age=300");
  res.json({ url, anonKey });
});

export default router;

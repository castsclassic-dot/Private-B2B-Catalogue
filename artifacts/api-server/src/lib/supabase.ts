import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { Request } from "express";

type AuthedRequest = Request & {
  user?: User;
  supabase?: SupabaseClient;
};

function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be configured.");
  }
  return { url, key };
}

export function clientForRequest(req: Request) {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  const { url, key } = getConfig();
  return createClient(url, key, {
    global: token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined,
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function requireUser(
  req: AuthedRequest,
  res: { status: (code: number) => { json: (body: unknown) => void } },
  next: () => void,
) {
  try {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const supabase = clientForRequest(req);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    req.user = data.user;
    req.supabase = supabase;
    next();
  } catch {
    res.status(401).json({ error: "Authentication required" });
  }
}

export async function requireAdmin(
  req: AuthedRequest,
  res: { status: (code: number) => { json: (body: unknown) => void } },
  next: () => void,
) {
  await requireUser(req, res, async () => {
    const { data, error } = await req.supabase!
      .from("profiles")
      .select("role")
      .eq("id", req.user!.id)
      .maybeSingle();
    if (error || data?.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
}

export type { AuthedRequest };
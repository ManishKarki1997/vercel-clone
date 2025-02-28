import type { SupabaseJWTUser } from "../../types/supabase.type";

declare global {
  namespace Express {
    interface Request {
      user?: SupabaseJWTUser;
    }
  }
}

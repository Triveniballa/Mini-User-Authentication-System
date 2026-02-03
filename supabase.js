import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config(); // 🔥 load env HERE (critical)

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env variables are missing");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
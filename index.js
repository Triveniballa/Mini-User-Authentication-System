import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { supabase } from "./supabase.js";

dotenv.config(); // load .env variables FIRST

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/* =========================
   TEST ROUTE (optional)
========================= */
app.get("/", (req, res) => {
  res.send("Mini User Authentication API is running");
});

/* =========================
   SIGNUP API
   POST /signup
========================= */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, age, location, password } = req.body;

    // 1. Validate input
    if (!name || !email || !age || !location || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2. Check duplicate email
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user
    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        email,
        age,
        location,
        password: hashedPassword
      }
    ]);

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    // 5. Success response
    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   USER PROFILE API
   GET /myprofile?name=
========================= */
app.get("/myprofile", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, age, location")
      .eq("name", name)
      .single();

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
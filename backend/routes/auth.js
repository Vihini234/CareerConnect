import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "student" } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must contain at least 8 characters." });
    }
    if (!["student", "company"].includes(role)) {
      return res.status(400).json({ message: "Choose a valid account type." });
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)",
      [name.trim(), email.toLowerCase().trim(), hash, role]
    );
    if (role === "student") {
      await pool.execute("INSERT INTO profiles (user_id, skills) VALUES (?, JSON_ARRAY())", [result.insertId]);
    }
    const token = jwt.sign(
      { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim(), role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.status(201).json({ token, user: { id: result.insertId, name, email, role } });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "An account with this email already exists." });
    console.error(error);
    res.status(500).json({ message: "Could not create account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [(email || "").toLowerCase().trim()]);
    if (!rows.length || !(await bcrypt.compare(password || "", rows[0].password_hash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not log in." });
  }
});

export default router;

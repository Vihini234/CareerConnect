import { Router } from "express";
import pool from "../config/db.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth("student"), async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT u.name,u.email,p.phone,p.location,p.university,p.degree,p.graduation_year,
      p.career_interest,p.summary,p.skills,p.github_url,p.portfolio_url
     FROM users u LEFT JOIN profiles p ON p.user_id=u.id WHERE u.id=?`,
    [req.user.id]
  );
  const profile = rows[0] || {};
  try { profile.skills = typeof profile.skills === "string" ? JSON.parse(profile.skills) : (profile.skills || []); }
  catch { profile.skills = []; }
  res.json(profile);
});

router.put("/", auth("student"), async (req, res) => {
  try {
    const p = req.body;
    await pool.execute(
      `UPDATE users SET name=? WHERE id=?`,
      [p.name || req.user.name, req.user.id]
    );
    await pool.execute(
      `INSERT INTO profiles
       (user_id,phone,location,university,degree,graduation_year,career_interest,summary,skills,github_url,portfolio_url)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE phone=VALUES(phone),location=VALUES(location),university=VALUES(university),
       degree=VALUES(degree),graduation_year=VALUES(graduation_year),career_interest=VALUES(career_interest),
       summary=VALUES(summary),skills=VALUES(skills),github_url=VALUES(github_url),portfolio_url=VALUES(portfolio_url)`,
      [req.user.id,p.phone||"",p.location||"",p.university||"",p.degree||"",p.graduationYear||"",
       p.careerInterest||"",p.summary||"",JSON.stringify(p.skills||[]),p.github||"",p.portfolio||""]
    );
    res.json({ message: "Profile updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update profile." });
  }
});

export default router;

import { Router } from "express";
import pool from "../config/db.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search = "", category = "", location = "", workType = "" } = req.query;
    const conditions = [];
    const values = [];
    if (search) {
      conditions.push("(j.title LIKE ? OR j.company_name LIKE ? OR j.description LIKE ?)");
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category && category !== "All Categories") {
      conditions.push("j.category = ?");
      values.push(category);
    }
    if (location && location !== "All Locations") {
      conditions.push("j.location LIKE ?");
      values.push(`%${location}%`);
    }
    if (workType && workType !== "All Work Types") {
      conditions.push("j.work_type = ?");
      values.push(workType);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const [rows] = await pool.execute(
      `SELECT j.*, u.name AS employer_name FROM jobs j JOIN users u ON u.id=j.company_id ${where} ORDER BY j.created_at DESC`,
      values
    );
    res.json(rows.map(row => ({ ...row, skills: parseJson(row.skills) })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load opportunities." });
  }
});

router.get("/saved", auth("student"), async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT j.* FROM saved_jobs s JOIN jobs j ON j.id=s.job_id
     WHERE s.user_id=? ORDER BY s.created_at DESC`,
    [req.user.id]
  );
  res.json(rows.map(row => ({ ...row, skills: parseJson(row.skills) })));
});

router.post("/:id/save", auth("student"), async (req, res) => {
  try {
    await pool.execute("INSERT IGNORE INTO saved_jobs (user_id,job_id) VALUES (?,?)", [req.user.id, req.params.id]);
    res.json({ message: "Opportunity saved." });
  } catch (error) {
    res.status(500).json({ message: "Could not save opportunity." });
  }
});

router.delete("/:id/save", auth("student"), async (req, res) => {
  await pool.execute("DELETE FROM saved_jobs WHERE user_id=? AND job_id=?", [req.user.id, req.params.id]);
  res.json({ message: "Opportunity removed from saved jobs." });
});

router.post("/:id/apply", auth("student"), async (req, res) => {
  try {
    await pool.execute(
      "INSERT INTO applications (user_id,job_id,cover_note) VALUES (?,?,?)",
      [req.user.id, req.params.id, req.body.coverNote || ""]
    );
    res.status(201).json({ message: "Application submitted." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "You have already applied for this opportunity." });
    res.status(500).json({ message: "Could not submit application." });
  }
});

function parseJson(value) {
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value || "[]"); } catch { return []; }
}

export default router;

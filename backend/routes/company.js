import { Router } from "express";
import pool from "../config/db.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/jobs", auth("company"), async (req, res) => {
  const [rows] = await pool.execute(
    "SELECT * FROM jobs WHERE company_id=? ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(rows);
});

router.post("/jobs", auth("company"), async (req, res) => {
  try {
    const j = req.body;
    if (!j.title || !j.category || !j.location || !j.description) {
      return res.status(400).json({ message: "Complete all required job fields." });
    }
    const [result] = await pool.execute(
      `INSERT INTO jobs
       (company_id,title,company_name,category,location,work_type,description,requirements,skills,stipend,deadline)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [req.user.id,j.title,req.user.name,j.category,j.location,j.workType||"On-site",
       j.description,j.requirements||"",JSON.stringify(j.skills||[]),j.stipend||"",j.deadline||null]
    );
    res.status(201).json({ id: result.insertId, message: "Opportunity published." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not publish opportunity." });
  }
});

router.delete("/jobs/:id", auth("company"), async (req, res) => {
  const [result] = await pool.execute(
    "DELETE FROM jobs WHERE id=? AND company_id=?",
    [req.params.id,req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: "Opportunity not found." });
  res.json({ message: "Opportunity deleted." });
});

export default router;

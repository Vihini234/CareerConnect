import { Router } from "express";
import pool from "../config/db.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth("student"), async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT a.id,a.status,a.applied_at,a.cover_note,j.id AS job_id,j.title,j.company_name,j.location,j.work_type
     FROM applications a JOIN jobs j ON j.id=a.job_id
     WHERE a.user_id=? ORDER BY a.applied_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

router.get("/company", auth("company"), async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT a.id,a.status,a.applied_at,a.cover_note,j.title,j.id AS job_id,u.name AS student_name,u.email
     FROM applications a JOIN jobs j ON j.id=a.job_id JOIN users u ON u.id=a.user_id
     WHERE j.company_id=? ORDER BY a.applied_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

router.patch("/:id/status", auth("company"), async (req, res) => {
  const allowed = ["Under Review","Shortlisted","Rejected","Accepted"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status." });
  const [result] = await pool.execute(
    `UPDATE applications a JOIN jobs j ON j.id=a.job_id
     SET a.status=? WHERE a.id=? AND j.company_id=?`,
    [req.body.status,req.params.id,req.user.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: "Application not found." });
  res.json({ message: "Application status updated." });
});

export default router;

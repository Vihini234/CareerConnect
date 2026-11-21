import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import profileRoutes from "./routes/profile.js";
import applicationRoutes from "./routes/applications.js";
import companyRoutes from "./routes/company.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", name: "CareerConnect API" }));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/company", companyRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`CareerConnect API running at http://localhost:${port}`));

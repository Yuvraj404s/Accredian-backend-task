import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import referralRoutes from "./routes/referralRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/referral", referralRoutes);

export default app;

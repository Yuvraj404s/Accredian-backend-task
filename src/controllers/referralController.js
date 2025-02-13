import prisma from "../config/db.js";
import { sendReferralEmail } from "../services/emailService.js";

export const submitReferral = async (req, res) => {
  try {
    const { referrerName, referrerEmail, referrerPhone, refereeName, refereeEmail, refereePhone, course } = req.body;

    if (!referrerName || !referrerEmail || !referrerPhone || !refereeName || !refereeEmail || !refereePhone || !course) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const referral = await prisma.referral.create({
      data: { referrerName, referrerEmail, referrerPhone, refereeName, refereeEmail, refereePhone, course },
    });

    await sendReferralEmail(referrerEmail, referrerName, referrerPhone, refereeEmail, refereeName, refereePhone, course);

    res.status(201).json({ message: "Referral submitted successfully", referral });
  } catch (error) {
    console.error("Error:", error);  // ✅ Log error
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
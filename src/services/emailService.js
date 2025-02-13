import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));

const { client_secret, client_id, redirect_uris } = CREDENTIALS.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

export const sendReferralEmail = async (referrerEmail, referrerName, referrerPhone, refereeEmail, refereeName, refereePhone, course) => {
    console.log("📩 Sending email to:", refereeEmail); 
    console.log("📩 Sending email from:", referrerEmail);
    if (!refereeEmail) {
        console.error("❌ Error: Recipient email is missing!");
        return;
    }
    const emailContent = [
        `From: Accredian Referral Team <${referrerEmail}>`,
        `To: ${refereeEmail}`,
        "Subject: Exclusive Course Referral Invitation - Special Benefits Inside!",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "",
        `<html>`,
        `<body>`,
        `<p>Dear <b>${refereeName}</b>,</p>`,
        `<p>I hope this email finds you well! 🎓</p>`,
        `<p>Your friend, <b>${referrerName}</b>, has referred you to enroll in our <b>\"${course}\"</b> course. ` +
        `This course is designed to provide top-notch knowledge and skills that will elevate your career prospects.</p>`,
        `<h3>🎯 Why should you join?</h3>`,
        `<ul>`,
        `<li><b>Industry-relevant curriculum</b> designed by experts.</li>`,
        `<li>Hands-on projects and real-world case studies.</li>`,
        `<li>Exclusive community access for networking & mentorship.</li>`,
        `<li>Special <b>referral benefits</b> on enrollment!</li>`,
        `</ul>`,
        `<h3>💡 How to get started?</h3>`,
        `<ol>`,
        `<li>Click on the link below to explore the course details and enroll.</li>`,
        `<li>Use this special referral code: <b>REFER2025</b> during registration.</li>`,
        `<li>Start your journey towards success!</li>`,
        `</ol>`,
        `<p>🔗 <a href="#">Course Enrollment Link</a></p>`,
        `<p>If you have any questions, feel free to reply to this email. We’re excited to welcome you on board! 🚀</p>`,
        `<p><b>Best Regards,</b><br>📩 Accredian Team<br>📞 Contact: support@accredian.com</p>`,
        `</body>`,
        `</html>`
    ].join("\r\n");
    

    const encodedMessage = Buffer.from(emailContent)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, ""); 

    try {
        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Email sending failed:", error.response?.data || error.message);
    }
};

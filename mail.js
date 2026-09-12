import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail", // http://nodemailer.com/smtp/well-known-services
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(url, monitorError) {
  const time = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  try {
    const info = await transporter.sendMail({
      from: "Monitor Team",
      to: process.env.RECEIVER,
      subject: "Monitor Status",
      text: `Your ${url} is down.\n\nError: ${monitorError}\n\nTime: ${time}`,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

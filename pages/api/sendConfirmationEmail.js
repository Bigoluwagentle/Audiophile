import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name, items, total } = req.body;

  try {
    // ✅ 1. Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can change to Outlook, Yahoo, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password, not your normal password!
      },
    });

    // ✅ 2. Email content
    const mailOptions = {
      from: `"Audiophile" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Audiophile Order Confirmation",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for your order! Here’s your summary:</p>
        <ul>
          ${items
            .map(
              (item) =>
                `<li>${item.name} — ${item.quantity}x @ $${item.price}</li>`
            )
            .join("")}
        </ul>
        <h3>Total: $${total}</h3>
        <p>We’ll notify you once your order ships.</p>
        <p>– The Audiophile Team</p>
      `,
    };

    // ✅ 3. Send mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}

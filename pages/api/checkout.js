import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAIL_FROM = process.env.MAIL_FROM || "orders@example.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function saveOrderToConvex(order) {
  const fakeId = "ORD-" + Date.now();
  return fakeId;
}

function buildOrderHtml({ orderId, customer, items, totals, shipping }) {
  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
    <h2>Hello ${customer.name},</h2>
    <p>Thanks for your order. Your order id is <strong>${orderId}</strong>.</p>
    <h3>Order summary</h3>
    <ul>
      ${items.map(i => `<li>${i.quantity} × ${i.name} — $${i.price}</li>`).join("")}
    </ul>
    <p>Shipping to: ${shipping.address1}, ${shipping.city}, ${shipping.country} (${shipping.postalCode})</p>
    <p>Subtotal: $${totals.subtotal}</p>
    <p>Shipping: $${totals.shipping}</p>
    <p>VAT: $${totals.taxes}</p>
    <h3>Total: $${totals.grandTotal}</h3>
    <p><a href="${APP_URL}/order/${orderId}" style="display:inline-block;padding:10px 16px;background:#000;color:#fff;text-decoration:none;border-radius:4px;">View your order</a></p>
    <p>Need help? Email support@yourdomain.com</p>
  </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const payload = req.body;

    // basic server-side validation (you can use zod again here)
    if (!payload.customer || !payload.items || payload.items.length === 0) {
      return res.status(400).json({ message: "Invalid order payload" });
    }

    const orderId = await saveOrderToConvex({
      ...payload,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    const html = buildOrderHtml({ orderId, customer: payload.customer, items: payload.items, totals: payload.totals, shipping: payload.shipping });

    await resend.emails.send({
      from: MAIL_FROM,
      to: payload.customer.email,
      subject: `Order confirmation — ${orderId}`,
      html,
    });

    return res.status(200).json({ orderId });
  } catch (err) {
    console.error("API checkout error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

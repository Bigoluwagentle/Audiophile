// pages/order/[orderId].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    async function fetchOrder() {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        setOrder(await res.json());
      } else {
        setOrder(null);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Thank you, {order.customer.name}</h1>
      <p>Order ID: {orderId}</p>
      {/* Render items, shipping, totals */}
      <ul>
        {order.items.map((it) => (
          <li key={it.id}>{it.quantity} × {it.name} — ${it.price}</li>
        ))}
      </ul>
      <p>Total: ${order.totals.grandTotal}</p>
    </main>
  );
}

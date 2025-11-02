import { mutation } from "./_generated/server";

export const saveOrder = mutation(async ({ db }, orderData) => {
  const inserted = await db.insert("orders", {
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  return { id: inserted };
});

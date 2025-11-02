import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveOrder = mutation({
  args: {
    address: v.string(),
    city: v.string(),
    country: v.string(),
    createdAt: v.optional(v.string()), // 👈 made optional
    email: v.string(),
    items: v.array(v.any()),
    name: v.string(),
    payment: v.string(),
    phone: v.string(),
    total: v.float64(),
    zip: v.string(),
    eMoneyNumber: v.optional(v.string()),
    eMoneyPin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("orders", {
      ...args,
      createdAt: args.createdAt ?? new Date().toISOString(),
    });
  },
});

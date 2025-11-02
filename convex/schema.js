import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    zip: v.string(),
    payment: v.string(),
    items: v.array(v.any()),  // array of any type (you can refine later)
    total: v.number(),
    createdAt: v.string(),
  }),
});

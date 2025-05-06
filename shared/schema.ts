import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  publicKey: text("public_key").notNull().unique(),
  lastLoginAt: timestamp("last_login_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  publicKey: true,
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // daily, weekly, monthly, yearly
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTicketSchema = createInsertSchema(tickets).pick({
  userId: true,
  type: true,
  quantity: true,
});

export const draws = pgTable("draws", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // daily, weekly, monthly, yearly
  drawTime: timestamp("draw_time").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed
  prize: text("prize").notNull(), // Amount in SOL
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDrawSchema = createInsertSchema(draws).pick({
  type: true,
  drawTime: true,
  prize: true,
});

export const winners = pgTable("winners", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  drawId: integer("draw_id").notNull().references(() => draws.id),
  transactionSignature: text("transaction_signature"), // Solana transaction ID
  prizeClaimed: boolean("prize_claimed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWinnerSchema = createInsertSchema(winners).pick({
  userId: true,
  drawId: true,
  transactionSignature: true,
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // pull, reward, ticket_earned
  details: jsonb("details"), // flexible JSON data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  details: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export type Draw = typeof draws.$inferSelect;
export type InsertDraw = z.infer<typeof insertDrawSchema>;

export type Winner = typeof winners.$inferSelect;
export type InsertWinner = z.infer<typeof insertWinnerSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

import { pgTable, text, serial, integer, boolean, timestamp, jsonb, primaryKey, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  publicKey: text("public_key").notNull().unique(),
  lastLoginAt: timestamp("last_login_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  publicKey: true,
});

// Tickets Table
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

// Draws Table
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

// Winners Table
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

// Activities Table
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

// Ticket Purchases Table
export const ticketPurchases = pgTable("ticket_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // daily, weekly, monthly, yearly
  quantity: integer("quantity").notNull(),
  amount: text("amount").notNull(), // Amount in SOL
  transactionSignature: text("transaction_signature"), // Solana transaction ID
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTicketPurchaseSchema = createInsertSchema(ticketPurchases).pick({
  userId: true,
  type: true,
  quantity: true,
  amount: true,
  transactionSignature: true,
  status: true,
});

// Prize Payouts Table
export const prizePayouts = pgTable("prize_payouts", {
  id: serial("id").primaryKey(),
  winnerId: integer("winner_id").notNull().references(() => winners.id),
  amount: text("amount").notNull(), // Amount in SOL
  transactionSignature: text("transaction_signature"), // Solana transaction ID
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPrizePayoutSchema = createInsertSchema(prizePayouts).pick({
  winnerId: true,
  amount: true,
  transactionSignature: true,
  status: true,
});

// Settings Table
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingSchema = createInsertSchema(settings).pick({
  key: true,
  value: true,
});

// Referrals Table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => users.id),
  referredId: integer("referred_id").notNull().references(() => users.id),
  reward: text("reward"), // Amount in SOL
  status: text("status").notNull().default("pending"), // pending, completed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReferralSchema = createInsertSchema(referrals).pick({
  referrerId: true,
  referredId: true,
  reward: true,
  status: true,
});

// User Stats Table
export const userStats = pgTable("user_stats", {
  userId: integer("user_id").primaryKey().references(() => users.id),
  
  // Current ticket counts
  currentDailyTickets: integer("current_daily_tickets").notNull().default(0),
  currentWeeklyTickets: integer("current_weekly_tickets").notNull().default(0),
  currentMonthlyTickets: integer("current_monthly_tickets").notNull().default(0),
  currentYearlyTickets: integer("current_yearly_tickets").notNull().default(0),
  
  // Lifetime ticket counts
  lifetimeDailyTickets: integer("lifetime_daily_tickets").notNull().default(0),
  lifetimeWeeklyTickets: integer("lifetime_weekly_tickets").notNull().default(0),
  lifetimeMonthlyTickets: integer("lifetime_monthly_tickets").notNull().default(0),
  lifetimeYearlyTickets: integer("lifetime_yearly_tickets").notNull().default(0),
  
  // Daily pull counts
  dailyPullCount: integer("daily_pull_count").notNull().default(0),
  dailyRaffleWinCount: integer("daily_raffle_win_count").notNull().default(0),
  dailyRewardWinCount: integer("daily_reward_win_count").notNull().default(0),
  
  // Lifetime pull counts
  lifetimePullCount: integer("lifetime_pull_count").notNull().default(0),
  lifetimeRaffleWinCount: integer("lifetime_raffle_win_count").notNull().default(0),
  lifetimeRewardWinCount: integer("lifetime_reward_win_count").notNull().default(0),
  
  // Financial statistics
  totalSolSpent: decimal("total_sol_spent", { precision: 20, scale: 9 }).notNull().default("0"), // Amount in SOL
  totalRewardBuybacks: decimal("total_reward_buybacks", { precision: 20, scale: 9 }).notNull().default("0"), // Amount in SOL
  
  // Timestamps
  lastPullAt: timestamp("last_pull_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserStatSchema = createInsertSchema(userStats).pick({
  userId: true,
  currentDailyTickets: true,
  currentWeeklyTickets: true,
  currentMonthlyTickets: true,
  currentYearlyTickets: true,
  lifetimeDailyTickets: true,
  lifetimeWeeklyTickets: true,
  lifetimeMonthlyTickets: true,
  lifetimeYearlyTickets: true,
  dailyPullCount: true,
  dailyRaffleWinCount: true,
  dailyRewardWinCount: true,
  lifetimePullCount: true,
  lifetimeRaffleWinCount: true,
  lifetimeRewardWinCount: true,
  totalSolSpent: true,
  totalRewardBuybacks: true,
  lastPullAt: true,
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

export type TicketPurchase = typeof ticketPurchases.$inferSelect;
export type InsertTicketPurchase = z.infer<typeof insertTicketPurchaseSchema>;

export type PrizePayout = typeof prizePayouts.$inferSelect;
export type InsertPrizePayout = z.infer<typeof insertPrizePayoutSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

export type UserStat = typeof userStats.$inferSelect;
export type InsertUserStat = z.infer<typeof insertUserStatSchema>;

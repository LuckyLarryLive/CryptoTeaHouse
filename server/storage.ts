import { 
  users, draws, tickets, winners, activities,
  type User, type InsertUser,
  type Ticket, type InsertTicket,
  type Draw, type InsertDraw,
  type Winner, type InsertWinner,
  type Activity, type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByPublicKey(publicKey: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLogin(id: number): Promise<User | undefined>;

  // Ticket methods
  getTickets(userId: number): Promise<{ type: string, count: number }[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  
  // Draw methods
  getDraws(type?: string): Promise<Draw[]>;
  getNextDraws(): Promise<{type: string, drawTime: Date}[]>;
  createDraw(draw: InsertDraw): Promise<Draw>;
  updateDrawStatus(id: number, status: string): Promise<Draw | undefined>;
  
  // Winner methods
  getWinners(limit?: number): Promise<any[]>;
  createWinner(winner: InsertWinner): Promise<Winner>;
  updateWinnerTransaction(id: number, signature: string): Promise<Winner | undefined>;
  
  // Activity methods
  getUserActivities(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByPublicKey(publicKey: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.publicKey, publicKey));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUserLogin(id: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  // Ticket methods
  async getTickets(userId: number): Promise<{ type: string, count: number }[]> {
    const ticketCounts = await db
      .select({
        type: tickets.type,
        count: sql<number>`SUM(${tickets.quantity})`.as("count")
      })
      .from(tickets)
      .where(eq(tickets.userId, userId))
      .groupBy(tickets.type);
    
    return ticketCounts;
  }
  
  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const [ticket] = await db.insert(tickets).values(insertTicket).returning();
    return ticket;
  }
  
  // Draw methods
  async getDraws(type?: string): Promise<Draw[]> {
    let query = db.select().from(draws).orderBy(desc(draws.drawTime));
    
    if (type) {
      query = query.where(eq(draws.type, type));
    }
    
    return await query.limit(20);
  }
  
  async getNextDraws(): Promise<{type: string, drawTime: Date}[]> {
    const currentTime = new Date();
    
    const upcomingDraws = await db
      .select({
        type: draws.type,
        drawTime: draws.drawTime
      })
      .from(draws)
      .where(and(
        eq(draws.status, "pending"),
        sql`${draws.drawTime} > ${currentTime}`
      ))
      .orderBy(draws.drawTime)
      .groupBy(draws.type, draws.drawTime)
      .limit(4);
    
    return upcomingDraws;
  }
  
  async createDraw(insertDraw: InsertDraw): Promise<Draw> {
    const [draw] = await db.insert(draws).values(insertDraw).returning();
    return draw;
  }
  
  async updateDrawStatus(id: number, status: string): Promise<Draw | undefined> {
    const [draw] = await db
      .update(draws)
      .set({ status })
      .where(eq(draws.id, id))
      .returning();
    return draw;
  }
  
  // Winner methods
  async getWinners(limit: number = 10): Promise<any[]> {
    const winnerResults = await db
      .select({
        id: winners.id,
        userId: winners.userId,
        publicKey: users.publicKey,
        drawId: winners.drawId,
        drawType: draws.type,
        prize: draws.prize,
        createdAt: winners.createdAt,
        transactionSignature: winners.transactionSignature
      })
      .from(winners)
      .innerJoin(users, eq(winners.userId, users.id))
      .innerJoin(draws, eq(winners.drawId, draws.id))
      .orderBy(desc(winners.createdAt))
      .limit(limit);
    
    return winnerResults;
  }
  
  async createWinner(insertWinner: InsertWinner): Promise<Winner> {
    const [winner] = await db.insert(winners).values(insertWinner).returning();
    return winner;
  }
  
  async updateWinnerTransaction(id: number, transactionSignature: string): Promise<Winner | undefined> {
    const [winner] = await db
      .update(winners)
      .set({ transactionSignature, prizeClaimed: true })
      .where(eq(winners.id, id))
      .returning();
    return winner;
  }
  
  // Activity methods
  async getUserActivities(userId: number, limit: number = 10): Promise<Activity[]> {
    const activities = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
    
    return activities;
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }
}

export const storage = new DatabaseStorage();

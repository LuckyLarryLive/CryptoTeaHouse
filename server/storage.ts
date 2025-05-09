import { 
  users, draws, tickets, winners, activities, userStats,
  type User, type InsertUser,
  type Ticket, type InsertTicket,
  type Draw, type InsertDraw,
  type Winner, type InsertWinner,
  type Activity, type InsertActivity,
  type UserStat
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByPublicKey(publicKey: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLogin(id: string): Promise<User | undefined>;

  // Ticket methods
  getTickets(userId: string): Promise<{ type: string, count: number }[]>;
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
  getUserActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
  
  async getUserByPublicKey(publicKey: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.publicKey, publicKey));
      return user;
    } catch (error) {
      console.error('Error getting user by public key:', error);
      throw error;
    }
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values({
        ...insertUser,
        id: crypto.randomUUID(),
        lastLoginAt: new Date(),
        createdAt: new Date()
      }).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async updateUserLogin(id: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error('Error updating user login:', error);
      throw error;
    }
  }
  
  // Ticket methods
  async getTickets(userId: string): Promise<{ type: string, count: number }[]> {
    try {
      const [stats] = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId))
        .limit(1);

      if (!stats) {
        // Initialize user stats if not found
        const [newStats] = await db
          .insert(userStats)
          .values({
            userId,
            currentDailyTickets: 0,
            currentWeeklyTickets: 0,
            currentMonthlyTickets: 0,
            currentYearlyTickets: 0,
            lifetimeDailyTickets: 0,
            lifetimeWeeklyTickets: 0,
            lifetimeMonthlyTickets: 0,
            lifetimeYearlyTickets: 0,
            dailyPullCount: 0,
            dailyRaffleWinCount: 0,
            dailyRewardWinCount: 0,
            lifetimePullCount: 0,
            lifetimeRaffleWinCount: 0,
            lifetimeRewardWinCount: 0,
            totalSolSpent: "0",
            totalRewardBuybacks: "0",
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();

        return [
          { type: "daily", count: newStats.currentDailyTickets },
          { type: "weekly", count: newStats.currentWeeklyTickets },
          { type: "monthly", count: newStats.currentMonthlyTickets },
          { type: "yearly", count: newStats.currentYearlyTickets }
        ];
      }

      return [
        { type: "daily", count: stats.currentDailyTickets },
        { type: "weekly", count: stats.currentWeeklyTickets },
        { type: "monthly", count: stats.currentMonthlyTickets },
        { type: "yearly", count: stats.currentYearlyTickets }
      ];
    } catch (error) {
      console.error('Error getting tickets:', error);
      throw new Error('Failed to fetch user tickets');
    }
  }
  
  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    try {
      const [newTicket] = await db.insert(tickets).values(ticket).returning();
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }
  
  // Draw methods
  async getDraws(type?: string): Promise<Draw[]> {
    try {
      const query = db.select().from(draws);
      if (type) {
        query.where(eq(draws.type, type));
      }
      return await query;
    } catch (error) {
      console.error('Error getting draws:', error);
      throw error;
    }
  }
  
  async getNextDraws(): Promise<{type: string, drawTime: Date}[]> {
    try {
      const now = new Date();
      const upcomingDraws = await db
        .select()
        .from(draws)
        .where(sql`draw_time > ${now}`)
        .orderBy(draws.drawTime)
        .limit(4); // Get next 4 draws (daily, weekly, monthly, yearly)
      
      if (upcomingDraws.length === 0) {
        // Create initial draws if none exist
        const drawTypes = ['daily', 'weekly', 'monthly', 'yearly'];
        const newDraws = await Promise.all(
          drawTypes.map(async (type) => {
            const [draw] = await db
              .insert(draws)
              .values({
                type,
                drawTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
                status: 'pending',
                prize: '0.1',
                createdAt: now
              })
              .returning();
            return draw;
          })
        );
        return newDraws.map(draw => ({
          type: draw.type,
          drawTime: draw.drawTime
        }));
      }
      
      return upcomingDraws.map(draw => ({
        type: draw.type,
        drawTime: draw.drawTime
      }));
    } catch (error) {
      console.error('Error getting next draws:', error);
      throw new Error('Failed to fetch upcoming draws');
    }
  }
  
  async createDraw(draw: InsertDraw): Promise<Draw> {
    try {
      const [newDraw] = await db.insert(draws).values(draw).returning();
      return newDraw;
    } catch (error) {
      console.error('Error creating draw:', error);
      throw error;
    }
  }
  
  async updateDrawStatus(id: number, status: string): Promise<Draw | undefined> {
    try {
      const [draw] = await db
        .update(draws)
        .set({ status })
        .where(eq(draws.id, id))
        .returning();
      return draw;
    } catch (error) {
      console.error('Error updating draw status:', error);
      throw error;
    }
  }
  
  // Winner methods
  async getWinners(limit: number = 10): Promise<any[]> {
    try {
      const winnerResults = await db
        .select({
          id: winners.id,
          userId: winners.userId,
          drawId: winners.drawId,
          transactionSignature: winners.transactionSignature,
          prizeClaimed: winners.prizeClaimed,
          createdAt: winners.createdAt,
          draw: {
            type: draws.type,
            prize: draws.prize
          }
        })
        .from(winners)
        .leftJoin(draws, eq(winners.drawId, draws.id))
        .orderBy(desc(winners.createdAt))
        .limit(limit);
      
      return winnerResults;
    } catch (error) {
      console.error('Error getting winners:', error);
      throw error;
    }
  }
  
  async createWinner(winner: InsertWinner): Promise<any> {
    try {
      const [newWinner] = await db.insert(winners).values(winner).returning();
      return newWinner;
    } catch (error) {
      console.error('Error creating winner:', error);
      throw error;
    }
  }
  
  async updateWinnerTransaction(id: number, signature: string): Promise<any> {
    try {
      const [winner] = await db
        .update(winners)
        .set({ transactionSignature: signature })
        .where(eq(winners.id, id))
        .returning();
      return winner;
    } catch (error) {
      console.error('Error updating winner transaction:', error);
      throw error;
    }
  }
  
  // Activity methods
  async getUserActivities(userId: string, limit: number = 10): Promise<Activity[]> {
    try {
      const result = await db
        .select()
        .from(activities)
        .where(eq(activities.userId, userId))
        .orderBy(desc(activities.createdAt))
        .limit(limit);
      
      return result;
    } catch (error) {
      console.error('Error getting user activities:', error);
      throw new Error('Failed to fetch user activities');
    }
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    try {
      const [newActivity] = await db.insert(activities as any).values(activity).returning();
      return newActivity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();

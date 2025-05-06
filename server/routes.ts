import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTicketSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth", async (req: Request, res: Response) => {
    try {
      const { publicKey } = req.body;
      
      if (!publicKey) {
        return res.status(400).json({ message: "Public key is required" });
      }
      
      // Check if user exists
      let user = await storage.getUserByPublicKey(publicKey);
      
      // Create user if doesn't exist
      if (!user) {
        try {
          const userData = insertUserSchema.parse({ publicKey });
          user = await storage.createUser(userData);
        } catch (error) {
          return res.status(400).json({ message: "Invalid user data" });
        }
      } else {
        // Update last login time
        user = await storage.updateUserLogin(user.id) || user;
      }
      
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user tickets
  app.get("/api/user/:userId/tickets", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const ticketCounts = await storage.getTickets(userId);
      
      // Ensure we have all ticket types, even if count is 0
      const ticketTypes = ["daily", "weekly", "monthly", "yearly"];
      const fullTicketCounts = ticketTypes.map(type => {
        const found = ticketCounts.find(t => t.type === type);
        return found || { type, count: 0 };
      });
      
      return res.status(200).json(fullTicketCounts);
    } catch (error) {
      console.error("Get tickets error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get upcoming draws
  app.get("/api/draws/upcoming", async (req: Request, res: Response) => {
    try {
      const upcomingDraws = await storage.getNextDraws();
      return res.status(200).json(upcomingDraws);
    } catch (error) {
      console.error("Get upcoming draws error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Pull lucky cat arm endpoint
  app.post("/api/pull", async (req: Request, res: Response) => {
    try {
      const { userId, pullType } = req.body;
      
      if (!userId || !pullType) {
        return res.status(400).json({ message: "User ID and pull type are required" });
      }
      
      if (!["daily", "weekly", "monthly"].includes(pullType)) {
        return res.status(400).json({ message: "Invalid pull type" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Random pull result - ticket or small SOL amount
      const isWinner = Math.random() > 0.7;
      const result = {
        type: isWinner ? "reward" : "ticket_earned",
        details: {}
      };
      
      if (isWinner) {
        // Return SOL prize
        const prizeTiers = {
          daily: [0.01, 0.05, 0.1],
          weekly: [0.1, 0.2, 0.5],
          monthly: [0.5, 1, 2]
        };
        
        const tier = Math.floor(Math.random() * 3);
        const prize = prizeTiers[pullType as keyof typeof prizeTiers][tier];
        
        result.details = {
          prize: prize.toString(),
          pullType,
          message: `You won ${prize} SOL!`
        };
      } else {
        // Return ticket for the appropriate draw
        const ticketData = insertTicketSchema.parse({
          userId,
          type: pullType,
          quantity: 1
        });
        
        const ticketResult = await storage.createTicket(ticketData);
        
        result.details = {
          ticket: ticketResult,
          pullType,
          message: `You earned a ${pullType} ticket!`
        };
      }
      
      // Record activity
      const activityData = insertActivitySchema.parse({
        userId,
        type: result.type,
        details: result.details
      });
      
      await storage.createActivity(activityData);
      
      return res.status(200).json(result);
    } catch (error) {
      console.error("Pull error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user activities
  app.get("/api/user/:userId/activities", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const limit = Number(req.query.limit) || 10;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const activities = await storage.getUserActivities(userId, limit);
      return res.status(200).json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get winners
  app.get("/api/winners", async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const winners = await storage.getWinners(limit);
      return res.status(200).json(winners);
    } catch (error) {
      console.error("Get winners error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

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
      
      // For now, just return a mock user object
      const mockUser = {
        id: 1,
        publicKey: publicKey,
        lastLoginAt: new Date(),
        createdAt: new Date()
      };
      
      return res.status(200).json({ user: mockUser });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user tickets
  app.get("/api/user/:userId/tickets", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      
      if (!userId || userId === '0') {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const tickets = await storage.getTickets(userId);
      return res.status(200).json(tickets);
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
        result.details = {
          ticket: {
            id: Math.floor(Math.random() * 1000),
            userId,
            type: pullType,
            quantity: 1,
            createdAt: new Date()
          },
          pullType,
          message: `You earned a ${pullType} ticket!`
        };
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error("Pull error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user activities
  app.get("/api/user/:userId/activities", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const limit = Number(req.query.limit) || 10;
      
      if (!userId || userId === '0') {
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
      
      // Return mock winners
      const mockWinners = [
        {
          id: 1,
          userId: 1,
          publicKey: "mockPublicKey",
          drawId: 1,
          drawType: "daily",
          prize: "0.1",
          createdAt: new Date(),
          transactionSignature: null
        }
      ];
      
      return res.status(200).json(mockWinners);
    } catch (error) {
      console.error("Get winners error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

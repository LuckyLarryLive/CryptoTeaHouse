import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTicketSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";

// CORS headers for Supabase Edge Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth", async (req: Request, res: Response) => {
    try {
      const { publicKey } = req.body;
      
      if (!publicKey) {
        return res.status(400).json({ message: "Public key is required" });
      }
      
      // Get or create user
      const user = await storage.getUserByPublicKey(publicKey);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user tickets - Minimal stub with CORS
  app.get("/api/tickets/user/:userId", (_req: Request, res: Response) => {
    res.set(corsHeaders);
    res.status(200).json([
      { type: "daily", count: 0 },
      { type: "weekly", count: 0 },
      { type: "monthly", count: 0 },
      { type: "yearly", count: 0 }
    ]);
  });
  
  // Get upcoming draws - Minimal stub with CORS
  app.get("/api/draws/upcoming", (_req: Request, res: Response) => {
    res.set(corsHeaders);
    res.status(200).json([]);
  });
  
  // Get user activities - Minimal stub with CORS
  app.get("/api/activities/user/:userId", (_req: Request, res: Response) => {
    res.set(corsHeaders);
    res.status(200).json([]);
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
      
      res.set(corsHeaders);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Pull error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get winners - Minimal stub with CORS
  app.get("/api/winners", (_req: Request, res: Response) => {
    res.set(corsHeaders);
    res.status(200).json([]);
  });

  const httpServer = createServer(app);
  return httpServer;
}

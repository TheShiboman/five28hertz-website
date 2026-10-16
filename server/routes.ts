import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertNewsletterSchema } from "@shared/schema";
import { adminAuth } from "./lib/firebase-admin";
import aiAssistantRouter from "./api/ai-assistant";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth callback
  app.post("/api/auth/callback", async (req, res) => {
    try {
      const token = req.headers.authorization?.split("Bearer ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decodedToken = await adminAuth.verifyIdToken(token);
      const existingUser = await storage.getUserByFirebaseId(decodedToken.uid);

      if (!existingUser) {
        const user = await storage.createUser({
          firebaseId: decodedToken.uid,
          email: decodedToken.email!,
          name: decodedToken.name || "Anonymous",
          isAdmin: false
        });
        return res.status(201).json(user);
      }

      return res.status(200).json(existingUser);
    } catch (error) {
      console.error("Auth callback error:", error);
      res.status(400).json({ message: "Authentication failed" });
    }
  });

  // Projects
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const token = req.headers.authorization?.split("Bearer ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decodedToken = await adminAuth.verifyIdToken(token);
      const user = await storage.getUserByFirebaseId(decodedToken.uid);

      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  // Newsletter
  app.post("/api/newsletter", async (req, res) => {
    try {
      const data = insertNewsletterSchema.parse(req.body);
      const isSubscribed = await storage.isEmailSubscribed(data.email);
      if (isSubscribed) {
        return res.status(400).json({ message: "Email already subscribed" });
      }

      const subscription = await storage.addNewsletterSubscription(data);
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(400).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // AI Assistant API
  app.use("/api/ai-assistant", aiAssistantRouter);

  const httpServer = createServer(app);
  return httpServer;
}
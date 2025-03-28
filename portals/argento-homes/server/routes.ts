import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertPropertySchema, 
  insertTaskSchema, 
  insertVendorSchema, 
  insertMessageSchema, 
  insertSustainabilityMetricSchema,
  insertBookingSchema,
  insertReviewSchema,
  UserRole,
  ApprovalStatus,
  Property,
  Booking,
  Review,
  Message
} from "@shared/schema";
import { z } from "zod";
import { 
  isAuthenticated, 
  isAdmin, 
  isVendor, 
  isPropertyOwner,
  isGuest,
  isGuestOrPropertyOwner,
  hasAdminRole,
  hasVendorRole,
  hasPropertyOwnerRole,
  hasGuestRole
} from "./middleware/role-middleware";
import Stripe from "stripe";
import { WebSocketServer, WebSocket } from 'ws';

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Initialize Stripe
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("WARNING: STRIPE_SECRET_KEY is not set. Stripe payments will not work.");
  }
  const stripe = process.env.STRIPE_SECRET_KEY 
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any }) 
    : null;
    
  // Stripe payment endpoint (authenticated)
  app.post("/api/create-payment-intent", isAuthenticated, async (req, res, next) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      
      const { amount, propertyId, description } = req.body;
      
      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ error: "Amount is required and must be a number" });
      }
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          propertyId: propertyId?.toString() || '',
          userId: req.user?.id.toString() || '',
          description: description || 'Property booking'
        }
      });
      
      // Return the client secret to the client
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error: any) {
      console.error("Stripe payment error:", error.message);
      res.status(500).json({ 
        error: "Failed to create payment intent",
        message: error.message
      });
    }
  });
  
  // Public Stripe payment endpoint for testing
  app.post("/api/public/create-payment-intent", async (req, res, next) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      
      const { amount, description } = req.body;
      
      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ error: "Amount is required and must be a number" });
      }
      
      console.log(`[PUBLIC API] Creating test payment intent for $${amount}`);
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          isTest: 'true',
          description: description || 'Test payment'
        }
      });
      
      // Return the client secret to the client
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Public Stripe payment error:", error.message);
      res.status(500).json({ 
        error: "Failed to create payment intent",
        message: error.message
      });
    }
  });

  // Property routes
  // Get properties for the logged-in user
  app.get("/api/properties", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const properties = await storage.getPropertiesByUser(userId);
      res.json(properties);
    } catch (error) {
      next(error);
    }
  });
  
  // Get available approved properties - accessible by anyone (including unauthenticated users)
  app.get("/api/properties/available", async (req, res, next) => {
    try {
      // Get all properties that have approved status
      const allProperties = await storage.getAllProperties();
      console.log("[API] getAllProperties result:", allProperties);
      
      const approvedProperties = allProperties.filter(property => {
        const status = property.approvalStatus?.toUpperCase();
        console.log(`[API] Property ${property.id} (${property.name}) has status: ${status}`);
        return status === 'APPROVED';
      });
      
      console.log("[API] Filtered approved properties:", approvedProperties);
      res.json(approvedProperties);
    } catch (error) {
      console.error("[API] Error in /api/properties/available:", error);
      next(error);
    }
  });
  
  // Get public property details - accessible without authentication for approved properties
  app.get("/api/properties/public/:id", async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Add debug logs
      console.log(`[API] Public property request for ID ${propertyId}, status: ${property.approvalStatus}`);
      
      // Only return publicly approved properties - check for any casing of "APPROVED"
      const status = property.approvalStatus?.toUpperCase();
      if (status === 'APPROVED') {
        console.log(`[API] Public property ${propertyId} is approved, returning data`);
        return res.json(property);
      }
      
      console.log(`[API] Public property ${propertyId} not approved (status: ${status})`);
      return res.status(403).json({ message: "Property not available" });
    } catch (error) {
      console.error("[API] Error in /api/properties/public/:id:", error);
      next(error);
    }
  });

  app.get("/api/properties/:id", isAuthenticated, async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const userRole = req.user?.role?.toLowerCase();
      const isOwner = property.userId === req.user?.id;
      const isAdmin = hasAdminRole(userRole);
      const isGuest = hasGuestRole(userRole);
      
      // Guests can view approved properties
      if (isGuest) {
        console.log(`[API] Guest access check for property ${propertyId} - status: ${property.approvalStatus}`);
        const status = property.approvalStatus?.toUpperCase();
        if (status === 'APPROVED') {
          console.log(`[API] Access granted to guest for approved property ${propertyId}`);
          return res.json(property);
        }
      }
      
      // Owners can view their own properties
      if (isOwner || isAdmin) {
        return res.json(property);
      }
      
      return res.status(403).json({ message: "Access denied" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/properties", isAuthenticated, async (req, res, next) => {
    try {
      const validation = insertPropertySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid property data", errors: validation.error.errors });
      }
      
      // Make sure userId is provided and is a number
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const property = await storage.createProperty({
        ...validation.data,
        userId: req.user.id,
        // Ensure these fields are properly typed
        features: validation.data.features || [],
        propertyType: validation.data.propertyType || 'apartment'
      });
      
      res.status(201).json(property);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/properties/:id", isAuthenticated, async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user?.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedProperty = await storage.updateProperty(propertyId, req.body);
      res.json(updatedProperty);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/properties/:id", isAuthenticated, async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user?.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteProperty(propertyId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
  
  // Admin routes for property approval
  app.get("/api/admin/properties/pending", isAdmin, async (req, res, next) => {
    try {
      
      // Get all properties from all users
      const users = await storage.getAllUsers();
      let allProperties: any[] = [];
      
      for (const user of users) {
        const userProperties = await storage.getPropertiesByUser(user.id);
        allProperties = [...allProperties, ...userProperties];
      }
      
      const pendingProperties = allProperties.filter(property => property.approvalStatus === 'PENDING');
      
      res.json(pendingProperties);
    } catch (error) {
      next(error);
    }
  });
  
  // Route to approve a property
  app.put("/api/admin/properties/:id/approve", isAdmin, async (req, res, next) => {
    try {
      
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const updatedProperty = await storage.updateProperty(propertyId, { 
        approvalStatus: 'APPROVED',
        adminNotes: req.body.adminNotes
      });
      
      res.json(updatedProperty);
    } catch (error) {
      next(error);
    }
  });
  
  // Route to reject a property
  app.put("/api/admin/properties/:id/reject", isAdmin, async (req, res, next) => {
    try {
      
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const updatedProperty = await storage.updateProperty(propertyId, { 
        approvalStatus: 'REJECTED',
        adminNotes: req.body.adminNotes
      });
      
      res.json(updatedProperty);
    } catch (error) {
      next(error);
    }
  });

  // Task routes
  app.get("/api/properties/:propertyId/tasks", isAuthenticated, async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user?.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const tasks = await storage.getTasksByProperty(propertyId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/properties/:propertyId/tasks", isAuthenticated, async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user?.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const validation = insertTaskSchema.safeParse({
        ...req.body,
        propertyId
      });
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid task data", errors: validation.error.errors });
      }
      
      const task = await storage.createTask(validation.data);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  // Vendor routes
  // Create a vendor application
  app.post("/api/vendors", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const validation = insertVendorSchema.safeParse({
        ...req.body,
        userId: req.user.id,
        approvalStatus: ApprovalStatus.PENDING,
        rating: 0,
        reviewCount: 0
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid vendor data", 
          errors: validation.error.errors 
        });
      }
      
      // Check if the user already has a vendor profile
      const existingVendor = await storage.getVendorByUserId(req.user.id);
      if (existingVendor) {
        return res.status(409).json({ 
          message: "A vendor profile already exists for this user" 
        });
      }
      
      const vendor = await storage.createVendor(validation.data);
      res.status(201).json(vendor);
    } catch (error) {
      next(error);
    }
  });
  
  // Get all vendors
  app.get("/api/vendors", async (req, res, next) => {
    try {
      const vendors = await storage.getAllVendors();
      
      // Join with user data to get vendor details
      const vendorsWithDetails = await Promise.all(
        vendors.map(async (vendor) => {
          const user = await storage.getUser(vendor.userId);
          return {
            ...vendor,
            fullName: user?.fullName,
            email: user?.email,
          };
        })
      );
      
      res.json(vendorsWithDetails);
    } catch (error) {
      next(error);
    }
  });
  
  // Endpoint to retrieve user permissions
  app.get("/api/user/permissions", isAuthenticated, async (req, res, next) => {
    try {
      console.log("[Permissions] Request received for user permissions");
      
      if (!req.user || !req.user.id) {
        console.log("[Permissions] No user in request");
        return res.status(401).json({ message: "Authentication required" });
      }
      
      console.log(`[Permissions] Getting user with ID: ${req.user.id}`);
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        console.log("[Permissions] User not found in database");
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log(`[Permissions] User found. Username: ${user.username}, Role: ${user.role}`);
      
      // Determine role-based permissions
      const isAdmin = hasAdminRole(user.role);
      const isVendor = hasVendorRole(user.role);
      const isPropertyOwner = hasPropertyOwnerRole(user.role);
      const isGuest = hasGuestRole(user.role);
      
      console.log(`[Permissions] Role checks - isAdmin: ${isAdmin}, isVendor: ${isVendor}, isPropertyOwner: ${isPropertyOwner}, isGuest: ${isGuest}`);
      
      // Build permissions object
      const permissions = {
        isAuthenticated: true,
        isAdmin,
        isVendor,
        isPropertyOwner,
        isGuest,
        role: user.role,
        canApproveReject: isAdmin,
        canManageProperties: isPropertyOwner || isAdmin,
        canManageVendors: isAdmin,
        canAccessAdminPanel: isAdmin,
        canBookProperties: isGuest || isPropertyOwner || isAdmin,
        canViewPropertyDetails: true, // All authenticated users can view property details
        canManageOwnBookings: isGuest || isPropertyOwner || isAdmin
      };
      
      console.log(`[Permissions] Returning permissions:`, permissions);
      res.json(permissions);
    } catch (error) {
      console.error("[Permissions] Error:", error);
      next(error);
    }
  });
  
  // Route to get the current user's vendor profile for registration page (available to all authenticated users)
  app.get("/api/vendors/profile", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      try {
        const vendor = await storage.getVendorByUserId(req.user.id);
        
        if (vendor) {
          // Add user details to the vendor profile
          const vendorWithDetails = {
            ...vendor,
            fullName: req.user.fullName,
            email: req.user.email,
          };
          
          res.json(vendorWithDetails);
        } else {
          // Return 404 to indicate no vendor profile exists yet
          res.status(404).json({ message: "Vendor profile not found" });
        }
      } catch (error) {
        // Also return 404 if there's an error finding the vendor
        console.error("Error finding vendor profile:", error);
        res.status(404).json({ message: "Vendor profile not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // Route to get the current user's vendor profile (if they are a vendor)
  app.get("/api/vendors/my-profile", isVendor, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const vendor = await storage.getVendorByUserId(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }
      
      // Add user details to the vendor profile
      const vendorWithDetails = {
        ...vendor,
        fullName: req.user.fullName,
        email: req.user.email,
      };
      
      res.json(vendorWithDetails);
    } catch (error) {
      next(error);
    }
  });
  
  // Route to check vendor profile for any authenticated user
  app.get("/api/vendors/profile", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const vendor = await storage.getVendorByUserId(req.user.id);
      
      if (!vendor) {
        // Return null instead of 404 to allow checking if user has a vendor profile
        return res.json(null);
      }
      
      // Add user details to the vendor profile
      const vendorWithDetails = {
        ...vendor,
        fullName: req.user.fullName,
        email: req.user.email,
      };
      
      res.json(vendorWithDetails);
    } catch (error) {
      next(error);
    }
  });
  
  // Route to update the current user's vendor profile
  app.put("/api/vendors/my-profile", isVendor, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const vendor = await storage.getVendorByUserId(req.user.id);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor profile not found" });
      }
      
      // If vendor is trying to update approval status, prevent it
      if (req.body.approvalStatus && req.body.approvalStatus !== vendor.approvalStatus) {
        return res.status(403).json({ 
          message: "You cannot change the approval status. It can only be changed by an admin." 
        });
      }
      
      // Update the vendor profile
      const updatedVendor = await storage.updateVendor(vendor.id, req.body);
      
      // Add user details to the response
      const updatedVendorWithDetails = {
        ...updatedVendor,
        fullName: req.user.fullName,
        email: req.user.email,
      };
      
      res.json(updatedVendorWithDetails);
    } catch (error) {
      next(error);
    }
  });
  
  // Route to get pending vendors for approval
  app.get("/api/admin/vendors/pending", isAdmin, async (req, res, next) => {
    try {
      
      const vendors = await storage.getAllVendors();
      const pendingVendors = vendors.filter(vendor => vendor.approvalStatus === 'PENDING');
      
      // Join with user data to get vendor details
      const vendorsWithDetails = await Promise.all(
        pendingVendors.map(async (vendor) => {
          const user = await storage.getUser(vendor.userId);
          return {
            ...vendor,
            fullName: user?.fullName,
            email: user?.email,
          };
        })
      );
      
      res.json(vendorsWithDetails);
    } catch (error) {
      next(error);
    }
  });
  
  // Route to approve a vendor
  app.put("/api/admin/vendors/:id/approve", isAdmin, async (req, res, next) => {
    try {
      
      const vendorId = parseInt(req.params.id);
      const vendor = await storage.getVendor(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      
      const updatedVendor = await storage.updateVendor(vendorId, { 
        approvalStatus: "APPROVED" as keyof typeof ApprovalStatus,
        adminNotes: req.body.adminNotes
      });
      
      // Update the user's role to VENDOR when approved
      const vendorUser = await storage.getUser(vendor.userId);
      if (vendorUser) {
        await storage.updateUser(vendorUser.id, { 
          role: UserRole.VENDOR as "PROPERTY_OWNER" | "VENDOR" | "DEVELOPER" 
        });
      }
      
      res.json(updatedVendor);
    } catch (error) {
      next(error);
    }
  });
  
  // Route to reject a vendor
  app.put("/api/admin/vendors/:id/reject", isAdmin, async (req, res, next) => {
    try {
      
      const vendorId = parseInt(req.params.id);
      const vendor = await storage.getVendor(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      
      const updatedVendor = await storage.updateVendor(vendorId, { 
        approvalStatus: "REJECTED" as keyof typeof ApprovalStatus,
        adminNotes: req.body.adminNotes
      });
      
      res.json(updatedVendor);
    } catch (error) {
      next(error);
    }
  });
  
  // Get all users (admin only)
  app.get("/api/admin/users", isAdmin, async (req, res, next) => {
    try {
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });
  
  // Get admin dashboard statistics
  app.get("/api/admin/stats", isAdmin, async (req, res, next) => {
    try {
      
      // Get all users
      const users = await storage.getAllUsers();
      
      // Get all properties
      let allProperties: Property[] = [];
      for (const user of users) {
        const userProperties = await storage.getPropertiesByUser(user.id);
        allProperties = [...allProperties, ...userProperties];
      }
      
      // Get all vendors
      const vendors = await storage.getAllVendors();
      
      // Get all bookings (could be improved with a getAllBookings method)
      let allBookings: Booking[] = [];
      for (const property of allProperties) {
        const propertyBookings = await storage.getBookingsByProperty(property.id);
        allBookings = [...allBookings, ...propertyBookings];
      }
      
      // Calculate stats
      const activeBookings = allBookings.filter(booking => booking.status === 'CONFIRMED').length;
      
      // Calculate monthly revenue (simplified for now - in a real app this would be more complex)
      const monthlyRevenue = allBookings.reduce((total, booking) => {
        if (booking.createdAt) {
          // Convert the Date | null to a string and then to a Date to avoid TypeScript errors
          const bookingDate = new Date(booking.createdAt.toString());
          const currentDate = new Date();
          if (bookingDate.getMonth() === currentDate.getMonth() && 
              bookingDate.getFullYear() === currentDate.getFullYear()) {
            return total + booking.totalPrice;
          }
        }
        return total;
      }, 0);
      
      res.json({
        totalUsers: users.length,
        totalProperties: allProperties.length,
        totalVendors: vendors.length,
        totalBookings: allBookings.length,
        activeBookings,
        monthlyRevenue,
        growthRate: 12.5 // This would be calculated based on historical data
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/vendors/category/:category", async (req, res, next) => {
    try {
      const category = req.params.category;
      const vendors = await storage.getVendorsByCategory(category);
      
      // Join with user data to get vendor details
      const vendorsWithDetails = await Promise.all(
        vendors.map(async (vendor) => {
          const user = await storage.getUser(vendor.userId);
          return {
            ...vendor,
            fullName: user?.fullName,
            email: user?.email,
          };
        })
      );
      
      res.json(vendorsWithDetails);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/vendors/:id", async (req, res, next) => {
    try {
      const vendorId = parseInt(req.params.id);
      
      if (isNaN(vendorId)) {
        return res.status(400).json({ message: "Invalid vendor ID" });
      }
      
      const vendor = await storage.getVendor(vendorId);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      
      // Get user details for the vendor
      const user = await storage.getUser(vendor.userId);
      
      // Combine vendor and user data
      const vendorWithDetails = {
        ...vendor,
        fullName: user?.fullName,
        email: user?.email,
      };
      
      res.json(vendorWithDetails);
    } catch (error) {
      next(error);
    }
  });

  // Messages routes
  app.get("/api/messages", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      
      const messages = await storage.getMessagesByUser(userId);
      
      // Add sender and receiver details to messages
      const messagesWithDetails = await Promise.all(
        messages.map(async (message) => {
          const sender = await storage.getUser(message.senderId);
          const receiver = await storage.getUser(message.receiverId);
          return {
            ...message,
            sender: {
              id: sender?.id,
              fullName: sender?.fullName,
              username: sender?.username,
            },
            receiver: {
              id: receiver?.id,
              fullName: receiver?.fullName,
              username: receiver?.username,
            },
          };
        })
      );
      
      res.json(messagesWithDetails);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/messages", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const validation = insertMessageSchema.safeParse({
        ...req.body,
        senderId: req.user.id,
      });
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid message data", errors: validation.error.errors });
      }
      
      const message = await storage.createMessage(validation.data);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/messages/:id/read", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const messageId = parseInt(req.params.id);
      const message = await storage.getMessage(messageId);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (message.receiverId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.markMessageAsRead(messageId);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  // Sustainability metrics routes
  app.get("/api/properties/:propertyId/sustainability", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const propertyId = parseInt(req.params.propertyId);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const metrics = await storage.getSustainabilityMetric(propertyId);
      
      if (!metrics) {
        // Initialize with default values if not found
        const defaultMetrics = await storage.createSustainabilityMetric({
          propertyId,
          energyEfficiency: 50,
          waterConservation: 50,
          wasteReduction: 50,
        });
        return res.json(defaultMetrics);
      }
      
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/properties/:propertyId/sustainability", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const propertyId = parseInt(req.params.propertyId);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const existingMetrics = await storage.getSustainabilityMetric(propertyId);
      
      if (!existingMetrics) {
        // Create new metrics if they don't exist
        const validation = insertSustainabilityMetricSchema.safeParse({
          ...req.body,
          propertyId,
        });
        
        if (!validation.success) {
          return res.status(400).json({ message: "Invalid metrics data", errors: validation.error.errors });
        }
        
        const metrics = await storage.createSustainabilityMetric(validation.data);
        return res.status(201).json(metrics);
      }
      
      // Update existing metrics
      const updatedMetrics = await storage.updateSustainabilityMetric(existingMetrics.id, req.body);
      res.json(updatedMetrics);
    } catch (error) {
      next(error);
    }
  });

  // Routes for tasks
  app.get("/api/tasks", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      
      // Get all properties for this user
      const properties = await storage.getPropertiesByUser(userId);
      
      // Get tasks for all properties
      const allTasks = [];
      for (const property of properties) {
        const tasks = await storage.getTasksByProperty(property.id);
        allTasks.push(...tasks);
      }
      
      res.json(allTasks);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/tasks", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const validation = insertTaskSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid task data", errors: validation.error.errors });
      }
      
      // Check if the property belongs to the user
      const property = await storage.getProperty(validation.data.propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const task = await storage.createTask(validation.data);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/tasks/:id", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check if the property belongs to the user
      const property = await storage.getProperty(task.propertyId);
      
      if (!property || property.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteTask(taskId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Routes for sustainability metrics
  app.get("/api/sustainability", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      
      // Get all properties for this user
      const properties = await storage.getPropertiesByUser(userId);
      
      // Get sustainability metrics for all properties
      const allMetrics = [];
      for (const property of properties) {
        const metrics = await storage.getSustainabilityMetric(property.id);
        if (metrics) {
          allMetrics.push(metrics);
        }
      }
      
      res.json(allMetrics);
    } catch (error) {
      next(error);
    }
  });
  
  // Routes for bookings
  app.get("/api/bookings", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userRole = req.user.role?.toLowerCase();
      const isGuest = hasGuestRole(userRole);
      const isAdmin = hasAdminRole(userRole);
      const isPropertyOwner = hasPropertyOwnerRole(userRole);
      
      const userId = req.user.id;
      
      // Get all properties for this user
      const properties = await storage.getPropertiesByUser(userId);
      
      // Get bookings for all properties
      const allBookings = [];
      for (const property of properties) {
        const bookings = await storage.getBookingsByProperty(property.id);
        allBookings.push(...bookings);
      }
      
      res.json(allBookings);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/properties/:propertyId/bookings", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const propertyId = parseInt(req.params.propertyId);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const bookings = await storage.getBookingsByProperty(propertyId);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/bookings/:id", isAuthenticated, async (req, res, next) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      next(error);
    }
  });
  
  /**
   * Check if a booking has any conflicts with existing bookings
   * @param propertyId The property ID to check
   * @param checkIn The check-in date
   * @param checkOut The check-out date
   * @param excludeBookingId Optional booking ID to exclude from the check (for updates)
   */
  async function hasBookingConflict(
    propertyId: number, 
    checkIn: string | Date, 
    checkOut: string | Date,
    excludeBookingId?: number
  ): Promise<boolean> {
    console.log(`[Bookings] Checking conflicts for property #${propertyId} from ${checkIn} to ${checkOut}`);
    
    // Convert string dates to Date objects if needed
    const checkInDate = checkIn instanceof Date ? checkIn : new Date(checkIn);
    const checkOutDate = checkOut instanceof Date ? checkOut : new Date(checkOut);
    
    // Get all confirmed bookings for this property
    const existingBookings = await storage.getBookingsByProperty(propertyId);
    const confirmedBookings = existingBookings.filter(
      booking => booking.status === 'confirmed' && 
      (excludeBookingId === undefined || booking.id !== excludeBookingId)
    );
    
    // Check for any overlapping dates
    for (const booking of confirmedBookings) {
      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);
      
      // Check if dates overlap
      // A conflict occurs when:
      // 1. New check-in date falls between an existing booking's dates, or
      // 2. New check-out date falls between an existing booking's dates, or
      // 3. New booking completely encompasses an existing booking
      if (
        (checkInDate >= existingCheckIn && checkInDate < existingCheckOut) || 
        (checkOutDate > existingCheckIn && checkOutDate <= existingCheckOut) ||
        (checkInDate <= existingCheckIn && checkOutDate >= existingCheckOut)
      ) {
        console.log(`[Bookings] Conflict found with booking #${booking.id} (${booking.checkIn} - ${booking.checkOut})`);
        return true;
      }
    }
    
    console.log(`[Bookings] No conflicts found for property #${propertyId}`);
    return false;
  }

  // TEMPORARY DEVELOPMENT ENDPOINT: Directly approve a property for testing
  app.get("/api/dev/approve-property/:id", async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.id);
      console.log(`[DEV] Approving property ${propertyId} for testing purposes`);
      
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        console.log(`[DEV] Property ${propertyId} not found`);
        return res.status(404).json({ message: "Property not found" });
      }
      
      const updatedProperty = await storage.updateProperty(propertyId, { 
        approvalStatus: 'APPROVED',
        adminNotes: 'Approved via development endpoint for testing'
      });
      
      console.log(`[DEV] Property ${propertyId} approved successfully:`, updatedProperty);
      res.json(updatedProperty);
    } catch (error) {
      console.error(`[DEV] Error approving property:`, error);
      next(error);
    }
  });
  
  // Create a new booking
  app.post("/api/bookings", isGuestOrPropertyOwner, async (req, res, next) => {
    try {
      console.log("[Bookings] Creating new booking:", req.body);
      console.log(`[Bookings] User role: ${req.user?.role}, UserID: ${req.user?.id}`);
      
      if (!req.user || !req.user.id) {
        console.log("[Bookings] User not authenticated properly");
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.id;
      
      const validation = insertBookingSchema.safeParse({
        ...req.body,
        userId: req.body.userId || userId,
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: validation.error.errors 
        });
      }
      
      // Check for booking conflicts
      const hasConflict = await hasBookingConflict(
        validation.data.propertyId,
        validation.data.checkIn,
        validation.data.checkOut
      );
      
      if (hasConflict) {
        return res.status(409).json({ 
          message: "Booking conflict detected", 
          error: "The selected dates conflict with an existing booking" 
        });
      }
      
      const newBooking = await storage.createBooking(validation.data);
      console.log("[Bookings] Booking created successfully:", newBooking);
      res.status(201).json(newBooking);
    } catch (error) {
      console.error("[Bookings] Error creating booking:", error);
      next(error);
    }
  });
  
  // Create a booking for a specific property (alternate endpoint)
  app.post("/api/properties/:propertyId/bookings", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const propertyId = parseInt(req.params.propertyId);
      console.log(`[Bookings] Creating new booking for property #${propertyId}:`, req.body);
      
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const validation = insertBookingSchema.safeParse({
        ...req.body,
        propertyId,
        userId: req.user.id,
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: validation.error.errors 
        });
      }
      
      // Check for booking conflicts
      const hasConflict = await hasBookingConflict(
        propertyId,
        validation.data.checkIn,
        validation.data.checkOut
      );
      
      if (hasConflict) {
        return res.status(409).json({ 
          message: "Booking conflict detected", 
          error: "The selected dates conflict with an existing booking" 
        });
      }
      
      const newBooking = await storage.createBooking(validation.data);
      console.log("[Bookings] Booking created successfully:", newBooking);
      res.status(201).json(newBooking);
    } catch (error) {
      console.error(`[Bookings] Error creating booking for property #${req.params.propertyId}:`, error);
      next(error);
    }
  });
  
  // Update a booking
  app.patch("/api/bookings/:id", isAuthenticated, async (req, res, next) => {
    try {
      const bookingId = parseInt(req.params.id);
      console.log(`[Bookings] Updating booking #${bookingId}:`, req.body);
      
      // First get the current booking to check property and dates
      const currentBooking = await storage.getBooking(bookingId);
      
      if (!currentBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // If updating dates or property, check for conflicts
      if (
        (req.body.checkIn && req.body.checkIn !== currentBooking.checkIn) ||
        (req.body.checkOut && req.body.checkOut !== currentBooking.checkOut) ||
        (req.body.propertyId && req.body.propertyId !== currentBooking.propertyId)
      ) {
        // Only do conflict check if necessary
        const propertyId = req.body.propertyId || currentBooking.propertyId;
        const checkIn = req.body.checkIn || currentBooking.checkIn;
        const checkOut = req.body.checkOut || currentBooking.checkOut;
        
        console.log(`[Bookings] Checking conflicts for updated booking #${bookingId}`);
        
        const hasConflict = await hasBookingConflict(
          propertyId,
          checkIn,
          checkOut,
          bookingId // Exclude current booking from conflict check
        );
        
        if (hasConflict) {
          return res.status(409).json({ 
            message: "Booking conflict detected", 
            error: "The selected dates conflict with an existing booking" 
          });
        }
      }
      
      const updatedBooking = await storage.updateBooking(bookingId, req.body);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking could not be updated" });
      }
      
      console.log("[Bookings] Booking updated successfully:", updatedBooking);
      res.json(updatedBooking);
    } catch (error) {
      console.error(`[Bookings] Error updating booking #${req.params.id}:`, error);
      next(error);
    }
  });
  
  // Cancel a booking
  app.post("/api/bookings/:id/cancel", isGuestOrPropertyOwner, async (req, res, next) => {
    try {
      const bookingId = parseInt(req.params.id);
      console.log(`[Bookings] Cancelling booking #${bookingId}`);
      
      const cancelled = await storage.cancelBooking(bookingId);
      
      if (!cancelled) {
        return res.status(404).json({ message: "Booking not found or couldn't be cancelled" });
      }
      
      console.log(`[Bookings] Booking #${bookingId} cancelled successfully`);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(`[Bookings] Error cancelling booking #${req.params.id}:`, error);
      next(error);
    }
  });

  // Reviews routes
  app.get("/api/reviews/property/:propertyId", async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      console.log(`[Reviews] Fetching reviews for property #${propertyId}`);
      
      const reviews = await storage.getReviewsByProperty(propertyId);
      
      // Join with user data to get reviewer details
      const reviewsWithUserDetails = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            authorName: user?.fullName || user?.username || 'Anonymous',
            authorImage: user?.profileImage
          };
        })
      );
      
      console.log(`[Reviews] Found ${reviewsWithUserDetails.length} reviews for property #${propertyId}`);
      res.json(reviewsWithUserDetails);
    } catch (error) {
      console.error(`[Reviews] Error fetching property reviews:`, error);
      next(error);
    }
  });
  
  app.get("/api/reviews/vendor/:vendorId", async (req, res, next) => {
    try {
      const vendorId = parseInt(req.params.vendorId);
      console.log(`[Reviews] Fetching reviews for vendor #${vendorId}`);
      
      const reviews = await storage.getReviewsByVendor(vendorId);
      
      // Join with user data to get reviewer details
      const reviewsWithUserDetails = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            authorName: user?.fullName || user?.username || 'Anonymous',
            authorImage: user?.profileImage
          };
        })
      );
      
      console.log(`[Reviews] Found ${reviewsWithUserDetails.length} reviews for vendor #${vendorId}`);
      res.json(reviewsWithUserDetails);
    } catch (error) {
      console.error(`[Reviews] Error fetching vendor reviews:`, error);
      next(error);
    }
  });
  
  app.get("/api/reviews/user", isAuthenticated, async (req, res, next) => {
    try {
      console.log(`[Reviews] Fetching reviews by user #${req.user!.id}`);
      
      const reviews = await storage.getReviewsByUser(req.user!.id);
      
      console.log(`[Reviews] Found ${reviews.length} reviews authored by user #${req.user!.id}`);
      res.json(reviews);
    } catch (error) {
      console.error(`[Reviews] Error fetching user reviews:`, error);
      next(error);
    }
  });
  
  app.post("/api/reviews", isAuthenticated, async (req, res, next) => {
    try {
      console.log(`[Reviews] Creating new review from user #${req.user!.id}`);
      
      // Validate review data using zod schema
      const validation = insertReviewSchema.safeParse(req.body);
      
      if (!validation.success) {
        console.error(`[Reviews] Invalid review data:`, validation.error.errors);
        return res.status(400).json({ 
          message: "Invalid review data", 
          errors: validation.error.errors 
        });
      }
      
      const reviewData = validation.data;
      
      // Additional validations based on review type
      if (reviewData.type === 'PROPERTY') {
        if (!reviewData.propertyId) {
          return res.status(400).json({ error: "Property ID is required for property reviews" });
        }
        
        // Check if property exists and is approved
        const property = await storage.getProperty(reviewData.propertyId);
        if (!property) {
          return res.status(404).json({ error: "Property not found" });
        }
        
        if (property.approvalStatus !== 'APPROVED') {
          return res.status(403).json({ error: "Cannot review a property that is not approved" });
        }
        
        // If review is linked to a booking, verify the booking exists and belongs to the user
        if (reviewData.bookingId) {
          const booking = await storage.getBooking(reviewData.bookingId);
          if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
          }
          
          if (booking.propertyId !== reviewData.propertyId) {
            return res.status(400).json({ error: "Booking is not for the specified property" });
          }
        }
      } else if (reviewData.type === 'VENDOR') {
        if (!reviewData.vendorId) {
          return res.status(400).json({ error: "Vendor ID is required for vendor reviews" });
        }
        
        // Check if vendor exists and is approved
        const vendor = await storage.getVendor(reviewData.vendorId);
        if (!vendor) {
          return res.status(404).json({ error: "Vendor not found" });
        }
        
        if (vendor.approvalStatus !== 'APPROVED') {
          return res.status(403).json({ error: "Cannot review a vendor that is not approved" });
        }
        
        // If review is linked to a task, verify the task exists
        if (reviewData.taskId) {
          const task = await storage.getTask(reviewData.taskId);
          if (!task) {
            return res.status(404).json({ error: "Task not found" });
          }
        }
      } else {
        return res.status(400).json({ error: "Invalid review type" });
      }
      
      // Create the review
      const review = await storage.createReview({
        ...reviewData,
        userId: req.user!.id,
      });
      
      // Update property or vendor rating if necessary
      if (reviewData.type === 'PROPERTY' && reviewData.propertyId) {
        // Get all reviews for this property to calculate new average rating
        const propertyReviews = await storage.getReviewsByProperty(reviewData.propertyId);
        const totalRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / propertyReviews.length;
        
        // Update property with new rating
        await storage.updateProperty(reviewData.propertyId, {
          rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
        });
        
        console.log(`[Reviews] Updated property #${reviewData.propertyId} rating to ${Math.round(averageRating * 10) / 10}`);
      } else if (reviewData.type === 'VENDOR' && reviewData.vendorId) {
        // Get all reviews for this vendor to calculate new average rating
        const vendorReviews = await storage.getReviewsByVendor(reviewData.vendorId);
        const totalRating = vendorReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / vendorReviews.length;
        
        // Update vendor with new rating and review count
        await storage.updateVendor(reviewData.vendorId, {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviewCount: vendorReviews.length
        });
        
        console.log(`[Reviews] Updated vendor #${reviewData.vendorId} rating to ${Math.round(averageRating * 10) / 10} (${vendorReviews.length} reviews)`);
      }
      
      console.log(`[Reviews] Created review #${review.id} successfully`);
      res.status(201).json(review);
    } catch (error) {
      console.error(`[Reviews] Error creating review:`, error);
      next(error);
    }
  });
  
  app.delete("/api/reviews/:reviewId", isAuthenticated, async (req, res, next) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      console.log(`[Reviews] Request to delete review #${reviewId} by user #${req.user!.id}`);
      
      // Check if the review exists and belongs to the current user
      const review = await storage.getReview(reviewId);
      
      if (!review) {
        console.log(`[Reviews] Review #${reviewId} not found`);
        return res.status(404).json({ error: "Review not found" });
      }
      
      // Only allow the review author or admin to delete it
      if (review.userId !== req.user!.id && !hasAdminRole(req.user?.role)) {
        console.log(`[Reviews] User #${req.user!.id} not authorized to delete review #${reviewId}`);
        return res.status(403).json({ error: "Not authorized to delete this review" });
      }
      
      const deleted = await storage.deleteReview(reviewId);
      
      if (!deleted) {
        console.log(`[Reviews] Failed to delete review #${reviewId}`);
        return res.status(404).json({ error: "Failed to delete review" });
      }
      
      // Update property or vendor rating after deletion
      if (review.type === 'PROPERTY' && review.propertyId) {
        const propertyReviews = await storage.getReviewsByProperty(review.propertyId);
        
        if (propertyReviews.length > 0) {
          const totalRating = propertyReviews.reduce((sum, r) => sum + r.rating, 0);
          const averageRating = totalRating / propertyReviews.length;
          
          await storage.updateProperty(review.propertyId, {
            rating: Math.round(averageRating * 10) / 10
          });
          
          console.log(`[Reviews] Updated property #${review.propertyId} rating to ${Math.round(averageRating * 10) / 10} after review deletion`);
        } else {
          // No reviews left, set default values
          await storage.updateProperty(review.propertyId, {
            rating: null
          });
          
          console.log(`[Reviews] Reset property #${review.propertyId} rating to null (no reviews)`);
        }
      } else if (review.type === 'VENDOR' && review.vendorId) {
        const vendorReviews = await storage.getReviewsByVendor(review.vendorId);
        
        if (vendorReviews.length > 0) {
          const totalRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0);
          const averageRating = totalRating / vendorReviews.length;
          
          await storage.updateVendor(review.vendorId, {
            rating: Math.round(averageRating * 10) / 10,
            reviewCount: vendorReviews.length
          });
          
          console.log(`[Reviews] Updated vendor #${review.vendorId} rating to ${Math.round(averageRating * 10) / 10} (${vendorReviews.length} reviews) after review deletion`);
        } else {
          // No reviews left, set default values
          await storage.updateVendor(review.vendorId, {
            rating: null,
            reviewCount: 0
          });
          
          console.log(`[Reviews] Reset vendor #${review.vendorId} rating to null (no reviews)`);
        }
      }
      
      console.log(`[Reviews] Successfully deleted review #${reviewId}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`[Reviews] Error deleting review #${req.params.reviewId}:`, error);
      next(error);
    }
  });

  app.post("/api/sustainability", isAuthenticated, async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const validation = insertSustainabilityMetricSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid sustainability metrics data", errors: validation.error.errors });
      }
      
      // Check if the property belongs to the user
      const property = await storage.getProperty(validation.data.propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Check if metrics already exist for this property
      const existingMetrics = await storage.getSustainabilityMetric(validation.data.propertyId);
      
      if (existingMetrics) {
        // Update existing metrics
        const updatedMetrics = await storage.updateSustainabilityMetric(existingMetrics.id, validation.data);
        return res.json(updatedMetrics);
      }
      
      // Create new metrics
      const metrics = await storage.createSustainabilityMetric(validation.data);
      res.status(201).json(metrics);
    } catch (error) {
      next(error);
    }
  });
  


  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active connections by user ID
  const activeConnections = new Map<number, WebSocket[]>();
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('[WebSocket] New connection established');
    let userId: number | null = null;
    
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('[WebSocket] Received message:', data);
        
        // Handle authentication
        if (data.type === 'auth') {
          userId = parseInt(data.userId);
          if (!userId || isNaN(userId)) {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Invalid authentication' 
            }));
            return;
          }
          
          // Store connection by user ID
          if (!activeConnections.has(userId)) {
            activeConnections.set(userId, []);
          }
          activeConnections.get(userId)!.push(ws);
          
          ws.send(JSON.stringify({ 
            type: 'auth_success',
            userId 
          }));
          
          console.log(`[WebSocket] User ${userId} authenticated`);
          return;
        }
        
        // For any other message type, require authentication
        if (!userId) {
          ws.send(JSON.stringify({ 
            type: 'error',
            message: 'Authentication required' 
          }));
          return;
        }
        
        // Handle new message
        if (data.type === 'new_message') {
          const { receiverId, content } = data;
          if (!receiverId || !content) {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Invalid message data' 
            }));
            return;
          }
          
          // Save message to database
          const messageData = {
            senderId: userId,
            receiverId,
            content,
            isRead: false
          };
          
          // Insert the message using storage
          const savedMessage = await storage.createMessage(messageData);
          
          // Add sender and receiver info
          const sender = await storage.getUser(userId);
          const receiver = await storage.getUser(receiverId);
          
          const messageWithDetails = {
            ...savedMessage,
            sender: sender ? {
              id: sender.id,
              username: sender.username,
              fullName: sender.fullName
            } : null,
            receiver: receiver ? {
              id: receiver.id,
              username: receiver.username,
              fullName: receiver.fullName
            } : null
          };
          
          // Send confirmation back to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            message: messageWithDetails
          }));
          
          // Forward message to receiver if they are online
          if (activeConnections.has(receiverId)) {
            activeConnections.get(receiverId)!.forEach(receiverWs => {
              if (receiverWs.readyState === WebSocket.OPEN) {
                receiverWs.send(JSON.stringify({
                  type: 'new_message',
                  message: messageWithDetails
                }));
              }
            });
          }
        }
        
        // Handle message read status
        if (data.type === 'mark_read') {
          const { messageId } = data;
          if (!messageId) {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Invalid message ID' 
            }));
            return;
          }
          
          const message = await storage.getMessage(messageId);
          if (!message) {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Message not found' 
            }));
            return;
          }
          
          // Only the receiver can mark a message as read
          if (message.receiverId !== userId) {
            ws.send(JSON.stringify({ 
              type: 'error',
              message: 'Permission denied' 
            }));
            return;
          }
          
          // Mark message as read
          const success = await storage.markMessageAsRead(messageId);
          
          if (success) {
            // Notify sender if they're online
            if (activeConnections.has(message.senderId)) {
              activeConnections.get(message.senderId)!.forEach(senderWs => {
                if (senderWs.readyState === WebSocket.OPEN) {
                  senderWs.send(JSON.stringify({
                    type: 'message_read',
                    messageId
                  }));
                }
              });
            }
          }
          
          ws.send(JSON.stringify({
            type: 'mark_read_status',
            success,
            messageId
          }));
        }
        
      } catch (error) {
        console.error('[WebSocket] Error handling message:', error);
        ws.send(JSON.stringify({ 
          type: 'error',
          message: 'Failed to process message' 
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('[WebSocket] Connection closed');
      if (userId) {
        // Remove this connection from active connections
        const userConnections = activeConnections.get(userId);
        if (userConnections) {
          const index = userConnections.indexOf(ws);
          if (index !== -1) {
            userConnections.splice(index, 1);
          }
          // If no more connections for this user, remove the user entry
          if (userConnections.length === 0) {
            activeConnections.delete(userId);
          }
        }
      }
    });
  });

  return httpServer;
}

// Type declaration to allow custom session properties
declare module "express-session" {
  interface Session {
    userId?: number;
    testKey?: string;
  }
}

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, UserRole, ApprovalStatus } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Define a fixed session secret to ensure consistency across restarts
  const SESSION_SECRET = process.env.SESSION_SECRET || "argento-homes-secret-key-fixed";
  
  console.log("[Auth] Setting up authentication with session secret");
  
  // Session properties are already declared at the top of the file
  
  const sessionSettings: session.SessionOptions = {
    secret: SESSION_SECRET,
    resave: true, // Changed to true to ensure session is saved on each request
    saveUninitialized: true, // Store new sessions
    store: storage.sessionStore,
    name: "argento.sid", // Explicitly name the session cookie
    cookie: {
      secure: false, // Always false for non-HTTPS development
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      path: "/"
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[Passport] Attempting authentication for user: ${username}`);
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          console.log(`[Passport] User not found: ${username}`);
          return done(null, false, { message: "Invalid credentials" });
        }
        
        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
          console.log(`[Passport] Password mismatch for user: ${username}`);
          return done(null, false, { message: "Invalid credentials" });
        }
        
        console.log(`[Passport] Authentication successful for user: ${username} (ID: ${user.id})`);
        return done(null, user);
      } catch (error) {
        console.error(`[Passport] Error during authentication:`, error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user: any, done) => {
    if (!user || !user.id) {
      console.error('[Serialize] Invalid user object:', user);
      return done(new Error('Invalid user object'));
    }
    console.log(`[Serialize] Serializing user ID: ${user.id}`);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: any, done) => {
    try {
      console.log(`[Deserialize] Deserializing user ID: ${id}`);
      // Convert id to number if it's a string, as it might be serialized as string
      const userId = typeof id === 'string' ? parseInt(id, 10) : id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        console.error(`[Deserialize] User not found for ID: ${id}`);
        return done(null, false);
      }
      
      console.log(`[Deserialize] User found for ID: ${id}, Username: ${user.username}`);
      done(null, user);
    } catch (error) {
      console.error('[Deserialize] Error:', error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });
      
      // If the user is registering as a vendor, create a default vendor profile
      if (user.role.toLowerCase() === UserRole.VENDOR.toLowerCase()) {
        console.log(`[Register] Creating default vendor profile for user ${user.id}`);
        try {
          await storage.createVendor({
            userId: user.id,
            businessName: '', // Empty business name to be filled out later
            category: 'other', // Default category
            description: '',   // Empty description to be filled out later
            rating: 0,
            reviewCount: 0,
            approvalStatus: 'PENDING', // Default to pending approval
            adminNotes: '',
          });
          console.log(`[Register] Vendor profile created successfully for user ${user.id}`);
        } catch (error) {
          console.error(`[Register] Error creating vendor profile:`, error);
          // Continue with login even if vendor profile creation fails
          // The user can complete their profile later
        }
      }

      req.login(user, (err) => {
        if (err) return next(err);
        
        // Don't expose the password hash in response
        const { password, ...userResponse } = user;
        res.status(201).json(userResponse);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log(`[Login] Login attempt for user: ${req.body.username}`);
    
    passport.authenticate("local", (err: any, user: SelectUser | false, info: { message: string } | undefined) => {
      if (err) {
        console.error(`[Login] Error during login:`, err);
        return next(err);
      }
      
      if (!user) {
        console.log(`[Login] Authentication failed for user: ${req.body.username}`);
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      console.log(`[Login] User authenticated, establishing session for user ID: ${user.id}, role: ${user.role}`);
      
      req.login(user, (err) => {
        if (err) {
          console.error(`[Login] Error during session creation:`, err);
          return next(err);
        }
        
        console.log(`[Login] Session created successfully for user ID: ${user.id}`);
        console.log(`[Login] Session ID: ${req.sessionID}`);
        console.log(`[Login] Session:`, req.session);
        
        // Don't expose the password hash in response
        const { password, ...userResponse } = user;
        
        // Set a test variable to ensure session is working
        req.session.testKey = 'test-value';
        req.session.userId = user.id;
        
        console.log(`[Login] Updated session:`, req.session);
        
        // Explicitly save the session to ensure it's stored
        req.session.save(err => {
          if (err) {
            console.error(`[Login] Error saving session:`, err);
            return next(err);
          }
          
          console.log(`[Login] Session saved successfully`);
          res.status(200).json(userResponse);
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  
  // Check if the user has admin permissions
  app.get("/api/user/permissions", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        isAuthenticated: false,
        message: "Not authenticated" 
      });
    }
    
    // Handle both uppercase and lowercase role values
    const userRole = req.user?.role?.toLowerCase();
    const isAdmin = userRole === UserRole.ADMIN.toLowerCase() || userRole === UserRole.DEVELOPER.toLowerCase();
    const isVendor = userRole === UserRole.VENDOR.toLowerCase();
    const isPropertyOwner = userRole === UserRole.PROPERTY_OWNER.toLowerCase();

    res.json({
      isAuthenticated: true,
      isAdmin,
      isVendor,
      isPropertyOwner,
      role: req.user?.role,
      canApproveReject: isAdmin,
      canManageProperties: isAdmin || isPropertyOwner,
      canManageVendors: isAdmin,
      canAccessAdminPanel: isAdmin
    });
  });

  app.get("/api/user", async (req, res) => {
    console.log(`[GetUser] Session ID: ${req.sessionID}`);
    console.log(`[GetUser] Session data:`, req.session);
    console.log(`[GetUser] Is authenticated: ${req.isAuthenticated()}`);
    console.log(`[GetUser] User in session:`, req.user ? `ID: ${req.user.id}` : 'None');
    
    // Check if we have a userId in the session but not authenticated through Passport
    if (!req.isAuthenticated() && req.session.userId) {
      console.log(`[GetUser] Found userId ${req.session.userId} in session, attempting to load user`);
      try {
        const user = await storage.getUser(Number(req.session.userId));
        if (user) {
          console.log(`[GetUser] Found user in database, logging in`);
          req.login(user, (err) => {
            if (err) {
              console.error(`[GetUser] Error logging in with session userId: ${err}`);
              return res.sendStatus(401);
            }
            const { password, ...userResponse } = user;
            return res.json(userResponse);
          });
          return; // Return here to prevent further execution
        }
      } catch (error) {
        console.error(`[GetUser] Error retrieving user from storage: ${error}`);
      }
    }
    
    if (!req.isAuthenticated()) {
      console.log(`[GetUser] User not authenticated, returning 401`);
      return res.sendStatus(401);
    }
    
    console.log(`[GetUser] User authenticated, returning user data for ID: ${req.user.id}`);
    
    // Don't expose the password hash in response
    const { password, ...userResponse } = req.user as SelectUser;
    res.json(userResponse);
  });
}

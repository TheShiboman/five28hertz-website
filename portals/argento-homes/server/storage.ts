import { 
  users, type User, type InsertUser,
  properties, type Property, type InsertProperty,
  tasks, type Task, type InsertTask,
  vendors, type Vendor, type InsertVendor, 
  messages, type Message, type InsertMessage,
  sustainabilityMetrics, type SustainabilityMetric, type InsertSustainabilityMetric,
  bookings, type Booking, type InsertBooking,
  reviews, type Review, type InsertReview,
  UserRole
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq, and, or } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByUser(userId: number): Promise<Property[]>;
  getAllProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  getTasksByProperty(propertyId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Vendor methods
  getVendor(id: number): Promise<Vendor | undefined>;
  getVendorByUserId(userId: number): Promise<Vendor | undefined>;
  getVendorsByCategory(category: string): Promise<Vendor[]>;
  getAllVendors(): Promise<Vendor[]>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<Vendor>): Promise<Vendor | undefined>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByUser(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  
  // Sustainability metrics methods
  getSustainabilityMetric(propertyId: number): Promise<SustainabilityMetric | undefined>;
  createSustainabilityMetric(metric: InsertSustainabilityMetric): Promise<SustainabilityMetric>;
  updateSustainabilityMetric(id: number, metric: Partial<SustainabilityMetric>): Promise<SustainabilityMetric | undefined>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByProperty(propertyId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<Booking>): Promise<Booking | undefined>;
  cancelBooking(id: number): Promise<boolean>;
  
  // Review methods
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByProperty(propertyId: number): Promise<Review[]>;
  getReviewsByVendor(vendorId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: any; // Using any for sessionStore as express-session types are complex
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private tasks: Map<number, Task>;
  private vendors: Map<number, Vendor>;
  private messages: Map<number, Message>;
  private sustainabilityMetrics: Map<number, SustainabilityMetric>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  
  currentUserId: number;
  currentPropertyId: number;
  currentTaskId: number;
  currentVendorId: number;
  currentMessageId: number;
  currentMetricId: number;
  currentBookingId: number;
  currentReviewId: number;
  sessionStore: any; // Using any for sessionStore as express-session types are complex

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.tasks = new Map();
    this.vendors = new Map();
    this.messages = new Map();
    this.sustainabilityMetrics = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentTaskId = 1;
    this.currentVendorId = 1;
    this.currentMessageId = 1;
    this.currentMetricId = 1;
    this.currentBookingId = 1;
    this.currentReviewId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId,
    );
  }
  
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const now = new Date();
    const property: Property = { ...insertProperty, id, createdAt: now };
    this.properties.set(id, property);
    return property;
  }
  
  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = await this.getProperty(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...updates };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  
  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }
  
  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getTasksByProperty(propertyId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.propertyId === propertyId,
    );
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const now = new Date();
    const task: Task = { ...insertTask, id, createdAt: now };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // Vendor methods
  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }
  
  async getVendorByUserId(userId: number): Promise<Vendor | undefined> {
    return Array.from(this.vendors.values()).find(
      (vendor) => vendor.userId === userId,
    );
  }
  
  async getVendorsByCategory(category: string): Promise<Vendor[]> {
    return Array.from(this.vendors.values()).filter(
      (vendor) => vendor.category === category,
    );
  }
  
  async getAllVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }
  
  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = this.currentVendorId++;
    const now = new Date();
    const vendor: Vendor = { ...insertVendor, id, createdAt: now };
    this.vendors.set(id, vendor);
    return vendor;
  }
  
  async updateVendor(id: number, updates: Partial<Vendor>): Promise<Vendor | undefined> {
    const vendor = await this.getVendor(id);
    if (!vendor) return undefined;
    
    const updatedVendor = { ...vendor, ...updates };
    this.vendors.set(id, updatedVendor);
    return updatedVendor;
  }
  
  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId,
    );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const message: Message = { ...insertMessage, id, createdAt: now };
    this.messages.set(id, message);
    return message;
  }
  
  async markMessageAsRead(id: number): Promise<boolean> {
    const message = await this.getMessage(id);
    if (!message) return false;
    
    message.isRead = true;
    this.messages.set(id, message);
    return true;
  }
  
  // Sustainability metrics methods
  async getSustainabilityMetric(propertyId: number): Promise<SustainabilityMetric | undefined> {
    return Array.from(this.sustainabilityMetrics.values()).find(
      (metric) => metric.propertyId === propertyId,
    );
  }
  
  async createSustainabilityMetric(insertMetric: InsertSustainabilityMetric): Promise<SustainabilityMetric> {
    const id = this.currentMetricId++;
    const now = new Date();
    const metric: SustainabilityMetric = { 
      ...insertMetric, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.sustainabilityMetrics.set(id, metric);
    return metric;
  }
  
  async updateSustainabilityMetric(id: number, updates: Partial<SustainabilityMetric>): Promise<SustainabilityMetric | undefined> {
    const metric = await this.getSustainabilityMetric(id);
    if (!metric) return undefined;
    
    const updatedMetric = { 
      ...metric, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.sustainabilityMetrics.set(id, updatedMetric);
    return updatedMetric;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async getBookingsByProperty(propertyId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.propertyId === propertyId,
    );
  }
  
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const now = new Date();
    const booking: Booking = { ...insertBooking, id, createdAt: now };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = await this.getBooking(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  async cancelBooking(id: number): Promise<boolean> {
    const booking = await this.getBooking(id);
    if (!booking) return false;
    
    booking.status = "cancelled";
    this.bookings.set(id, booking);
    return true;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async getReviewsByProperty(propertyId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.propertyId === propertyId && review.type === 'PROPERTY'
    );
  }
  
  async getReviewsByVendor(vendorId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.vendorId === vendorId && review.type === 'VENDOR'
    );
  }
  
  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const now = new Date();
    const review: Review = { ...insertReview, id, createdAt: now };
    this.reviews.set(id, review);
    return review;
  }
  
  async updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined> {
    const review = await this.getReview(id);
    if (!review) return undefined;
    
    const updatedReview = { ...review, ...updates };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }
  
  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    console.log("[Database] Setting up PostgreSQL session store");
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session', // Explicitly name the session table
      schemaName: 'public',
      ttl: 7 * 24 * 60 * 60 // 7 days in seconds
    });
    
    console.log("[Database] Session store initialized");
    
    // Initialize database with sample data if needed
    this.initializeData();
  }
  
  // Method to seed initial data if needed
  private async initializeData() {
    try {
      // Check if we have any vendors
      const allVendors = await this.getAllVendors();
      
      if (allVendors.length === 0) {
        console.log('Initializing database with sample vendors...');
        
        // First create some users for vendors
        const cleaningVendorUser = await this.createUser({
          username: 'cleaningpro',
          password: '$2b$10$o4XnRmoDkbpfX0W7wFyoYeQAqNOZDDk/Zs13FJqnC.PQUoDmvMTtG', // hashed 'password123'
          email: 'cleaning@example.com',
          fullName: 'Professional Cleaning Service',
          role: 'VENDOR' as any,
          phone: '555-123-4567',
          profileImage: null
        });
        
        const maintenanceVendorUser = await this.createUser({
          username: 'maintenancepro',
          password: '$2b$10$o4XnRmoDkbpfX0W7wFyoYeQAqNOZDDk/Zs13FJqnC.PQUoDmvMTtG', // hashed 'password123'
          email: 'maintenance@example.com',
          fullName: 'Property Maintenance Experts',
          role: 'VENDOR' as any,
          phone: '555-987-6543',
          profileImage: null
        });
        
        const landscapingVendorUser = await this.createUser({
          username: 'landscapepro',
          password: '$2b$10$o4XnRmoDkbpfX0W7wFyoYeQAqNOZDDk/Zs13FJqnC.PQUoDmvMTtG', // hashed 'password123'
          email: 'landscape@example.com',
          fullName: 'Green Gardens Landscaping',
          role: 'VENDOR' as any,
          phone: '555-456-7890',
          profileImage: null
        });
        
        // Then create vendor profiles
        await this.createVendor({
          userId: cleaningVendorUser.id,
          category: 'cleaning',
          description: 'Professional cleaning services for vacation rentals, specializing in deep cleaning, turnover services, and eco-friendly options.',
          rating: 90,
          reviewCount: 48
        });
        
        await this.createVendor({
          userId: maintenanceVendorUser.id,
          category: 'maintenance',
          description: 'Comprehensive property maintenance including plumbing, electrical, HVAC, and general repairs for vacation rentals.',
          rating: 85,
          reviewCount: 32
        });
        
        await this.createVendor({
          userId: landscapingVendorUser.id,
          category: 'landscaping',
          description: 'Professional landscaping and yard maintenance services to keep your property looking its best all year round.',
          rating: 95,
          reviewCount: 27
        });
        
        console.log('Sample vendors created successfully!');
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      role: insertUser.role as any, // Temporary workaround for type issue
      profileImage: insertUser.profileImage || null,
      phone: insertUser.phone || null
    }).returning();
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }
  
  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return db.select().from(properties).where(eq(properties.userId, userId));
  }
  
  async getAllProperties(): Promise<Property[]> {
    return db.select().from(properties);
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values({
      ...insertProperty,
      description: insertProperty.description || null,
      propertyType: insertProperty.propertyType || null,
      features: insertProperty.features || null,
      imageUrl: insertProperty.imageUrl || null,
      bedrooms: insertProperty.bedrooms || null,
      bathrooms: insertProperty.bathrooms || null,
      squareFeet: insertProperty.squareFeet || null,
      price: insertProperty.price || null,
      certificationProgress: insertProperty.certificationProgress || null
    }).returning();
    return property;
  }
  
  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const [property] = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, id))
      .returning();
    return property;
  }
  
  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.rowCount > 0;
  }
  
  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }
  
  async getTasksByProperty(propertyId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.propertyId, propertyId));
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values({
      ...insertTask,
      description: insertTask.description || null,
      dueDate: insertTask.dueDate || null
    }).returning();
    return task;
  }
  
  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount > 0;
  }
  
  // Vendor methods
  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor;
  }
  
  async getVendorByUserId(userId: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor;
  }
  
  async getVendorsByCategory(category: string): Promise<Vendor[]> {
    return db.select().from(vendors).where(eq(vendors.category, category));
  }
  
  async getAllVendors(): Promise<Vendor[]> {
    return db.select().from(vendors);
  }
  
  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const [vendor] = await db.insert(vendors).values({
      ...insertVendor,
      description: insertVendor.description || null,
      rating: insertVendor.rating || null,
      reviewCount: insertVendor.reviewCount || null
    }).returning();
    return vendor;
  }
  
  async updateVendor(id: number, updates: Partial<Vendor>): Promise<Vendor | undefined> {
    const [vendor] = await db
      .update(vendors)
      .set(updates)
      .where(eq(vendors.id, id))
      .returning();
    return vendor;
  }
  
  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }
  
  async getMessagesByUser(userId: number): Promise<Message[]> {
    return db.select().from(messages).where(
      or(
        eq(messages.senderId, userId),
        eq(messages.receiverId, userId)
      )
    );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values({
      ...insertMessage,
      isRead: insertMessage.isRead || false
    }).returning();
    return message;
  }
  
  async markMessageAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id));
    return result.rowCount > 0;
  }
  
  // Sustainability metrics methods
  async getSustainabilityMetric(propertyId: number): Promise<SustainabilityMetric | undefined> {
    const [metric] = await db
      .select()
      .from(sustainabilityMetrics)
      .where(eq(sustainabilityMetrics.propertyId, propertyId));
    return metric;
  }
  
  async createSustainabilityMetric(insertMetric: InsertSustainabilityMetric): Promise<SustainabilityMetric> {
    const now = new Date();
    const [metric] = await db.insert(sustainabilityMetrics).values({
      ...insertMetric,
      energyEfficiency: insertMetric.energyEfficiency || null,
      waterConservation: insertMetric.waterConservation || null,
      wasteReduction: insertMetric.wasteReduction || null,
      updatedAt: now
    }).returning();
    return metric;
  }
  
  async updateSustainabilityMetric(id: number, updates: Partial<SustainabilityMetric>): Promise<SustainabilityMetric | undefined> {
    const [metric] = await db
      .update(sustainabilityMetrics)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(sustainabilityMetrics.id, id))
      .returning();
    return metric;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }
  
  async getBookingsByProperty(propertyId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.propertyId, propertyId));
  }
  
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values({
      ...insertBooking,
      status: insertBooking.status || 'pending',
      guestPhone: insertBooking.guestPhone || null,
      numGuests: insertBooking.numGuests || null,
      notes: insertBooking.notes || null
    }).returning();
    return booking;
  }
  
  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }
  
  async cancelBooking(id: number): Promise<boolean> {
    const result = await db
      .update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.id, id));
    return result.rowCount > 0;
  }
  
  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }
  
  async getReviewsByProperty(propertyId: number): Promise<Review[]> {
    return db.select().from(reviews).where(
      and(
        eq(reviews.propertyId, propertyId),
        eq(reviews.type, 'PROPERTY')
      )
    );
  }
  
  async getReviewsByVendor(vendorId: number): Promise<Review[]> {
    return db.select().from(reviews).where(
      and(
        eq(reviews.vendorId, vendorId),
        eq(reviews.type, 'VENDOR')
      )
    );
  }
  
  async getReviewsByUser(userId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.userId, userId));
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values({
      ...insertReview,
      propertyId: insertReview.propertyId || null,
      bookingId: insertReview.bookingId || null,
      vendorId: insertReview.vendorId || null,
      taskId: insertReview.taskId || null,
      comment: insertReview.comment || null
    }).returning();
    return review;
  }
  
  async updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set(updates)
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }
  
  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return result.rowCount > 0;
  }
}

// Change this to use DatabaseStorage
export const storage = new DatabaseStorage();

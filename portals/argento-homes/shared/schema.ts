import { pgTable, text, serial, integer, boolean, date, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define user roles
export const UserRole = {
  PROPERTY_OWNER: 'property_owner',
  VENDOR: 'vendor',
  DEVELOPER: 'developer',
  ADMIN: 'admin',
  GUEST: 'guest',
} as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().$type<keyof typeof UserRole>(),
  profileImage: text("profile_image"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ApprovalStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  propertyType: text("property_type").default("apartment"),
  features: text("features").array(), // Array of amenities/features
  imageUrl: text("image_url"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  squareFeet: integer("square_feet"),
  nightlyRate: integer("nightly_rate"),
  isCertified: boolean("is_certified").default(false),
  certificationProgress: integer("certification_progress").default(0),
  approvalStatus: text("approval_status").default(ApprovalStatus.PENDING).$type<keyof typeof ApprovalStatus>(),
  rating: real("rating"), // For average rating based on reviews
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  status: text("status").notNull(),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  businessName: text("business_name"),
  category: text("category").notNull(),
  description: text("description"),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  approvalStatus: text("approval_status").default(ApprovalStatus.PENDING).$type<keyof typeof ApprovalStatus>(),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sustainabilityMetrics = pgTable("sustainability_metrics", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().unique(),
  energyEfficiency: integer("energy_efficiency").default(0),
  waterConservation: integer("water_conservation").default(0),
  wasteReduction: integer("waste_reduction").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  numGuests: integer("num_guests").default(1),
  totalPrice: integer("total_price").notNull(),
  cleaningFee: integer("cleaning_fee").default(85),
  serviceFee: integer("service_fee").default(60),
  taxAmount: integer("tax_amount").default(0),
  paymentStatus: text("payment_status").default(PaymentStatus.PENDING).$type<keyof typeof PaymentStatus>(),
  paymentMethod: text("payment_method"),
  paymentDate: timestamp("payment_date"),
  transactionId: text("transaction_id"),
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ReviewType = {
  PROPERTY: 'PROPERTY',  // Guest reviews property
  VENDOR: 'VENDOR',      // Property owner reviews vendor
} as const;

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().$type<keyof typeof ReviewType>(),
  userId: integer("user_id").notNull(), // User who wrote the review
  rating: real("rating").notNull(), // Rating between 1-5 with decimals 
  comment: text("comment"),
  // For property reviews
  propertyId: integer("property_id"),
  bookingId: integer("booking_id"), // Linked to booking if it's a property review
  // For vendor reviews
  vendorId: integer("vendor_id"),
  taskId: integer("task_id"), // Linked to task if it's a vendor review
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertSustainabilityMetricSchema = createInsertSchema(sustainabilityMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertSustainabilityMetric = z.infer<typeof insertSustainabilityMetricSchema>;
export type SustainabilityMetric = typeof sustainabilityMetrics.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

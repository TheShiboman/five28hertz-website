import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  location: text("location"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("user").notNull(), // 'user', 'admin', 'moderator'
  timeCredits: integer("time_credits").default(0), // Time credits earned from exchanges
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Skills table
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
});

// BucketList table
export const bucketListItems = pgTable("bucket_list_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("planned").notNull(), // 'planned', 'in_progress', 'achieved'
  completed: boolean("completed").default(false).notNull(), // keeping for backward compatibility
  exchangeId: integer("exchange_id").references(() => exchanges.id),
  achievedDate: timestamp("achieved_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Exchanges table
export const exchanges = pgTable("exchanges", {
  id: serial("id").primaryKey(),
  requestorId: integer("requestor_id").references(() => users.id).notNull(),
  providerId: integer("provider_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(), // requested, accepted, completed, cancelled
  scheduledDate: timestamp("scheduled_date"),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  requestorConfirmed: boolean("requestor_confirmed").default(false),
  providerConfirmed: boolean("provider_confirmed").default(false),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  exchangeId: integer("exchange_id").references(() => exchanges.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community Posts table
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  images: json("images").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Post Comments table
export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => communityPosts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Post Likes table
export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => communityPosts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // exchange_reminder, review_prompt, follow_up, new_message
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"), // URL or path to the relevant page
  read: boolean("read").default(false).notNull(),
  relatedId: integer("related_id"), // ID of related item (exchange, message, etc.)
  relatedType: text("related_type"), // Type of related item (exchange, message, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  scheduledFor: timestamp("scheduled_for"), // For scheduled notifications
  emailSent: boolean("email_sent").default(false),
});

// Disputed Exchanges table
export const disputedExchanges = pgTable("disputed_exchanges", {
  id: serial("id").primaryKey(),
  exchangeId: integer("exchange_id").references(() => exchanges.id).notNull(),
  reporterId: integer("reporter_id").references(() => users.id).notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status").default("pending").notNull(), // pending, under_review, resolved
  adminNotes: text("admin_notes"),
  mediationRequired: boolean("mediation_required").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: integer("resolved_by").references(() => users.id),
});

// Badge Approvals table
export const badgeApprovals = pgTable("badge_approvals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  badgeType: text("badge_type").notNull(), // mentor, cultural, trusted, time
  triggeredCriteria: text("triggered_criteria").notNull(), // what criteria was met
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
});

// Referral Codes table
export const referralCodes = pgTable("referral_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  code: varchar("code", { length: 36 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  usageLimit: integer("usage_limit").default(100), // Maximum number of times this code can be used
  currentUsage: integer("current_usage").default(0).notNull(), // Current number of times this code has been used
});

// Referrals table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerUserId: integer("referrer_user_id").references(() => users.id).notNull(),
  referredUserId: integer("referred_user_id").references(() => users.id).notNull().unique(),
  referralCodeId: integer("referral_code_id").references(() => referralCodes.id).notNull(),
  status: text("status").default("pending").notNull(), // pending, completed
  rewardClaimed: boolean("reward_claimed").default(false).notNull(),
  completionDate: timestamp("completion_date"), // When the referred user completed their profile/first exchange
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Availability Preferences table
export const userAvailabilityPreferences = pgTable("user_availability_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  allowCalendarSync: boolean("allow_calendar_sync").default(false).notNull(),
  calendarProvider: text("calendar_provider"), // google, apple, outlook, etc.
  calendarToken: text("calendar_token"), // OAuth token for calendar access (encrypted)
  calendarRefreshToken: text("calendar_refresh_token"), // OAuth refresh token (encrypted)
  calendarTokenExpiry: timestamp("calendar_token_expiry"), // Token expiry date
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Weekly Availability Schedule table (recurring)
export const weeklyAvailability = pgTable("weekly_availability", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: time("start_time").notNull(), // e.g., 09:00:00
  endTime: time("end_time").notNull(), // e.g., 17:00:00
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Specific Date Availability (overrides weekly schedule)
export const specificDateAvailability = pgTable("specific_date_availability", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(), // true = available, false = unavailable (blocks time)
  note: text("note"), // Optional note (e.g., "Available for language exchange only")
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blocked Time Periods
export const blockedTimePeriods = pgTable("blocked_time_periods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time").notNull(),
  reason: text("reason"), // Optional reason for blocking
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurringPattern: text("recurring_pattern"), // For recurring blocks (e.g., "WEEKLY", "MONTHLY")
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

export const insertBucketListItemSchema = createInsertSchema(bucketListItems).omit({
  id: true,
  createdAt: true,
  achievedDate: true,
});

export const insertExchangeSchema = createInsertSchema(exchanges).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  createdAt: true,
});

export const insertPostLikeSchema = createInsertSchema(postLikes).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertDisputedExchangeSchema = createInsertSchema(disputedExchanges).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
  resolvedBy: true,
});

export const insertBadgeApprovalSchema = createInsertSchema(badgeApprovals).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

export const insertReferralCodeSchema = createInsertSchema(referralCodes).omit({
  id: true,
  createdAt: true,
  currentUsage: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completionDate: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type BucketListItem = typeof bucketListItems.$inferSelect;
export type InsertBucketListItem = z.infer<typeof insertBucketListItemSchema>;

export type Exchange = typeof exchanges.$inferSelect;
export type InsertExchange = z.infer<typeof insertExchangeSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;

export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;

export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = z.infer<typeof insertPostLikeSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type DisputedExchange = typeof disputedExchanges.$inferSelect;
export type InsertDisputedExchange = z.infer<typeof insertDisputedExchangeSchema>;

export type BadgeApproval = typeof badgeApprovals.$inferSelect;
export type InsertBadgeApproval = z.infer<typeof insertBadgeApprovalSchema>;

export type ReferralCode = typeof referralCodes.$inferSelect;
export type InsertReferralCode = z.infer<typeof insertReferralCodeSchema>;

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

// Insert schemas for availability tables
export const insertUserAvailabilityPreferencesSchema = createInsertSchema(userAvailabilityPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWeeklyAvailabilitySchema = createInsertSchema(weeklyAvailability).omit({
  id: true,
  createdAt: true,
});

export const insertSpecificDateAvailabilitySchema = createInsertSchema(specificDateAvailability).omit({
  id: true,
  createdAt: true,
});

export const insertBlockedTimePeriodsSchema = createInsertSchema(blockedTimePeriods).omit({
  id: true,
  createdAt: true,
});

// Types for availability tables
export type UserAvailabilityPreferences = typeof userAvailabilityPreferences.$inferSelect;
export type InsertUserAvailabilityPreferences = z.infer<typeof insertUserAvailabilityPreferencesSchema>;

export type WeeklyAvailability = typeof weeklyAvailability.$inferSelect;
export type InsertWeeklyAvailability = z.infer<typeof insertWeeklyAvailabilitySchema>;

export type SpecificDateAvailability = typeof specificDateAvailability.$inferSelect;
export type InsertSpecificDateAvailability = z.infer<typeof insertSpecificDateAvailabilitySchema>;

export type BlockedTimePeriod = typeof blockedTimePeriods.$inferSelect;
export type InsertBlockedTimePeriod = z.infer<typeof insertBlockedTimePeriodsSchema>;

import { 
  User, InsertUser, 
  Skill, InsertSkill,
  BucketListItem, InsertBucketListItem,
  Exchange, InsertExchange,
  Message, InsertMessage,
  Review, InsertReview,
  CommunityPost, InsertCommunityPost,
  PostComment, InsertPostComment,
  PostLike, InsertPostLike,
  Notification, InsertNotification,
  DisputedExchange, InsertDisputedExchange,
  BadgeApproval, InsertBadgeApproval,
  ReferralCode, InsertReferralCode,
  Referral, InsertReferral,
  UserAvailabilityPreferences, InsertUserAvailabilityPreferences,
  WeeklyAvailability, InsertWeeklyAvailability,
  SpecificDateAvailability, InsertSpecificDateAvailability,
  BlockedTimePeriod, InsertBlockedTimePeriod
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  getUserAchievements(userId: number): Promise<string[]>;
  getAllUsers(): Promise<User[]>;
  
  // Skills methods
  getSkillsByUserId(userId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  
  // Bucket list methods
  getBucketListByUserId(userId: number): Promise<BucketListItem[]>;
  getBucketListItemById(id: number): Promise<BucketListItem | undefined>;
  createBucketListItem(item: InsertBucketListItem): Promise<BucketListItem>;
  updateBucketListItem(id: number, updates: Partial<BucketListItem>): Promise<BucketListItem>;
  
  // Exchange methods
  getExchangesByUserId(userId: number): Promise<Exchange[]>;
  getExchangeById(id: number): Promise<Exchange | undefined>;
  getAllExchanges(): Promise<Exchange[]>;
  createExchange(exchange: InsertExchange): Promise<Exchange>;
  updateExchange(id: number, updates: Partial<Exchange>): Promise<Exchange>;
  
  // Message methods
  getMessagesByUserId(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Review methods
  getReviewsByUserId(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Community post methods
  getCommunityPosts(): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  
  // Post comment methods
  getCommentsByPostId(postId: number): Promise<PostComment[]>;
  createPostComment(comment: InsertPostComment): Promise<PostComment>;
  
  // Post like methods
  getLikesByPostId(postId: number): Promise<PostLike[]>;
  getLikeByUserAndPost(userId: number, postId: number): Promise<PostLike | undefined>;
  createPostLike(like: InsertPostLike): Promise<PostLike>;
  deleteLikeByUserAndPost(userId: number, postId: number): Promise<void>;
  
  // Notification methods
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  getUnreadNotificationsCount(userId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;
  scheduleNotification(notification: InsertNotification, date: Date): Promise<Notification>;
  
  // Match recommendations
  getRecommendedMatches(userId: number, filters?: {
    skillTypes?: string[];
    location?: {
      city?: string;
      radius?: number;
      coordinates?: { lat: number; lng: number };
    };
    availability?: {
      dates?: Date[];
      timeOfDay?: string[];
    };
    languages?: string[];
    searchQuery?: string;
  }): Promise<User[]>;
  
  // Admin methods
  getDisputedExchanges(): Promise<DisputedExchange[]>;
  getDisputedExchangeById(id: number): Promise<DisputedExchange | undefined>;
  createDisputedExchange(dispute: InsertDisputedExchange): Promise<DisputedExchange>;
  updateDisputedExchange(id: number, updates: Partial<DisputedExchange>): Promise<DisputedExchange>;
  
  getBadgeApprovals(): Promise<BadgeApproval[]>;
  getBadgeApprovalById(id: number): Promise<BadgeApproval | undefined>; 
  createBadgeApproval(badgeApproval: InsertBadgeApproval): Promise<BadgeApproval>;
  updateBadgeApproval(id: number, updates: Partial<BadgeApproval>): Promise<BadgeApproval>;
  
  // Analytics methods
  getExchangeAnalytics(period?: 'weekly' | 'monthly'): Promise<{
    totalExchanges: number;
    completedExchanges: number;
    exchangesByDate: { date: string, count: number }[];
    exchangesByUser: { userId: number, fullName: string, count: number }[];
    averageRating: number;
  }>;
  getBadgeAnalytics(): Promise<{
    totalBadges: number;
    badgesByType: { type: string, count: number }[];
    badgesTrend: { date: string, count: number }[];
  }>;
  getReferralAnalytics(): Promise<{
    totalReferrals: number;
    successfulReferrals: number;
    conversionRate: number;
    referralsByDate: { date: string, count: number }[];
    topReferrers: { userId: number, fullName: string, count: number }[];
  }>;
  getReviewAnalytics(): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { rating: number, count: number }[];
    reviewsByDate: { date: string, count: number }[];
  }>;
  getBucketListAnalytics(): Promise<{
    totalItems: number;
    achievedItems: number;
    inProgressItems: number;
    itemsByStatus: { status: string, count: number }[];
    itemsByUser: { userId: number, fullName: string, count: number }[];
    achievedByMonth: { month: string, count: number }[];
    linkedToExchanges: number;
    dreamFulfilledBadges: number;
  }>;
  
  // Referral methods
  getUserReferralCode(userId: number): Promise<ReferralCode | undefined>;
  createReferralCode(referralCode: InsertReferralCode): Promise<ReferralCode>;
  getReferralsByReferrerId(referrerId: number): Promise<Referral[]>;
  getSuccessfulReferralsCount(referrerId: number): Promise<number>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferral(id: number, updates: Partial<Referral>): Promise<Referral>;
  processReferralReward(id: number): Promise<Referral>;
  validateReferralCode(code: string): Promise<ReferralCode | undefined>;
  getReferral(id: number): Promise<Referral | undefined>;
  
  // Availability methods
  getUserAvailabilityPreferences(userId: number): Promise<UserAvailabilityPreferences | undefined>;
  createUserAvailabilityPreferences(preferences: InsertUserAvailabilityPreferences): Promise<UserAvailabilityPreferences>;
  updateUserAvailabilityPreferences(userId: number, updates: Partial<UserAvailabilityPreferences>): Promise<UserAvailabilityPreferences>;
  
  // Weekly availability methods
  getWeeklyAvailability(userId: number): Promise<WeeklyAvailability[]>;
  createWeeklyAvailability(availability: InsertWeeklyAvailability): Promise<WeeklyAvailability>;
  updateWeeklyAvailability(id: number, updates: Partial<WeeklyAvailability>): Promise<WeeklyAvailability>;
  deleteWeeklyAvailability(id: number): Promise<void>;
  
  // Specific date availability methods
  getSpecificDateAvailability(userId: number, startDate?: Date, endDate?: Date): Promise<SpecificDateAvailability[]>;
  createSpecificDateAvailability(availability: InsertSpecificDateAvailability): Promise<SpecificDateAvailability>;
  updateSpecificDateAvailability(id: number, updates: Partial<SpecificDateAvailability>): Promise<SpecificDateAvailability>;
  deleteSpecificDateAvailability(id: number): Promise<void>;
  
  // Blocked time periods methods
  getBlockedTimePeriods(userId: number, startDate?: Date, endDate?: Date): Promise<BlockedTimePeriod[]>;
  createBlockedTimePeriod(blockedTime: InsertBlockedTimePeriod): Promise<BlockedTimePeriod>;
  updateBlockedTimePeriod(id: number, updates: Partial<BlockedTimePeriod>): Promise<BlockedTimePeriod>;
  deleteBlockedTimePeriod(id: number): Promise<void>;
  
  // Calendar integration methods
  saveCalendarCredentials(userId: number, provider: string, token: string, refreshToken: string, expiry: Date): Promise<UserAvailabilityPreferences>;
  syncUserCalendar(userId: number): Promise<boolean>;
  
  // Availability calculation methods
  getUserAvailableTimeSlots(userId: number, date: Date): Promise<{startTime: Date, endTime: Date}[]>;
  checkUserAvailability(userId: number, startTime: Date, endTime: Date): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  users: Map<number, User>;
  private skills: Map<number, Skill>;
  private bucketListItems: Map<number, BucketListItem>;
  private exchanges: Map<number, Exchange>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  private communityPosts: Map<number, CommunityPost>;
  private postComments: Map<number, PostComment>;
  private postLikes: Map<number, PostLike>;
  private notifications: Map<number, Notification>;
  private disputedExchanges: Map<number, DisputedExchange>;
  private badgeApprovals: Map<number, BadgeApproval>;
  private referralCodes: Map<number, ReferralCode>;
  private referrals: Map<number, Referral>;
  
  sessionStore: session.Store;
  currentId: { [key: string]: number };

  private userAvailabilityPrefs: Map<number, UserAvailabilityPreferences>;
  private weeklyAvails: Map<number, WeeklyAvailability>;
  private specificDateAvails: Map<number, SpecificDateAvailability>;
  private blockedTimes: Map<number, BlockedTimePeriod>;

  constructor() {
    this.users = new Map();
    this.skills = new Map();
    this.bucketListItems = new Map();
    this.exchanges = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    this.communityPosts = new Map();
    this.postComments = new Map();
    this.postLikes = new Map();
    this.notifications = new Map();
    this.disputedExchanges = new Map();
    this.badgeApprovals = new Map();
    this.referralCodes = new Map();
    this.referrals = new Map();
    this.userAvailabilityPrefs = new Map();
    this.weeklyAvails = new Map();
    this.specificDateAvails = new Map();
    this.blockedTimes = new Map();
    
    this.currentId = {
      users: 1,
      skills: 1,
      bucketListItems: 1,
      exchanges: 1,
      messages: 1,
      reviews: 1,
      communityPosts: 1,
      postComments: 1,
      postLikes: 1,
      notifications: 1,
      disputedExchanges: 1,
      badgeApprovals: 1,
      referralCodes: 1,
      referrals: 1,
      userAvailabilityPrefs: 1,
      weeklyAvails: 1,
      specificDateAvails: 1,
      blockedTimes: 1
    };
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Add some dummy data for development
    this._initializeDummyData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      location: insertUser.location ?? null,
      bio: insertUser.bio ?? null,
      avatarUrl: insertUser.avatarUrl ?? null,
      role: insertUser.role ?? 'user',
      timeCredits: insertUser.timeCredits ?? 0
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserAchievements(userId: number): Promise<string[]> {
    // This would typically query a database to count achievements
    // For this implementation, we'll calculate achievements based on activity
    
    const achievements: string[] = [];
    const user = await this.getUser(userId);
    
    if (!user) return achievements;
    
    // Get all exchanges where the user was involved
    const exchanges = await this.getExchangesByUserId(userId);
    
    // Get all reviews for the user
    const reviews = await this.getReviewsByUserId(userId);
    
    // Calculate achievement criteria
    
    // 1. Mentor Achievement: 5+ teaching exchanges
    const teachingExchanges = exchanges.filter(ex => 
      ex.providerId === userId && ex.status === 'completed'
    );
    
    if (teachingExchanges.length >= 5) {
      achievements.push('mentor');
    }
    
    // 2. Cultural Connector: Exchanges with people from 3+ countries
    // For demo, we'll determine this based on exchange IDs - in a real app, 
    // we would check user locations/countries
    const uniqueCountriesCount = new Set(
      exchanges.map(ex => 
        ex.providerId === userId ? ex.requestorId : ex.providerId
      )
    ).size;
    
    if (uniqueCountriesCount >= 3) {
      achievements.push('cultural');
    }
    
    // 3. Trusted Peer: 10+ reviews with avg rating above 4.5
    if (reviews.length >= 10) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      if (avgRating >= 4.5) {
        achievements.push('trusted');
      }
    }
    
    // 4. Time Hero: 20+ total hours shared
    const totalHours = exchanges.reduce((sum, ex) => {
      // Only count completed exchanges
      if (ex.status === 'completed') {
        return sum + (ex.duration || 0) / 60;
      }
      return sum;
    }, 0);
    
    if (totalHours >= 20) {
      achievements.push('time');
    }
    
    return achievements;
  }
  
  // Skills methods
  async getSkillsByUserId(userId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.userId === userId
    );
  }
  
  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.currentId.skills++;
    const skill: Skill = { 
      ...insertSkill, 
      id,
      description: insertSkill.description ?? null
    };
    this.skills.set(id, skill);
    return skill;
  }
  
  // Bucket list methods
  async getBucketListByUserId(userId: number): Promise<BucketListItem[]> {
    return Array.from(this.bucketListItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async getBucketListItemById(id: number): Promise<BucketListItem | undefined> {
    return this.bucketListItems.get(id);
  }
  
  async createBucketListItem(insertItem: InsertBucketListItem): Promise<BucketListItem> {
    const id = this.currentId.bucketListItems++;
    const now = new Date();
    const item: BucketListItem = { 
      ...insertItem, 
      id,
      description: insertItem.description ?? null,
      status: insertItem.status ?? 'planned',
      completed: insertItem.completed ?? false,
      exchangeId: insertItem.exchangeId ?? null,
      achievedDate: insertItem.status === 'achieved' ? now : null,
      createdAt: now
    };
    this.bucketListItems.set(id, item);
    return item;
  }
  
  async updateBucketListItem(id: number, updates: Partial<BucketListItem>): Promise<BucketListItem> {
    const item = await this.getBucketListItemById(id);
    if (!item) {
      throw new Error('Bucket list item not found');
    }
    
    // Check if the status is being changed to "achieved"
    if (updates.status === 'achieved' && item.status !== 'achieved') {
      updates.achievedDate = new Date();
      updates.completed = true;
      
      // Create a dream fulfilled badge approval for the user if they have 5 or more achieved dreams
      const userItems = await this.getBucketListByUserId(item.userId);
      const achievedItemsCount = userItems.filter(i => i.status === 'achieved').length;
      
      if (achievedItemsCount >= 4) { // This will be 5 including the current one
        // Check if the user already has this badge approval pending or approved
        const existingApproval = Array.from(this.badgeApprovals.values()).find(
          ba => ba.userId === item.userId && ba.badgeType === 'dream' && 
                (ba.status === 'pending' || ba.status === 'approved')
        );
        
        if (!existingApproval) {
          await this.createBadgeApproval({
            userId: item.userId,
            badgeType: 'dream',
            triggeredCriteria: 'Fulfilled 5 bucket list dreams',
            status: 'pending',
            adminNotes: null
          });
          
          // Create a notification for the user
          await this.createNotification({
            userId: item.userId,
            type: 'achievement',
            title: 'Dream Fulfilled Badge Pending!',
            message: 'Congratulations! You\'ve completed 5 bucket list items. Your "Dream Fulfilled" badge is pending approval.',
            read: false,
            link: '/profile',
            relatedType: 'badge',
            emailSent: false
          });
        }
      }
    }
    
    const updatedItem = { ...item, ...updates };
    this.bucketListItems.set(id, updatedItem);
    return updatedItem;
  }
  
  // Exchange methods
  async getExchangesByUserId(userId: number): Promise<Exchange[]> {
    return Array.from(this.exchanges.values()).filter(
      (exchange) => exchange.requestorId === userId || exchange.providerId === userId
    );
  }
  
  async getExchangeById(id: number): Promise<Exchange | undefined> {
    return this.exchanges.get(id);
  }
  
  async getAllExchanges(): Promise<Exchange[]> {
    return Array.from(this.exchanges.values());
  }
  
  async createExchange(insertExchange: InsertExchange): Promise<Exchange> {
    const id = this.currentId.exchanges++;
    const now = new Date();
    const exchange: Exchange = {
      ...insertExchange,
      id,
      createdAt: now,
      description: insertExchange.description || null,
      scheduledDate: insertExchange.scheduledDate || null,
      duration: insertExchange.duration || null,
      requestorConfirmed: false,
      providerConfirmed: false
    };
    this.exchanges.set(id, exchange);
    return exchange;
  }
  
  async updateExchange(id: number, updates: Partial<Exchange>): Promise<Exchange> {
    const exchange = await this.getExchangeById(id);
    if (!exchange) {
      throw new Error('Exchange not found');
    }
    
    const updatedExchange = { ...exchange, ...updates };
    this.exchanges.set(id, updatedExchange);
    return updatedExchange;
  }
  
  // Message methods
  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId
    );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId.messages++;
    const now = new Date();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: now,
      read: false
    };
    this.messages.set(id, message);
    return message;
  }
  
  // Review methods
  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.receiverId === userId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentId.reviews++;
    const now = new Date();
    // Make sure we have a tags array, even if empty
    const tags: string[] = insertReview.tags ? 
      [...insertReview.tags].map(tag => String(tag)) : 
      [];
    
    const review: Review = {
      ...insertReview,
      id,
      createdAt: now,
      comment: insertReview.comment || null,
      tags
    };
    this.reviews.set(id, review);
    return review;
  }
  
  // Community post methods
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  
  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = this.currentId.communityPosts++;
    const now = new Date();
    const post: CommunityPost = {
      ...insertPost,
      id,
      createdAt: now,
      images: insertPost.images ? 
        [...insertPost.images].map(img => String(img)) : 
        null
    };
    this.communityPosts.set(id, post);
    return post;
  }
  
  // Post comment methods
  async getCommentsByPostId(postId: number): Promise<PostComment[]> {
    return Array.from(this.postComments.values()).filter(
      (comment) => comment.postId === postId
    ).sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }
  
  async createPostComment(insertComment: InsertPostComment): Promise<PostComment> {
    const id = this.currentId.postComments++;
    const now = new Date();
    const comment: PostComment = { ...insertComment, id, createdAt: now };
    this.postComments.set(id, comment);
    return comment;
  }
  
  // Post like methods
  async getLikesByPostId(postId: number): Promise<PostLike[]> {
    return Array.from(this.postLikes.values()).filter(
      (like) => like.postId === postId
    );
  }
  
  async getLikeByUserAndPost(userId: number, postId: number): Promise<PostLike | undefined> {
    return Array.from(this.postLikes.values()).find(
      (like) => like.userId === userId && like.postId === postId
    );
  }
  
  async createPostLike(insertLike: InsertPostLike): Promise<PostLike> {
    const id = this.currentId.postLikes++;
    const now = new Date();
    const like: PostLike = { ...insertLike, id, createdAt: now };
    this.postLikes.set(id, like);
    return like;
  }
  
  async deleteLikeByUserAndPost(userId: number, postId: number): Promise<void> {
    const like = await this.getLikeByUserAndPost(userId, postId);
    if (like) {
      this.postLikes.delete(like.id);
    }
  }
  
  // Notification methods
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getUnreadNotificationsCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.read)
      .length;
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentId.notifications++;
    const now = new Date();
    
    const notification: Notification = {
      ...insertNotification,
      id,
      createdAt: now,
      scheduledFor: insertNotification.scheduledFor || null,
      relatedId: insertNotification.relatedId || null,
      relatedType: insertNotification.relatedType || null,
      link: insertNotification.link || null,
      read: false,
      emailSent: false,
    };
    
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<void> {
    const userNotifications = await this.getNotificationsByUserId(userId);
    
    userNotifications.forEach(notification => {
      const updatedNotification = { ...notification, read: true };
      this.notifications.set(notification.id, updatedNotification);
    });
  }
  
  async deleteNotification(id: number): Promise<void> {
    if (!this.notifications.has(id)) {
      throw new Error('Notification not found');
    }
    
    this.notifications.delete(id);
  }
  
  async scheduleNotification(notification: InsertNotification, date: Date): Promise<Notification> {
    // For scheduled notifications, set the scheduledFor field
    const notificationWithSchedule = {
      ...notification,
      scheduledFor: date,
    };
    
    return await this.createNotification(notificationWithSchedule);
  }
  
  // Match recommendations with filtering support
  async getRecommendedMatches(userId: number, filters?: {
    skillTypes?: string[];
    location?: {
      city?: string;
      radius?: number;
      coordinates?: { lat: number; lng: number };
    };
    availability?: {
      dates?: Date[];
      timeOfDay?: string[];
    };
    languages?: string[];
    searchQuery?: string;
  }): Promise<User[]> {
    const currentUser = await this.getUser(userId);
    if (!currentUser) {
      return [];
    }
    
    // Start with all users except current user
    let matches = Array.from(this.users.values())
      .filter(user => user.id !== userId);
    
    // If no filters, return all matches
    if (!filters) {
      return matches;
    }
    
    // Apply filters if they exist
    
    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      matches = matches.filter(user => {
        return (
          user.username.toLowerCase().includes(query) ||
          user.fullName.toLowerCase().includes(query) ||
          (user.bio && user.bio.toLowerCase().includes(query)) ||
          (user.location && user.location.toLowerCase().includes(query))
        );
      });
    }
    
    // Filter by location
    if (filters.location && filters.location.city && filters.location.city.trim() !== '') {
      const locationQuery = filters.location.city.toLowerCase();
      // In a real implementation we would use geolocation APIs to find users within radius
      // For MVP, just do a simple string match on location
      matches = matches.filter(user => {
        return user.location && user.location.toLowerCase().includes(locationQuery);
      });
    }
    
    // For skill types and languages filtering, we would ideally have these properties on User objects
    // Since our MVP doesn't store this data directly on users, we'll simulate filtering based on user ID
    // In a real implementation, we would query the skills and user_languages tables
    
    // Example skill filter simulation (in practice, get from a skills table)
    if (filters.skillTypes && filters.skillTypes.length > 0) {
      // For demo purposes, define some sample skill mappings
      const userSkillMap: Record<number, string[]> = {
        2: ['drone', 'photography', 'editing'], // David Kim
        3: ['cooking', 'baking']                // Sarah Johnson
      };
      
      matches = matches.filter(user => {
        const userSkills = userSkillMap[user.id] || [];
        return filters.skillTypes!.some(skillType => userSkills.includes(skillType));
      });
    }
    
    // Example language filter simulation (in practice, get from a user_languages table)
    if (filters.languages && filters.languages.length > 0) {
      // For demo purposes, define some sample language mappings
      const userLanguageMap: Record<number, string[]> = {
        2: ['en', 'es'],  // David Kim speaks English and Spanish
        3: ['en', 'fr']   // Sarah Johnson speaks English and French
      };
      
      matches = matches.filter(user => {
        const userLanguages = userLanguageMap[user.id] || [];
        return filters.languages!.some(language => userLanguages.includes(language));
      });
    }
    
    // Example availability filter simulation (in practice, get from an availability table)
    if (filters.availability && filters.availability.timeOfDay && filters.availability.timeOfDay.length > 0) {
      // For demo purposes, define some sample availability mappings
      const userAvailabilityMap: Record<number, string[]> = {
        2: ['morning', 'evening'],   // David Kim available mornings and evenings
        3: ['afternoon', 'evening']  // Sarah Johnson available afternoons and evenings
      };
      
      matches = matches.filter(user => {
        const userAvailability = userAvailabilityMap[user.id] || [];
        return filters.availability!.timeOfDay!.some(time => userAvailability.includes(time));
      });
    }
    
    return matches;
  }
  
  // Admin methods - Disputed exchanges
  async getDisputedExchanges(): Promise<DisputedExchange[]> {
    return Array.from(this.disputedExchanges.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getDisputedExchangeById(id: number): Promise<DisputedExchange | undefined> {
    return this.disputedExchanges.get(id);
  }
  
  async createDisputedExchange(dispute: InsertDisputedExchange): Promise<DisputedExchange> {
    const id = this.currentId.disputedExchanges++;
    const now = new Date();
    
    const disputedExchange: DisputedExchange = {
      ...dispute,
      id,
      createdAt: now,
      resolvedAt: null,
      resolvedBy: null,
      status: dispute.status || 'pending',
      adminNotes: dispute.adminNotes || null,
      details: dispute.details || null,
      mediationRequired: dispute.mediationRequired ?? false
    };
    
    this.disputedExchanges.set(id, disputedExchange);
    return disputedExchange;
  }
  
  async updateDisputedExchange(id: number, updates: Partial<DisputedExchange>): Promise<DisputedExchange> {
    const dispute = await this.getDisputedExchangeById(id);
    if (!dispute) {
      throw new Error('Disputed exchange not found');
    }
    
    const updatedDispute = { ...dispute, ...updates };
    this.disputedExchanges.set(id, updatedDispute);
    return updatedDispute;
  }
  
  // Admin methods - Badge approvals
  async getBadgeApprovals(): Promise<BadgeApproval[]> {
    return Array.from(this.badgeApprovals.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  // Analytics methods
  async getExchangeAnalytics(period?: 'weekly' | 'monthly'): Promise<{
    totalExchanges: number;
    completedExchanges: number;
    exchangesByDate: { date: string, count: number }[];
    exchangesByUser: { userId: number, fullName: string, count: number }[];
    averageRating: number;
  }> {
    const exchanges = Array.from(this.exchanges.values());
    const reviews = Array.from(this.reviews.values());
    
    // Calculate total and completed exchanges
    const totalExchanges = exchanges.length;
    const completedExchanges = exchanges.filter(ex => ex.status === 'completed').length;
    
    // Get exchanges by date
    const exchangesByDate: { [key: string]: number } = {};
    
    // Determine the date format based on the period
    const dateFormat = period === 'monthly' ? 'yyyy-MM' : 'yyyy-MM-dd';
    
    exchanges.forEach(exchange => {
      const date = new Date(exchange.createdAt);
      // Format date based on period (weekly or monthly)
      let dateKey: string;
      
      if (period === 'monthly') {
        // Format as YYYY-MM
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        // Format as YYYY-MM-DD (default to weekly)
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      
      if (!exchangesByDate[dateKey]) {
        exchangesByDate[dateKey] = 0;
      }
      exchangesByDate[dateKey]++;
    });
    
    // Convert to array and sort by date
    const exchangesByDateArray = Object.entries(exchangesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Get exchanges by user
    const exchangesByUser: { [key: string]: { userId: number, fullName: string, count: number } } = {};
    
    for (const exchange of exchanges) {
      // Count exchanges for both requestor and provider
      [exchange.requestorId, exchange.providerId].forEach(userId => {
        const userIdStr = userId.toString();
        if (!exchangesByUser[userIdStr]) {
          // Initialize with a placeholder name, we'll update it after the loop
          exchangesByUser[userIdStr] = {
            userId,
            fullName: `User ${userId}`,
            count: 0
          };
        }
        exchangesByUser[userIdStr].count++;
      });
    }
    
    // Now update the user names
    for (const userIdStr in exchangesByUser) {
      const userId = parseInt(userIdStr);
      const user = await this.getUser(userId);
      if (user) {
        exchangesByUser[userIdStr].fullName = user.fullName;
      }
    }
    
    // Convert to array and sort by count (descending)
    const exchangesByUserArray = Object.values(exchangesByUser)
      .sort((a, b) => b.count - a.count);
    
    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }
    
    return {
      totalExchanges,
      completedExchanges,
      exchangesByDate: exchangesByDateArray,
      exchangesByUser: exchangesByUserArray,
      averageRating
    };
  }
  
  async getBadgeAnalytics(): Promise<{
    totalBadges: number;
    badgesByType: { type: string, count: number }[];
    badgesTrend: { date: string, count: number }[];
  }> {
    // Get all users
    const users = Array.from(this.users.values());
    
    // Track badge counts by type
    const badgeCounts: { [key: string]: number } = {
      'mentor': 0,
      'cultural': 0,
      'trusted': 0,
      'time': 0
    };
    
    // Track when badges were earned (using badge approvals as proxy)
    const badgeApprovals = Array.from(this.badgeApprovals.values());
    const badgesByDate: { [key: string]: number } = {};
    
    // Count badges across all users
    for (const user of users) {
      const achievements = await this.getUserAchievements(user.id);
      
      for (const badge of achievements) {
        if (badgeCounts[badge] !== undefined) {
          badgeCounts[badge]++;
        }
      }
    }
    
    // Process badge approvals for trend data
    badgeApprovals.forEach(approval => {
      if (approval.status === 'approved') {
        const date = new Date(approval.createdAt);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!badgesByDate[dateKey]) {
          badgesByDate[dateKey] = 0;
        }
        badgesByDate[dateKey]++;
      }
    });
    
    // Convert to array format
    const badgesByType = Object.entries(badgeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
    
    const badgesTrend = Object.entries(badgesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      totalBadges: Object.values(badgeCounts).reduce((sum, count) => sum + count, 0),
      badgesByType,
      badgesTrend
    };
  }
  
  async getReferralAnalytics(): Promise<{
    totalReferrals: number;
    successfulReferrals: number;
    conversionRate: number;
    referralsByDate: { date: string, count: number }[];
    topReferrers: { userId: number, fullName: string, count: number }[];
  }> {
    const referrals = Array.from(this.referrals.values());
    
    // Calculate totals
    const totalReferrals = referrals.length;
    const successfulReferrals = referrals.filter(ref => ref.status === 'completed').length;
    const conversionRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0;
    
    // Track referrals by date
    const referralsByDate: { [key: string]: number } = {};
    
    referrals.forEach(referral => {
      const date = new Date(referral.createdAt);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!referralsByDate[dateKey]) {
        referralsByDate[dateKey] = 0;
      }
      referralsByDate[dateKey]++;
    });
    
    // Convert to array and sort by date
    const referralsByDateArray = Object.entries(referralsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Track top referrers
    const referrerCounts: { [key: number]: number } = {};
    
    referrals.forEach(referral => {
      if (!referrerCounts[referral.referrerUserId]) {
        referrerCounts[referral.referrerUserId] = 0;
      }
      referrerCounts[referral.referrerUserId]++;
    });
    
    // Convert to array with user info
    const topReferrers: { userId: number, fullName: string, count: number }[] = [];
    
    for (const [userIdStr, count] of Object.entries(referrerCounts)) {
      const userId = parseInt(userIdStr);
      const user = await this.getUser(userId);
      
      topReferrers.push({
        userId,
        fullName: user ? user.fullName : `User ${userId}`,
        count
      });
    }
    
    // Sort by count (descending)
    topReferrers.sort((a, b) => b.count - a.count);
    
    return {
      totalReferrals,
      successfulReferrals,
      conversionRate,
      referralsByDate: referralsByDateArray,
      topReferrers
    };
  }
  
  async getReviewAnalytics(): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { rating: number, count: number }[];
    reviewsByDate: { date: string, count: number }[];
  }> {
    const reviews = Array.from(this.reviews.values());
    
    // Calculate total and average
    const totalReviews = reviews.length;
    let averageRating = 0;
    
    if (totalReviews > 0) {
      averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    }
    
    // Calculate rating distribution
    const ratingCounts: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
    reviews.forEach(review => {
      if (ratingCounts[review.rating] !== undefined) {
        ratingCounts[review.rating]++;
      }
    });
    
    // Convert to array format
    const ratingDistribution = Object.entries(ratingCounts)
      .map(([rating, count]) => ({ rating: parseInt(rating), count }))
      .sort((a, b) => a.rating - b.rating);
    
    // Track reviews by date
    const reviewsByDate: { [key: string]: number } = {};
    
    reviews.forEach(review => {
      const date = new Date(review.createdAt);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!reviewsByDate[dateKey]) {
        reviewsByDate[dateKey] = 0;
      }
      reviewsByDate[dateKey]++;
    });
    
    // Convert to array and sort by date
    const reviewsByDateArray = Object.entries(reviewsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      reviewsByDate: reviewsByDateArray
    };
  }
  
  async getBadgeApprovalById(id: number): Promise<BadgeApproval | undefined> {
    return this.badgeApprovals.get(id);
  }
  
  async createBadgeApproval(badgeApproval: InsertBadgeApproval): Promise<BadgeApproval> {
    const id = this.currentId.badgeApprovals++;
    const now = new Date();
    
    const approval: BadgeApproval = {
      ...badgeApproval,
      id,
      createdAt: now,
      reviewedAt: null,
      reviewedBy: null,
      status: badgeApproval.status || 'pending',
      adminNotes: badgeApproval.adminNotes || null,
    };
    
    this.badgeApprovals.set(id, approval);
    return approval;
  }
  
  async updateBadgeApproval(id: number, updates: Partial<BadgeApproval>): Promise<BadgeApproval> {
    const approval = await this.getBadgeApprovalById(id);
    if (!approval) {
      throw new Error('Badge approval not found');
    }
    
    const updatedApproval = { ...approval, ...updates };
    this.badgeApprovals.set(id, updatedApproval);
    return updatedApproval;
  }

  // Referral methods
  async getUserReferralCode(userId: number): Promise<ReferralCode | undefined> {
    return Array.from(this.referralCodes.values()).find(
      (code) => code.userId === userId && code.isActive
    );
  }

  async createReferralCode(insertReferralCode: InsertReferralCode): Promise<ReferralCode> {
    const id = this.currentId.referralCodes++;
    const now = new Date();
    
    // Use the provided code or generate one
    const code = insertReferralCode.code || randomUUID();
    
    const referralCode: ReferralCode = {
      id,
      code,
      createdAt: now,
      userId: insertReferralCode.userId,
      isActive: insertReferralCode.isActive ?? true,
      usageLimit: insertReferralCode.usageLimit ?? 10, // Default to 10 if not provided
      currentUsage: 0
    };
    
    this.referralCodes.set(id, referralCode);
    return referralCode;
  }

  async getReferralsByReferrerId(referrerId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values())
      .filter(referral => referral.referrerUserId === referrerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSuccessfulReferralsCount(referrerId: number): Promise<number> {
    return Array.from(this.referrals.values())
      .filter(referral => referral.referrerUserId === referrerId && referral.status === 'completed')
      .length;
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentId.referrals++;
    const now = new Date();
    
    const referral: Referral = {
      ...insertReferral,
      id,
      createdAt: now,
      completionDate: null,
      status: insertReferral.status || 'pending',
      rewardClaimed: insertReferral.rewardClaimed || false
    };
    
    this.referrals.set(id, referral);
    
    // Update the usage count of the referral code
    const referralCode = this.referralCodes.get(insertReferral.referralCodeId);
    if (referralCode) {
      const updatedReferralCode = {
        ...referralCode,
        currentUsage: referralCode.currentUsage + 1
      };
      this.referralCodes.set(referralCode.id, updatedReferralCode);
    }
    
    return referral;
  }

  async updateReferral(id: number, updates: Partial<Referral>): Promise<Referral> {
    const referral = this.referrals.get(id);
    if (!referral) {
      throw new Error('Referral not found');
    }
    
    const updatedReferral = { ...referral, ...updates };
    this.referrals.set(id, updatedReferral);
    return updatedReferral;
  }

  async processReferralReward(id: number): Promise<Referral> {
    const referral = this.referrals.get(id);
    if (!referral) {
      throw new Error('Referral not found');
    }
    
    if (referral.status !== 'completed') {
      throw new Error('Cannot process reward for incomplete referral');
    }
    
    if (referral.rewardClaimed) {
      throw new Error('Reward already claimed');
    }
    
    // Mark the reward as claimed
    const updatedReferral = { 
      ...referral, 
      rewardClaimed: true 
    };
    
    this.referrals.set(id, updatedReferral);
    
    // Create a notification for the reward
    await this.createNotification({
      userId: referral.referrerUserId,
      type: 'reward',
      title: 'Referral Reward Received',
      message: 'You earned a reward for your successful referral!',
      link: `/profile`
    });
    
    return updatedReferral;
  }

  async validateReferralCode(code: string): Promise<ReferralCode | undefined> {
    const referralCode = Array.from(this.referralCodes.values()).find(
      (rc) => rc.code === code && rc.isActive
    );
    
    if (!referralCode) {
      return undefined;
    }
    
    // Check if the code has reached its usage limit
    if (referralCode.usageLimit && referralCode.currentUsage >= referralCode.usageLimit) {
      return undefined;
    }
    
    return referralCode;
  }
  
  // Utility method to get a referral by ID - used by routes
  async getReferral(id: number): Promise<Referral | undefined> {
    return this.referrals.get(id);
  }

  // Availability Preferences methods
  async getUserAvailabilityPreferences(userId: number): Promise<UserAvailabilityPreferences | undefined> {
    return Array.from(this.userAvailabilityPrefs.values()).find(
      (pref) => pref.userId === userId
    );
  }

  async createUserAvailabilityPreferences(insertPreferences: InsertUserAvailabilityPreferences): Promise<UserAvailabilityPreferences> {
    const id = this.currentId.userAvailabilityPrefs++;
    const now = new Date();
    
    const preferences: UserAvailabilityPreferences = {
      ...insertPreferences,
      id,
      createdAt: now,
      updatedAt: now,
      // Make sure to set default values for required fields
      timezone: insertPreferences.timezone || "UTC",
      allowCalendarSync: insertPreferences.allowCalendarSync ?? false,
      calendarProvider: insertPreferences.calendarProvider || null,
      calendarToken: insertPreferences.calendarToken || null,
      calendarRefreshToken: insertPreferences.calendarRefreshToken || null,
      calendarTokenExpiry: insertPreferences.calendarTokenExpiry || null
    };
    
    this.userAvailabilityPrefs.set(id, preferences);
    return preferences;
  }

  async updateUserAvailabilityPreferences(userId: number, updates: Partial<UserAvailabilityPreferences>): Promise<UserAvailabilityPreferences> {
    const preferences = await this.getUserAvailabilityPreferences(userId);
    if (!preferences) {
      throw new Error('User availability preferences not found');
    }
    
    const now = new Date();
    const updatedPreferences = { 
      ...preferences, 
      ...updates,
      updatedAt: now
    };
    
    this.userAvailabilityPrefs.set(preferences.id, updatedPreferences);
    return updatedPreferences;
  }

  // Weekly Availability methods
  async getWeeklyAvailability(userId: number): Promise<WeeklyAvailability[]> {
    return Array.from(this.weeklyAvails.values()).filter(
      (avail) => avail.userId === userId
    );
  }

  async createWeeklyAvailability(insertAvailability: InsertWeeklyAvailability): Promise<WeeklyAvailability> {
    const id = this.currentId.weeklyAvails++;
    const now = new Date();
    
    const availability: WeeklyAvailability = {
      ...insertAvailability,
      id,
      createdAt: now,
      // Ensure required fields have default values
      isActive: insertAvailability.isActive ?? true
    };
    
    this.weeklyAvails.set(id, availability);
    return availability;
  }

  async updateWeeklyAvailability(id: number, updates: Partial<WeeklyAvailability>): Promise<WeeklyAvailability> {
    const availability = this.weeklyAvails.get(id);
    if (!availability) {
      throw new Error('Weekly availability not found');
    }
    
    const updatedAvailability = { ...availability, ...updates };
    this.weeklyAvails.set(id, updatedAvailability);
    return updatedAvailability;
  }

  async deleteWeeklyAvailability(id: number): Promise<void> {
    if (!this.weeklyAvails.has(id)) {
      throw new Error('Weekly availability not found');
    }
    
    this.weeklyAvails.delete(id);
  }

  // Specific Date Availability methods
  async getSpecificDateAvailability(userId: number, startDate?: Date, endDate?: Date): Promise<SpecificDateAvailability[]> {
    let availabilities = Array.from(this.specificDateAvails.values()).filter(
      (avail) => avail.userId === userId
    );
    
    if (startDate && endDate) {
      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();
      
      availabilities = availabilities.filter(avail => {
        const availDate = new Date(avail.date).getTime();
        return availDate >= startTimestamp && availDate <= endTimestamp;
      });
    } else if (startDate) {
      const startTimestamp = startDate.getTime();
      
      availabilities = availabilities.filter(avail => {
        const availDate = new Date(avail.date).getTime();
        return availDate >= startTimestamp;
      });
    } else if (endDate) {
      const endTimestamp = endDate.getTime();
      
      availabilities = availabilities.filter(avail => {
        const availDate = new Date(avail.date).getTime();
        return availDate <= endTimestamp;
      });
    }
    
    return availabilities;
  }

  async createSpecificDateAvailability(insertAvailability: InsertSpecificDateAvailability): Promise<SpecificDateAvailability> {
    const id = this.currentId.specificDateAvails++;
    const now = new Date();
    
    const availability: SpecificDateAvailability = {
      ...insertAvailability,
      id,
      createdAt: now,
      // Ensure required fields have default values
      isAvailable: insertAvailability.isAvailable ?? true,
      note: insertAvailability.note || null
    };
    
    this.specificDateAvails.set(id, availability);
    return availability;
  }

  async updateSpecificDateAvailability(id: number, updates: Partial<SpecificDateAvailability>): Promise<SpecificDateAvailability> {
    const availability = this.specificDateAvails.get(id);
    if (!availability) {
      throw new Error('Specific date availability not found');
    }
    
    const updatedAvailability = { ...availability, ...updates };
    this.specificDateAvails.set(id, updatedAvailability);
    return updatedAvailability;
  }

  async deleteSpecificDateAvailability(id: number): Promise<void> {
    if (!this.specificDateAvails.has(id)) {
      throw new Error('Specific date availability not found');
    }
    
    this.specificDateAvails.delete(id);
  }

  // Blocked Time Periods methods
  async getBlockedTimePeriods(userId: number, startDate?: Date, endDate?: Date): Promise<BlockedTimePeriod[]> {
    let blocked = Array.from(this.blockedTimes.values()).filter(
      (block) => block.userId === userId
    );
    
    if (startDate && endDate) {
      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();
      
      blocked = blocked.filter(block => {
        // Check if there is any overlap between the two date ranges
        const blockStart = new Date(block.startDateTime).getTime();
        const blockEnd = new Date(block.endDateTime).getTime();
        
        return (blockStart <= endTimestamp) && (blockEnd >= startTimestamp);
      });
    } else if (startDate) {
      const startTimestamp = startDate.getTime();
      
      blocked = blocked.filter(block => {
        const blockEnd = new Date(block.endDateTime).getTime();
        return blockEnd >= startTimestamp;
      });
    } else if (endDate) {
      const endTimestamp = endDate.getTime();
      
      blocked = blocked.filter(block => {
        const blockStart = new Date(block.startDateTime).getTime();
        return blockStart <= endTimestamp;
      });
    }
    
    return blocked;
  }

  async createBlockedTimePeriod(insertBlocked: InsertBlockedTimePeriod): Promise<BlockedTimePeriod> {
    const id = this.currentId.blockedTimes++;
    const now = new Date();
    
    const blocked: BlockedTimePeriod = {
      ...insertBlocked,
      id,
      createdAt: now,
      // Ensure required fields have default values
      isRecurring: insertBlocked.isRecurring ?? false,
      reason: insertBlocked.reason || null,
      recurringPattern: insertBlocked.recurringPattern || null
    };
    
    this.blockedTimes.set(id, blocked);
    return blocked;
  }

  async updateBlockedTimePeriod(id: number, updates: Partial<BlockedTimePeriod>): Promise<BlockedTimePeriod> {
    const blocked = this.blockedTimes.get(id);
    if (!blocked) {
      throw new Error('Blocked time period not found');
    }
    
    const updatedBlocked = { ...blocked, ...updates };
    this.blockedTimes.set(id, updatedBlocked);
    return updatedBlocked;
  }

  async deleteBlockedTimePeriod(id: number): Promise<void> {
    if (!this.blockedTimes.has(id)) {
      throw new Error('Blocked time period not found');
    }
    
    this.blockedTimes.delete(id);
  }

  // Calendar integration methods
  async saveCalendarCredentials(userId: number, provider: string, token: string, refreshToken: string, expiry: Date): Promise<UserAvailabilityPreferences> {
    const preferences = await this.getUserAvailabilityPreferences(userId);
    
    if (preferences) {
      // Update existing preferences
      return this.updateUserAvailabilityPreferences(userId, {
        calendarProvider: provider,
        calendarToken: token,
        calendarRefreshToken: refreshToken,
        calendarTokenExpiry: expiry,
        allowCalendarSync: true
      });
    } else {
      // Create new preferences
      return this.createUserAvailabilityPreferences({
        userId,
        timezone: "UTC", // Default
        allowCalendarSync: true,
        calendarProvider: provider,
        calendarToken: token,
        calendarRefreshToken: refreshToken,
        calendarTokenExpiry: expiry
      });
    }
  }

  async syncUserCalendar(userId: number): Promise<boolean> {
    // In a real implementation, this would connect to the calendar API
    // and sync events to blocked time periods
    
    const preferences = await this.getUserAvailabilityPreferences(userId);
    
    if (!preferences || !preferences.allowCalendarSync || !preferences.calendarToken) {
      return false;
    }
    
    // Check if token is expired
    if (preferences.calendarTokenExpiry && new Date(preferences.calendarTokenExpiry) < new Date()) {
      // Token is expired, would need to refresh in a real implementation
      return false;
    }
    
    // Simulate successful sync
    return true;
  }

  // Availability calculation methods
  async getUserAvailableTimeSlots(userId: number, date: Date): Promise<{startTime: Date, endTime: Date}[]> {
    // Create a date range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // First, check for specific date availability on this date
    const specificDateAvailability = await this.getSpecificDateAvailability(
      userId, 
      startOfDay, 
      endOfDay
    );
    
    if (specificDateAvailability.length > 0) {
      // Return time slots from specific date availability
      return specificDateAvailability.filter(avail => avail.isAvailable).map(avail => {
        const startTime = new Date(date);
        const [startHours, startMinutes] = avail.startTime.split(':').map(Number);
        startTime.setHours(startHours, startMinutes, 0, 0);
        
        const endTime = new Date(date);
        const [endHours, endMinutes] = avail.endTime.split(':').map(Number);
        endTime.setHours(endHours, endMinutes, 0, 0);
        
        return { startTime, endTime };
      });
    }
    
    // No specific date availability, check weekly availability for this day of week
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const weeklyAvailability = (await this.getWeeklyAvailability(userId))
      .filter(avail => avail.dayOfWeek === dayOfWeek && avail.isActive);
    
    // Convert weekly availability to time slots
    const availableTimeSlots = weeklyAvailability.map(avail => {
      const startTime = new Date(date);
      const [startHours, startMinutes] = avail.startTime.split(':').map(Number);
      startTime.setHours(startHours, startMinutes, 0, 0);
      
      const endTime = new Date(date);
      const [endHours, endMinutes] = avail.endTime.split(':').map(Number);
      endTime.setHours(endHours, endMinutes, 0, 0);
      
      return { startTime, endTime };
    });
    
    // Now remove any blocked time periods
    const blockedPeriods = await this.getBlockedTimePeriods(userId, startOfDay, endOfDay);
    
    if (blockedPeriods.length === 0) {
      return availableTimeSlots;
    }
    
    // Filter out or split time slots that overlap with blocked periods
    const finalTimeSlots: {startTime: Date, endTime: Date}[] = [];
    
    for (const slot of availableTimeSlots) {
      let currentSlot = { ...slot };
      let isBlocked = false;
      
      for (const blocked of blockedPeriods) {
        const blockStart = new Date(blocked.startDateTime);
        const blockEnd = new Date(blocked.endDateTime);
        
        // If blocked period fully contains the slot
        if (blockStart <= currentSlot.startTime && blockEnd >= currentSlot.endTime) {
          isBlocked = true;
          break;
        }
        
        // If blocked period starts in the middle of the slot
        if (blockStart > currentSlot.startTime && blockStart < currentSlot.endTime) {
          // End the current slot at the blocked period start
          currentSlot.endTime = new Date(blockStart);
        }
        
        // If blocked period ends in the middle of the slot
        if (blockEnd > currentSlot.startTime && blockEnd < currentSlot.endTime) {
          // Start the current slot at the blocked period end
          currentSlot.startTime = new Date(blockEnd);
        }
      }
      
      // Add the slot if it's not completely blocked and has a valid duration
      if (!isBlocked && currentSlot.startTime < currentSlot.endTime) {
        finalTimeSlots.push(currentSlot);
      }
    }
    
    return finalTimeSlots;
  }

  async checkUserAvailability(userId: number, startTime: Date, endTime: Date): Promise<boolean> {
    // First, get available time slots for the day
    const date = new Date(startTime);
    date.setHours(0, 0, 0, 0); // Start of day
    
    const availableTimeSlots = await this.getUserAvailableTimeSlots(userId, date);
    
    // Check if any time slot fully contains the requested period
    return availableTimeSlots.some(slot => 
      slot.startTime <= startTime && slot.endTime >= endTime
    );
  }
  
  async getBucketListAnalytics(): Promise<{
    totalItems: number;
    achievedItems: number;
    inProgressItems: number;
    itemsByStatus: { status: string, count: number }[];
    itemsByUser: { userId: number, fullName: string, count: number }[];
    achievedByMonth: { month: string, count: number }[];
    linkedToExchanges: number;
    dreamFulfilledBadges: number;
  }> {
    const items = Array.from(this.bucketListItems.values());
    const badges = Array.from(this.badgeApprovals.values());
    
    // Calculate totals
    const totalItems = items.length;
    const achievedItems = items.filter(item => item.status === 'achieved').length;
    const inProgressItems = items.filter(item => item.status === 'in_progress').length;
    const linkedToExchanges = items.filter(item => item.exchangeId !== null).length;
    
    // Dream fulfilled badges (both pending and approved)
    const dreamFulfilledBadges = badges.filter(
      badge => badge.badgeType === 'dream' && 
               (badge.status === 'pending' || badge.status === 'approved')
    ).length;
    
    // Get items by status
    const statusMap: { [key: string]: number } = {
      'planned': 0,
      'in_progress': 0,
      'achieved': 0
    };
    
    items.forEach(item => {
      const status = item.status || 'planned';
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    
    const itemsByStatus = Object.entries(statusMap)
      .map(([status, count]) => ({ status, count }));
    
    // Get items by user
    const userItemsMap: { [key: number]: number } = {};
    
    items.forEach(item => {
      userItemsMap[item.userId] = (userItemsMap[item.userId] || 0) + 1;
    });
    
    const itemsByUser = await Promise.all(
      Object.entries(userItemsMap).map(async ([userIdStr, count]) => {
        const userId = parseInt(userIdStr);
        const user = await this.getUser(userId);
        return {
          userId,
          fullName: user ? user.fullName : 'Unknown User',
          count
        };
      })
    );
    
    // Sort by count (highest first)
    itemsByUser.sort((a, b) => b.count - a.count);
    
    // Get achieved items by month
    const achievedByMonthMap: { [key: string]: number } = {};
    
    items
      .filter(item => item.status === 'achieved' && item.achievedDate)
      .forEach(item => {
        const date = new Date(item.achievedDate!);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!achievedByMonthMap[monthKey]) {
          achievedByMonthMap[monthKey] = 0;
        }
        achievedByMonthMap[monthKey]++;
      });
    
    // Convert to array and sort by month
    const achievedByMonth = Object.entries(achievedByMonthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    return {
      totalItems,
      achievedItems,
      inProgressItems,
      itemsByStatus,
      itemsByUser,
      achievedByMonth,
      linkedToExchanges,
      dreamFulfilledBadges
    };
  }

  private _initializeDummyData() {
    // This is just for development testing, will be replaced by actual user data
    const users: InsertUser[] = [
      {
        username: 'emmasmith',
        password: 'password123',
        fullName: 'Emma Wilson',
        email: 'emma@example.com',
        location: 'San Francisco, CA',
        bio: 'Photographer and outdoor enthusiast',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        timeCredits: 45
      },
      {
        username: 'davidkim',
        password: 'password123',
        fullName: 'David Kim',
        email: 'david@example.com',
        location: 'Los Angeles, CA',
        bio: 'Drone pilot and videographer',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        timeCredits: 30
      },
      {
        username: 'sarahjohnson',
        password: 'password123',
        fullName: 'Sarah Johnson',
        email: 'sarah@example.com',
        location: 'New York, NY',
        bio: 'Chef and cooking instructor',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        timeCredits: 60
      },
      {
        username: 'testadmin2',
        password: '204866b01b6658954f8866e1fe98c5b5b273de5cbf8eae7f966e3a65fc2cb648.c2ec0c893da84c6f2026a1b40087eceb', // hashed password for 'admin123'
        fullName: 'Admin User',
        email: 'admin@example.com',
        location: 'San Francisco, CA',
        bio: 'System administrator',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        role: 'admin',
        timeCredits: 0
      }
    ];
    
    // Create dummy users
    const userIds: number[] = [];
    users.forEach(user => {
      const id = this.currentId.users++;
      userIds.push(id);
      const now = new Date();
      this.users.set(id, { 
        ...user, 
        id, 
        createdAt: now, 
        location: user.location ?? null,
        bio: user.bio ?? null,
        avatarUrl: user.avatarUrl ?? null,
        role: user.role || 'user',
        timeCredits: user.timeCredits || 0
      });
    });
    
    // Create a test exchange
    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 3); // Three days from now
    
    const exchangeId = this.currentId.exchanges++;
    const testExchange = {
      id: exchangeId,
      requestorId: userIds[0], // Emma
      providerId: userIds[1],  // David
      title: "Test Photography Session",
      description: "Emma will teach David about landscape photography",
      status: "active",
      scheduledDate,
      duration: 60,
      durationMinutes: 60,
      requestorConfirmed: false,
      providerConfirmed: false,
      createdAt: now
    };
    
    this.exchanges.set(exchangeId, testExchange);
    
    // Create a disputed exchange for testing
    const disputeId = this.currentId.disputedExchanges++;
    const dispute = {
      id: disputeId,
      exchangeId: exchangeId,
      reporterId: userIds[0], // Emma
      reason: "Schedule conflict",
      details: "The provider didn't show up at the agreed time.",
      status: "pending",
      adminNotes: null,
      mediationRequired: true,
      createdAt: now,
      resolvedAt: null,
      resolvedBy: null
    };
    
    this.disputedExchanges.set(disputeId, dispute);
    
    // Create a badge approval request for testing
    const badgeApprovalId = this.currentId.badgeApprovals++;
    const badgeApproval = {
      id: badgeApprovalId,
      userId: userIds[1], // David
      badgeType: "mentor",
      triggeredCriteria: "5+ teaching exchanges",
      status: "pending",
      adminNotes: null,
      createdAt: now,
      reviewedAt: null,
      reviewedBy: null
    };
    
    this.badgeApprovals.set(badgeApprovalId, badgeApproval);
    
    // Create sample availability preferences for Emma (userIds[0])
    const preferencesId = this.currentId.userAvailabilityPrefs++;
    const preferences: UserAvailabilityPreferences = {
      id: preferencesId,
      userId: userIds[0],
      timezone: "America/Los_Angeles", // Required field with default value
      allowCalendarSync: false, // Required field with default value
      calendarProvider: null,
      calendarToken: null,
      calendarRefreshToken: null,
      calendarTokenExpiry: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.userAvailabilityPrefs.set(preferencesId, preferences);
    
    // Create weekly availability slots for Emma
    const weekDays = [1, 2, 3, 4, 5]; // Monday to Friday
    
    weekDays.forEach(day => {
      // Morning availability (9 AM - 12 PM)
      const morningId = this.currentId.weeklyAvails++;
      const morningAvail: WeeklyAvailability = {
        id: morningId,
        userId: userIds[0],
        dayOfWeek: day,
        startTime: "09:00:00",
        endTime: "12:00:00",
        isActive: true,
        createdAt: now
      };
      
      this.weeklyAvails.set(morningId, morningAvail);
      
      // Afternoon availability (2 PM - 5 PM)
      const afternoonId = this.currentId.weeklyAvails++;
      const afternoonAvail: WeeklyAvailability = {
        id: afternoonId,
        userId: userIds[0],
        dayOfWeek: day,
        startTime: "14:00:00",
        endTime: "17:00:00",
        isActive: true,
        createdAt: now
      };
      
      this.weeklyAvails.set(afternoonId, afternoonAvail);
    });
    
    // Create a specific date availability for next Saturday
    const nextSaturday = new Date();
    const daysUntilNextSaturday = (6 - nextSaturday.getDay() + 7) % 7;
    nextSaturday.setDate(nextSaturday.getDate() + daysUntilNextSaturday);
    
    const specificDateId = this.currentId.specificDateAvails++;
    const specificAvail: SpecificDateAvailability = {
      id: specificDateId,
      userId: userIds[0],
      date: nextSaturday,
      startTime: "10:00:00",
      endTime: "15:00:00",
      isAvailable: true,
      note: "Available for photography exchanges only",
      createdAt: now
    };
    
    this.specificDateAvails.set(specificDateId, specificAvail);
    
    // Create a blocked time period for tomorrow afternoon
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const blockStart = new Date(tomorrow);
    blockStart.setHours(13, 0, 0, 0);
    
    const blockEnd = new Date(tomorrow);
    blockEnd.setHours(15, 0, 0, 0);
    
    const blockedTimeId = this.currentId.blockedTimes++;
    const blockedTime: BlockedTimePeriod = {
      id: blockedTimeId,
      userId: userIds[0],
      startDateTime: blockStart,
      endDateTime: blockEnd,
      reason: "Doctor's appointment",
      isRecurring: false,
      recurringPattern: null,
      createdAt: now
    };
    
    this.blockedTimes.set(blockedTimeId, blockedTime);
  }
}

export const storage = new MemStorage();

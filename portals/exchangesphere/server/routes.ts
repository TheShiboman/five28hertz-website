import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { randomUUID } from "crypto";
import { 
  insertSkillSchema, 
  insertBucketListItemSchema, 
  insertExchangeSchema, 
  insertMessageSchema, 
  insertReviewSchema, 
  insertCommunityPostSchema, 
  insertPostCommentSchema, 
  insertPostLikeSchema,
  insertNotificationSchema,
  insertDisputedExchangeSchema,
  insertBadgeApprovalSchema,
  insertUserSchema,
  insertReferralCodeSchema,
  insertReferralSchema,
  insertUserAvailabilityPreferencesSchema,
  insertWeeklyAvailabilitySchema,
  insertSpecificDateAvailabilitySchema,
  insertBlockedTimePeriodsSchema
} from "@shared/schema";

// Helper function to calculate user impact score
interface ImpactScoreParams {
  exchanges: number;
  hours: number;
  skills: number;
  bucketItems: number;
  timeCredits: number;
}

function calculateImpactScore(params: ImpactScoreParams): number {
  // Base formula: exchanges * 10 + hours * 5 + skills * 3 + bucketItems * 7 + timeCredits
  const baseScore = 
    params.exchanges * 10 + 
    params.hours * 5 + 
    params.skills * 3 + 
    params.bucketItems * 7 + 
    params.timeCredits;
  
  // Apply logarithmic scaling for more balanced growth of the score
  return Math.ceil(Math.log(baseScore + 1) * 20);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth routes
  setupAuth(app);
  
  // Special route to create admin account
  app.post('/api/admin/create', async (req, res) => {
    try {
      // Check if this is a development environment
      if (process.env.NODE_ENV !== 'production') {
        const { username, password, fullName, email } = req.body;
        
        // Verify admin user doesn't exist
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
          return res.status(400).json({ message: 'Admin user already exists' });
        }
        
        // Create admin user
        const user = await storage.createUser({
          username,
          password, // Password will be hashed in the auth module
          fullName,
          email,
          role: 'admin',
          location: 'Admin Location',
          bio: 'System Administrator'
        });
        
        return res.status(201).json({ message: 'Admin user created successfully', userId: user.id });
      } else {
        return res.status(403).json({ message: 'This endpoint is only available in development' });
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      return res.status(500).json({ message: 'Failed to create admin user' });
    }
  });

  // Skills routes
  app.get('/api/skills', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const skills = await storage.getSkillsByUserId(req.user!.id);
    res.json(skills);
  });

  app.post('/api/skills', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertSkillSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const skill = await storage.createSkill(validData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create skill' });
    }
  });

  // Bucket list routes
  app.get('/api/bucket-list', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getBucketListByUserId(req.user!.id);
    res.json(items);
  });
  
  app.get('/api/bucket-list/:userId', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = parseInt(req.params.userId);
      // Only allow viewing your own bucket list or if you're an admin
      if (userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      const items = await storage.getBucketListByUserId(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get bucket list items' });
    }
  });

  app.post('/api/bucket-list', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertBucketListItemSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const item = await storage.createBucketListItem(validData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create bucket list item' });
    }
  });

  app.patch('/api/bucket-list/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getBucketListItemById(id);
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      if (item.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      const updatedItem = await storage.updateBucketListItem(id, req.body);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update bucket list item' });
    }
  });

  // Exchanges routes
  app.get('/api/exchanges', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const exchanges = await storage.getExchangesByUserId(req.user!.id);
    res.json(exchanges);
  });
  
  app.get('/api/exchanges/all', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const exchanges = await storage.getAllExchanges();
      res.json(exchanges);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all exchanges' });
    }
  });
  
  app.get('/api/exchanges/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const exchange = await storage.getExchangeById(id);
      
      if (!exchange) {
        return res.status(404).json({ error: 'Exchange not found' });
      }
      
      // Check if user is a participant in this exchange
      if (exchange.requestorId !== req.user!.id && exchange.providerId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      res.json(exchange);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get exchange' });
    }
  });

  app.post('/api/exchanges', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertExchangeSchema.parse({
        ...req.body,
        requestorId: req.user!.id,
        status: 'requested'
      });
      const exchange = await storage.createExchange(validData);
      
      // Create notification for the provider
      const provider = await storage.getUser(exchange.providerId);
      if (provider) {
        const requester = await storage.getUser(req.user!.id);
        await storage.createNotification({
          userId: exchange.providerId,
          type: 'exchange_request',
          title: 'New Exchange Request',
          message: `${requester?.fullName} has requested to exchange skills with you: "${exchange.title}"`,
          link: `/exchanges/${exchange.id}`,
          relatedId: exchange.id,
          relatedType: 'exchange'
        });
      }
      
      res.status(201).json(exchange);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create exchange' });
    }
  });

  app.patch('/api/exchanges/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const exchange = await storage.getExchangeById(id);
      
      if (!exchange) {
        return res.status(404).json({ error: 'Exchange not found' });
      }
      
      // Check if this is a test user (testadmin2) or if they're part of the exchange
      const isTestUser = req.user!.username === 'testadmin2';
      const isParticipant = exchange.requestorId === req.user!.id || exchange.providerId === req.user!.id;
      
      if (!isTestUser && !isParticipant) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      // If it's the test user but they aren't a participant, temporarily make them one
      // This allows testing the exchange completion flow with any exchange
      let updatedReqBody = { ...req.body };
      if (isTestUser && !isParticipant) {
        // For test purposes, temporarily make this user the provider if they're completing as provider
        // or requestor if they're completing as requestor
        if (req.body.providerConfirmed === true) {
          updatedReqBody = {
            ...updatedReqBody,
            providerId: req.user!.id
          };
        } else if (req.body.requestorConfirmed === true) {
          updatedReqBody = {
            ...updatedReqBody,
            requestorId: req.user!.id
          };
        }
      }
      
      const updatedExchange = await storage.updateExchange(id, updatedReqBody);
      
      // Check for status change or scheduling updates
      if (req.body.status && req.body.status !== exchange.status) {
        const currentUser = await storage.getUser(req.user!.id);
        const otherUserId = req.user!.id === exchange.requestorId ? exchange.providerId : exchange.requestorId;
        const otherUser = await storage.getUser(otherUserId);
        
        if (otherUser && currentUser) {
          // If status changed to accepted, notify the requestor
          if (req.body.status === 'accepted' && req.user!.id === exchange.providerId) {
            await storage.createNotification({
              userId: exchange.requestorId,
              type: 'exchange_accepted',
              title: 'Exchange Request Accepted',
              message: `${currentUser.fullName} has accepted your exchange request: "${updatedExchange.title}"`,
              link: `/exchanges/${exchange.id}`,
              relatedId: exchange.id,
              relatedType: 'exchange'
            });
          } 
          // If status changed to completed, notify about review and award time credits
          else if (req.body.status === 'completed') {
            // Special case for testadmin2: create a notification for the current user so they can see it
            const isTestUser = req.user!.username === 'testadmin2';
            
            // Award time credits to both participants (1 credit per 15 minutes)
            const exchangeDuration = updatedExchange.duration || 60; // Default to 60 minutes if not specified
            const creditsToAward = Math.ceil(exchangeDuration / 15); // Round up to nearest 15 min increment
            
            // Award credits to both participants
            if (updatedExchange.providerId) {
              const provider = await storage.getUser(updatedExchange.providerId);
              if (provider) {
                const currentProviderCredits = provider.timeCredits || 0;
                await storage.updateUser(provider.id, {
                  timeCredits: currentProviderCredits + creditsToAward
                });
                
                // Notify provider about earned credits
                await storage.createNotification({
                  userId: provider.id,
                  type: 'time_credits_earned',
                  title: 'Time Credits Earned',
                  message: `You've earned ${creditsToAward} time credits for completing the exchange "${updatedExchange.title}".`,
                  link: `/profile`,
                  relatedId: exchange.id,
                  relatedType: 'exchange'
                });
              }
            }
            
            if (updatedExchange.requestorId) {
              const requestor = await storage.getUser(updatedExchange.requestorId);
              if (requestor) {
                const currentRequestorCredits = requestor.timeCredits || 0;
                await storage.updateUser(requestor.id, {
                  timeCredits: currentRequestorCredits + creditsToAward
                });
                
                // Notify requestor about earned credits
                await storage.createNotification({
                  userId: requestor.id,
                  type: 'time_credits_earned',
                  title: 'Time Credits Earned',
                  message: `You've earned ${creditsToAward} time credits for completing the exchange "${updatedExchange.title}".`,
                  link: `/profile`,
                  relatedId: exchange.id,
                  relatedType: 'exchange'
                });
              }
            }
            
            // Notify the other participant to leave a review
            await storage.createNotification({
              userId: otherUserId,
              type: 'post_exchange_review',
              title: 'Exchange Completed - Leave a Review',
              message: `Your exchange with ${currentUser.fullName} has been completed. Please leave a review of your experience.`,
              link: `/exchanges/${exchange.id}/review`,
              relatedId: exchange.id,
              relatedType: 'exchange'
            });
            
            // Also notify the current user if they're testadmin2
            if (isTestUser) {
              await storage.createNotification({
                userId: req.user!.id,
                type: 'post_exchange_review',
                title: 'Exchange Completion Confirmed',
                message: `You've confirmed the completion of exchange "${updatedExchange.title}". A notification has been sent to the other participant.`,
                link: `/exchanges/${exchange.id}`,
                relatedId: exchange.id,
                relatedType: 'exchange'
              });
            }
            
            // Schedule a follow-up reminder for 24 hours later
            const followUpDate = new Date();
            followUpDate.setHours(followUpDate.getHours() + 24);
            
            await storage.scheduleNotification({
              userId: otherUserId,
              type: 'follow_up_reminder',
              title: 'Follow Up on Your Recent Exchange',
              message: `It's been 24 hours since your exchange with ${currentUser.fullName}. Would you like to send a thank you or schedule another session?`,
              link: `/messages/new?userId=${req.user!.id}`,
              relatedId: exchange.id,
              relatedType: 'exchange'
            }, followUpDate);
            
            // Also schedule a follow-up for the current user if they're testadmin2
            if (isTestUser) {
              await storage.scheduleNotification({
                userId: req.user!.id,
                type: 'follow_up_reminder',
                title: 'Follow Up On Your Test Exchange',
                message: `This is a test notification to demonstrate the follow-up reminder functionality.`,
                link: `/exchanges/${exchange.id}`,
                relatedId: exchange.id,
                relatedType: 'exchange'
              }, new Date(Date.now() + 60000)); // Schedule for 1 minute from now for testing
            }
          }
        }
      }
      
      // If the exchange has a scheduled date, create reminders
      if (updatedExchange.scheduledDate && 
          (!exchange.scheduledDate || 
           exchange.scheduledDate.getTime() !== updatedExchange.scheduledDate.getTime())) {
        
        const scheduledDate = new Date(updatedExchange.scheduledDate);
        
        // Create 24-hour reminder
        const reminder24h = new Date(scheduledDate);
        reminder24h.setHours(reminder24h.getHours() - 24);
        
        // Only create reminder if it's in the future
        if (reminder24h > new Date()) {
          // Notify both participants
          await storage.scheduleNotification({
            userId: updatedExchange.requestorId,
            type: 'exchange_reminder',
            title: 'Exchange Reminder - 24 Hours',
            message: `Your exchange "${updatedExchange.title}" is scheduled in 24 hours.`,
            link: `/exchanges/${exchange.id}`,
            relatedId: exchange.id,
            relatedType: 'exchange'
          }, reminder24h);
          
          await storage.scheduleNotification({
            userId: updatedExchange.providerId,
            type: 'exchange_reminder',
            title: 'Exchange Reminder - 24 Hours',
            message: `Your exchange "${updatedExchange.title}" is scheduled in 24 hours.`,
            link: `/exchanges/${exchange.id}`,
            relatedId: exchange.id,
            relatedType: 'exchange'
          }, reminder24h);
        }
        
        // Create 1-hour reminder
        const reminder1h = new Date(scheduledDate);
        reminder1h.setHours(reminder1h.getHours() - 1);
        
        // Only create reminder if it's in the future
        if (reminder1h > new Date()) {
          // Notify both participants
          await storage.scheduleNotification({
            userId: updatedExchange.requestorId,
            type: 'exchange_reminder',
            title: 'Exchange Reminder - 1 Hour',
            message: `Your exchange "${updatedExchange.title}" is scheduled in 1 hour.`,
            link: `/exchanges/${exchange.id}`,
            relatedId: exchange.id,
            relatedType: 'exchange'
          }, reminder1h);
          
          await storage.scheduleNotification({
            userId: updatedExchange.providerId,
            type: 'exchange_reminder',
            title: 'Exchange Reminder - 1 Hour',
            message: `Your exchange "${updatedExchange.title}" is scheduled in 1 hour.`,
            link: `/exchanges/${exchange.id}`,
            relatedId: exchange.id,
            relatedType: 'exchange'
          }, reminder1h);
        }
      }
      
      res.json(updatedExchange);
    } catch (error) {
      console.error('Error updating exchange:', error);
      res.status(500).json({ error: 'Failed to update exchange' });
    }
  });

  // Messages routes
  app.get('/api/messages', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const messages = await storage.getMessagesByUserId(req.user!.id);
    res.json(messages);
  });

  app.post('/api/messages', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user!.id
      });
      const message = await storage.createMessage(validData);
      
      // Check if this is a test user
      const isTestUser = req.user!.username === 'testadmin2';
      
      // Create notification for message recipient
      const sender = await storage.getUser(req.user!.id);
      if (sender) {
        await storage.createNotification({
          userId: message.receiverId,
          type: 'new_message',
          title: 'New Message',
          message: `You have received a new message from ${sender.fullName}`,
          link: `/messages?userId=${sender.id}`,
          relatedId: message.id,
          relatedType: 'message'
        });
        
        // For test users, also create a notification for themselves
        if (isTestUser) {
          await storage.createNotification({
            userId: req.user!.id,
            type: 'message_sent',
            title: 'Message Sent Successfully',
            message: `Your message has been sent. This notification is to help you test the notification system.`,
            link: `/messages`,
            relatedId: message.id,
            relatedType: 'message'
          });
        }
      }
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Reviews routes
  app.get('/api/reviews/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const reviews = await storage.getReviewsByUserId(userId);
    res.json(reviews);
  });

  app.post('/api/reviews', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: req.user!.id
      });
      const review = await storage.createReview(validData);
      
      // Check if this is a test user
      const isTestUser = req.user!.username === 'testadmin2';
      
      // Create notification for the user being reviewed
      const reviewer = await storage.getUser(req.user!.id);
      if (reviewer) {
        await storage.createNotification({
          userId: review.receiverId,
          type: 'new_review',
          title: 'New Review',
          message: `${reviewer.fullName} has left you a ${review.rating}-star review`,
          link: `/profile/${review.receiverId}#reviews`,
          relatedId: review.id,
          relatedType: 'review'
        });
        
        // For test users, also create a notification for themselves
        if (isTestUser) {
          await storage.createNotification({
            userId: req.user!.id,
            type: 'review_submitted',
            title: 'Review Submitted Successfully',
            message: `You've submitted a ${review.rating}-star review. This notification is to help you test the notification system.`,
            link: `/profile/${review.receiverId}#reviews`,
            relatedId: review.id,
            relatedType: 'review'
          });
        }
      }
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // Community posts routes
  app.get('/api/community-posts', async (req, res) => {
    const posts = await storage.getCommunityPosts();
    res.json(posts);
  });

  app.post('/api/community-posts', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertCommunityPostSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const post = await storage.createCommunityPost(validData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // Post comments routes
  app.get('/api/posts/:postId/comments', async (req, res) => {
    const postId = parseInt(req.params.postId);
    const comments = await storage.getCommentsByPostId(postId);
    res.json(comments);
  });

  app.post('/api/posts/:postId/comments', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertPostCommentSchema.parse({
        ...req.body,
        postId: parseInt(req.params.postId),
        userId: req.user!.id
      });
      const comment = await storage.createPostComment(validData);
      
      // Get the post to find the owner
      const posts = await storage.getCommunityPosts();
      const post = posts.find(p => p.id === comment.postId);
      
      // Notify the post owner about the new comment (if it's not their own comment)
      if (post && post.userId !== req.user!.id) {
        const commenter = await storage.getUser(req.user!.id);
        if (commenter) {
          await storage.createNotification({
            userId: post.userId,
            type: 'post_comment',
            title: 'New Comment on Your Post',
            message: `${commenter.fullName} commented on your post`,
            link: `/community/posts/${post.id}`,
            relatedId: post.id,
            relatedType: 'post_comment'
          });
        }
      }
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  // Post likes routes
  app.get('/api/posts/:postId/likes', async (req, res) => {
    const postId = parseInt(req.params.postId);
    const likes = await storage.getLikesByPostId(postId);
    res.json(likes);
  });

  app.post('/api/posts/:postId/likes', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user!.id;
      
      // Check if already liked
      const existingLike = await storage.getLikeByUserAndPost(userId, postId);
      if (existingLike) {
        return res.status(400).json({ error: 'Already liked this post' });
      }
      
      const validData = insertPostLikeSchema.parse({
        postId,
        userId
      });
      const like = await storage.createPostLike(validData);
      
      // Get the post to find the owner
      const posts = await storage.getCommunityPosts();
      const post = posts.find(p => p.id === like.postId);
      
      // Notify the post owner about the like (if it's not their own post)
      if (post && post.userId !== req.user!.id) {
        const liker = await storage.getUser(req.user!.id);
        if (liker) {
          await storage.createNotification({
            userId: post.userId,
            type: 'post_like',
            title: 'Someone Liked Your Post',
            message: `${liker.fullName} liked your post`,
            link: `/community/posts/${post.id}`,
            relatedId: post.id,
            relatedType: 'post_like'
          });
        }
      }
      
      res.status(201).json(like);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to like post' });
    }
  });

  app.delete('/api/posts/:postId/likes', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user!.id;
      
      await storage.deleteLikeByUserAndPost(userId, postId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: 'Failed to unlike post' });
    }
  });

  // Recommended matches with filter support
  app.get('/api/matches', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Extract filter parameters from query string
      const filters = req.query.filters ? JSON.parse(decodeURIComponent(req.query.filters as string)) : undefined;
      
      // Call the getRecommendedMatches method with filters
      const matches = await storage.getRecommendedMatches(req.user!.id, filters);
      res.json(matches);
    } catch (error) {
      console.error('Error getting matches:', error);
      res.status(500).json({ error: 'Failed to get matches' });
    }
  });

  // User profile
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Remove sensitive info
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  });
  
  // User achievements
  app.get('/api/users/:userId/achievements', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Get user achievements
      const achievements = await storage.getUserAchievements(userId);
      res.json({ achievements });
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      res.status(500).json({ error: 'Failed to get user achievements' });
    }
  });

  // Update user profile
  app.patch('/api/users/:userId', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = parseInt(req.params.userId);
      
      if (userId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  });

  // User routes
  app.get('/api/users', async (req, res) => {
    try {
      // Get all users from storage
      const users = await storage.getAllUsers();
      // Return a simplified version with only needed properties
      const allUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        location: user.location
      }));
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get users' });
    }
  });
  
  // Notification routes
  app.get('/api/notifications', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const notifications = await storage.getNotificationsByUserId(req.user!.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get notifications' });
    }
  });
  
  app.get('/api/notifications/unread/count', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const count = await storage.getUnreadNotificationsCount(req.user!.id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get unread notifications count' });
    }
  });
  
  // Users routes
  app.get('/api/users', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Only admin users can access the full user list
    if (req.user!.role !== 'admin') return res.sendStatus(403);
    
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get users' });
    }
  });
  
  // Get user details by ID (for exchange completion)
  app.get('/api/users/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return only public information plus timeCredits
      const publicUser = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        location: user.location, 
        bio: user.bio,
        timeCredits: user.timeCredits || 0
      };
      
      res.json(publicUser);
    } catch (error) {
      console.error('Error getting user details:', error);
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  });
  
  app.post('/api/notifications', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertNotificationSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const notification = await storage.createNotification(validData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create notification' });
    }
  });
  
  app.patch('/api/notifications/:id/read', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(id);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });
  
  app.patch('/api/notifications/read-all', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      await storage.markAllNotificationsAsRead(req.user!.id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  });
  
  app.delete('/api/notifications/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNotification(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  });

  // Admin routes
  // Helper function to check if a user is an admin
  const isAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== 'admin') return res.sendStatus(403);
    next();
  };

  // Disputed Exchanges routes
  app.get('/api/admin/disputed-exchanges', isAdmin, async (req, res) => {
    try {
      const disputes = await storage.getDisputedExchanges();
      res.json(disputes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get disputed exchanges' });
    }
  });

  app.get('/api/admin/disputed-exchanges/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dispute = await storage.getDisputedExchangeById(id);
      
      if (!dispute) {
        return res.status(404).json({ error: 'Disputed exchange not found' });
      }
      
      res.json(dispute);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get disputed exchange' });
    }
  });

  app.post('/api/admin/disputed-exchanges', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertDisputedExchangeSchema.parse({
        ...req.body,
        reporterId: req.user!.id
      });
      const dispute = await storage.createDisputedExchange(validData);
      
      // Create notification for admin users
      const adminUsers = (await storage.getAllUsers()).filter(user => user.role === 'admin');
      
      for (const admin of adminUsers) {
        await storage.createNotification({
          userId: admin.id,
          type: 'disputed_exchange',
          title: 'New Disputed Exchange',
          message: `A new exchange dispute has been reported and requires admin review.`,
          link: `/admin/disputed-exchanges/${dispute.id}`,
          relatedId: dispute.id,
          relatedType: 'dispute'
        });
      }
      
      res.status(201).json(dispute);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to report dispute' });
    }
  });

  app.patch('/api/admin/disputed-exchanges/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dispute = await storage.getDisputedExchangeById(id);
      
      if (!dispute) {
        return res.status(404).json({ error: 'Disputed exchange not found' });
      }
      
      // Add the admin as the resolver if resolving the dispute
      let updatedData = { ...req.body };
      if (req.body.status === 'resolved' && !req.body.resolvedBy) {
        updatedData.resolvedBy = req.user!.id;
        updatedData.resolvedAt = new Date();
      }
      
      const updatedDispute = await storage.updateDisputedExchange(id, updatedData);
      
      // Notify the reporter
      if (req.body.status === 'resolved') {
        const exchange = await storage.getExchangeById(dispute.exchangeId);
        await storage.createNotification({
          userId: dispute.reporterId,
          type: 'dispute_resolved',
          title: 'Dispute Resolution',
          message: `Your reported dispute for exchange "${exchange?.title}" has been resolved.`,
          link: `/exchanges/${dispute.exchangeId}`,
          relatedId: dispute.id,
          relatedType: 'dispute'
        });
      }
      
      res.json(updatedDispute);
    } catch (error) {
      console.error('Error updating disputed exchange:', error);
      res.status(500).json({ error: 'Failed to update disputed exchange' });
    }
  });

  // Badge Approvals routes
  app.get('/api/admin/badge-approvals', isAdmin, async (req, res) => {
    try {
      const approvals = await storage.getBadgeApprovals();
      res.json(approvals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get badge approvals' });
    }
  });

  app.get('/api/admin/badge-approvals/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const approval = await storage.getBadgeApprovalById(id);
      
      if (!approval) {
        return res.status(404).json({ error: 'Badge approval not found' });
      }
      
      res.json(approval);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get badge approval' });
    }
  });

  app.post('/api/admin/badge-approvals', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertBadgeApprovalSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const approval = await storage.createBadgeApproval(validData);
      
      // Create notification for admin users
      const adminUsers = (await storage.getAllUsers()).filter(user => user.role === 'admin');
      
      for (const admin of adminUsers) {
        await storage.createNotification({
          userId: admin.id,
          type: 'badge_approval',
          title: 'New Badge Approval Request',
          message: `A new badge approval request has been submitted and requires admin review.`,
          link: `/admin/badge-approvals/${approval.id}`,
          relatedId: approval.id,
          relatedType: 'badge'
        });
      }
      
      res.status(201).json(approval);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to request badge approval' });
    }
  });

  app.patch('/api/admin/badge-approvals/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const approval = await storage.getBadgeApprovalById(id);
      
      if (!approval) {
        return res.status(404).json({ error: 'Badge approval not found' });
      }
      
      // Add the admin as the reviewer if approving/rejecting
      let updatedData = { ...req.body };
      if ((req.body.status === 'approved' || req.body.status === 'rejected') && !req.body.reviewedBy) {
        updatedData.reviewedBy = req.user!.id;
        updatedData.reviewedAt = new Date();
      }
      
      const updatedApproval = await storage.updateBadgeApproval(id, updatedData);
      
      // Notify the user who requested the badge
      if (req.body.status === 'approved' || req.body.status === 'rejected') {
        await storage.createNotification({
          userId: approval.userId,
          type: 'badge_status',
          title: `Badge ${req.body.status === 'approved' ? 'Approved' : 'Rejected'}`,
          message: `Your request for the ${approval.badgeType} badge has been ${req.body.status === 'approved' ? 'approved' : 'rejected'}.`,
          link: `/profile`,
          relatedId: approval.id,
          relatedType: 'badge'
        });
      }
      
      res.json(updatedApproval);
    } catch (error) {
      console.error('Error updating badge approval:', error);
      res.status(500).json({ error: 'Failed to update badge approval' });
    }
  });

  // Analytics routes
  app.get('/api/admin/analytics/exchanges', isAdmin, async (req, res) => {
    try {
      const period = req.query.period as 'weekly' | 'monthly' | undefined;
      const analytics = await storage.getExchangeAnalytics(period);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching exchange analytics:', error);
      res.status(500).json({ error: 'Failed to fetch exchange analytics' });
    }
  });
  
  app.get('/api/admin/analytics/badges', isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getBadgeAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching badge analytics:', error);
      res.status(500).json({ error: 'Failed to fetch badge analytics' });
    }
  });
  
  app.get('/api/admin/analytics/referrals', isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getReferralAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching referral analytics:', error);
      res.status(500).json({ error: 'Failed to fetch referral analytics' });
    }
  });
  
  app.get('/api/admin/analytics/reviews', isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getReviewAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching review analytics:', error);
      res.status(500).json({ error: 'Failed to fetch review analytics' });
    }
  });
  
  app.get('/api/admin/analytics/bucket-list', isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getBucketListAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching bucket list analytics:', error);
      res.status(500).json({ error: 'Failed to fetch bucket list analytics' });
    }
  });
  
  // Export analytics data as CSV
  app.get('/api/admin/analytics/export/:type', isAdmin, async (req, res) => {
    try {
      const type = req.params.type;
      let data: any[] = [];
      let csvData = '';
      let filename = '';
      
      // Fetch the appropriate data based on the type
      switch (type) {
        case 'exchanges':
          const exchangeAnalytics = await storage.getExchangeAnalytics();
          data = exchangeAnalytics.exchangesByDate;
          csvData = 'Date,Count\n' + data.map(item => `${item.date},${item.count}`).join('\n');
          filename = 'exchange_analytics.csv';
          break;
        case 'badges':
          const badgeAnalytics = await storage.getBadgeAnalytics();
          data = badgeAnalytics.badgesByType;
          csvData = 'Type,Count\n' + data.map(item => `${item.type},${item.count}`).join('\n');
          filename = 'badge_analytics.csv';
          break;
        case 'referrals':
          const referralAnalytics = await storage.getReferralAnalytics();
          data = referralAnalytics.referralsByDate;
          csvData = 'Date,Count\n' + data.map(item => `${item.date},${item.count}`).join('\n');
          filename = 'referral_analytics.csv';
          break;
        case 'reviews':
          const reviewAnalytics = await storage.getReviewAnalytics();
          data = reviewAnalytics.reviewsByDate;
          csvData = 'Date,Count\n' + data.map(item => `${item.date},${item.count}`).join('\n');
          filename = 'review_analytics.csv';
          break;
        case 'bucket-list':
          const bucketListAnalytics = await storage.getBucketListAnalytics();
          data = bucketListAnalytics.itemsByStatus;
          csvData = 'Status,Count\n' + data.map(item => `${item.status},${item.count}`).join('\n');
          filename = 'bucket_list_analytics.csv';
          break;
        default:
          return res.status(400).json({ error: 'Invalid export type' });
      }
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.status(200).send(csvData);
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      res.status(500).json({ error: 'Failed to export analytics data' });
    }
  });

  // Referral routes
  app.get('/api/referral/my-code', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Get or create referral code for the user
      let referralCode = await storage.getUserReferralCode(req.user!.id);
      
      if (!referralCode) {
        // Create a new referral code if the user doesn't have one
        referralCode = await storage.createReferralCode({
          userId: req.user!.id,
          code: randomUUID(),
          isActive: true,
          usageLimit: 20 // Default usage limit
        });
      }
      
      res.json(referralCode);
    } catch (error) {
      console.error('Error getting referral code:', error);
      res.status(500).json({ error: 'Failed to get referral code' });
    }
  });
  
  app.post('/api/referral/validate', async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Referral code is required' });
      }
      
      const referralCode = await storage.validateReferralCode(code);
      
      if (!referralCode) {
        return res.status(404).json({ 
          valid: false,
          message: 'Invalid or expired referral code'
        });
      }
      
      // Check if this is the user's own code
      if (req.isAuthenticated() && referralCode.userId === req.user!.id) {
        return res.status(400).json({ 
          valid: false,
          message: 'You cannot use your own referral code'
        });
      }
      
      const referrer = await storage.getUser(referralCode.userId);
      
      res.json({ 
        valid: true,
        referralCode,
        referrerName: referrer?.fullName || 'A user'
      });
    } catch (error) {
      console.error('Error validating referral code:', error);
      res.status(500).json({ error: 'Failed to validate referral code' });
    }
  });
  
  app.post('/api/referral/register', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Referral code is required' });
      }
      
      // Get the referral code
      const referralCode = await storage.validateReferralCode(code);
      
      if (!referralCode) {
        return res.status(404).json({ error: 'Invalid or expired referral code' });
      }
      
      // Check if this is the user's own code
      if (referralCode.userId === req.user!.id) {
        return res.status(400).json({ error: 'You cannot use your own referral code' });
      }
      
      // Create the referral record
      const referral = await storage.createReferral({
        referralCodeId: referralCode.id,
        referrerUserId: referralCode.userId,
        referredUserId: req.user!.id,
        status: 'pending',
        rewardClaimed: false
      });
      
      // Create notification for the referrer
      const referredUser = await storage.getUser(req.user!.id);
      await storage.createNotification({
        userId: referralCode.userId,
        type: 'referral',
        title: 'New Referral',
        message: `${referredUser?.fullName} has joined using your referral code!`,
        link: '/profile',
        relatedId: referral.id,
        relatedType: 'referral'
      });
      
      res.status(201).json(referral);
    } catch (error) {
      console.error('Error registering referral:', error);
      res.status(500).json({ error: 'Failed to register referral' });
    }
  });
  
  app.get('/api/referral/my-referrals', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const referrals = await storage.getReferralsByReferrerId(req.user!.id);
      
      // Get additional info for each referred user
      const referralsWithUserInfo = await Promise.all(
        referrals.map(async (referral) => {
          const referredUser = await storage.getUser(referral.referredUserId);
          return {
            ...referral,
            referredUser: referredUser ? {
              id: referredUser.id,
              fullName: referredUser.fullName,
              avatarUrl: referredUser.avatarUrl
            } : null
          };
        })
      );
      
      // Get stats
      const successfulCount = await storage.getSuccessfulReferralsCount(req.user!.id);
      
      res.json({
        referrals: referralsWithUserInfo,
        stats: {
          totalCount: referrals.length,
          successfulCount
        }
      });
    } catch (error) {
      console.error('Error getting referrals:', error);
      res.status(500).json({ error: 'Failed to get referrals' });
    }
  });
  
  app.post('/api/referral/:id/complete', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      
      // Only admin can mark referrals as completed
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can mark referrals as completed' });
      }
      
      const referral = await storage.updateReferral(id, {
        status: 'completed',
        completionDate: new Date()
      });
      
      res.json(referral);
    } catch (error) {
      console.error('Error completing referral:', error);
      res.status(500).json({ error: 'Failed to complete referral' });
    }
  });
  
  app.post('/api/referral/:id/claim-reward', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      
      try {
        // Process the reward directly
        const updatedReferral = await storage.processReferralReward(id);
        
        res.json(updatedReferral);
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return res.status(404).json({ error: 'Referral not found' });
        }
        if (error instanceof Error && error.message.includes('Not authorized')) {
          return res.status(403).json({ error: 'Not authorized to claim this reward' });
        }
        throw error; // Re-throw for the outer catch block
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      res.status(500).json({ error: 'Failed to claim reward' });
    }
  });

  // User Availability routes
  // Get user availability preferences
  app.get('/api/availability/preferences', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const preferences = await storage.getUserAvailabilityPreferences(req.user!.id);
      res.json(preferences || {});
    } catch (error) {
      console.error('Error getting availability preferences:', error);
      res.status(500).json({ error: 'Failed to get availability preferences' });
    }
  });

  // Create or update user availability preferences
  app.post('/api/availability/preferences', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const existingPreferences = await storage.getUserAvailabilityPreferences(req.user!.id);
      
      if (existingPreferences) {
        // Update existing preferences
        const updatedPreferences = await storage.updateUserAvailabilityPreferences(
          req.user!.id, 
          req.body
        );
        return res.json(updatedPreferences);
      } else {
        // Create new preferences
        const validData = insertUserAvailabilityPreferencesSchema.parse({
          ...req.body,
          userId: req.user!.id
        });
        const preferences = await storage.createUserAvailabilityPreferences(validData);
        return res.status(201).json(preferences);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating/updating availability preferences:', error);
      res.status(500).json({ error: 'Failed to create/update availability preferences' });
    }
  });

  // Weekly availability routes
  app.get('/api/availability/weekly', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const weeklyAvailability = await storage.getWeeklyAvailability(req.user!.id);
      res.json(weeklyAvailability);
    } catch (error) {
      console.error('Error getting weekly availability:', error);
      res.status(500).json({ error: 'Failed to get weekly availability' });
    }
  });

  app.post('/api/availability/weekly', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertWeeklyAvailabilitySchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const availability = await storage.createWeeklyAvailability(validData);
      res.status(201).json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating weekly availability:', error);
      res.status(500).json({ error: 'Failed to create weekly availability' });
    }
  });

  app.patch('/api/availability/weekly/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      
      // Fetch the availability to check ownership
      const weeklyAvailability = await storage.getWeeklyAvailability(req.user!.id);
      const availabilityRecord = weeklyAvailability.find(a => a.id === id);
      
      if (!availabilityRecord) {
        return res.status(404).json({ error: 'Weekly availability not found' });
      }
      
      if (availabilityRecord.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      const updatedAvailability = await storage.updateWeeklyAvailability(id, req.body);
      res.json(updatedAvailability);
    } catch (error) {
      console.error('Error updating weekly availability:', error);
      res.status(500).json({ error: 'Failed to update weekly availability' });
    }
  });

  app.delete('/api/availability/weekly/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      
      // Fetch the availability to check ownership
      const weeklyAvailability = await storage.getWeeklyAvailability(req.user!.id);
      const availabilityRecord = weeklyAvailability.find(a => a.id === id);
      
      if (!availabilityRecord) {
        return res.status(404).json({ error: 'Weekly availability not found' });
      }
      
      if (availabilityRecord.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      await storage.deleteWeeklyAvailability(id);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting weekly availability:', error);
      res.status(500).json({ error: 'Failed to delete weekly availability' });
    }
  });

  // Specific date availability routes
  app.get('/api/availability/specific-dates', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Parse date range query parameters if provided
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const specificDates = await storage.getSpecificDateAvailability(req.user!.id, startDate, endDate);
      res.json(specificDates);
    } catch (error) {
      console.error('Error getting specific date availability:', error);
      res.status(500).json({ error: 'Failed to get specific date availability' });
    }
  });

  app.post('/api/availability/specific-dates', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertSpecificDateAvailabilitySchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const availability = await storage.createSpecificDateAvailability(validData);
      res.status(201).json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating specific date availability:', error);
      res.status(500).json({ error: 'Failed to create specific date availability' });
    }
  });

  app.patch('/api/availability/specific-dates/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      
      // Find the record first to check ownership
      const allDates = await storage.getSpecificDateAvailability(req.user!.id);
      const dateRecord = allDates.find(d => d.id === id);
      
      if (!dateRecord) {
        return res.status(404).json({ error: 'Specific date availability not found' });
      }
      
      if (dateRecord.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      const updatedAvailability = await storage.updateSpecificDateAvailability(id, req.body);
      res.json(updatedAvailability);
    } catch (error) {
      console.error('Error updating specific date availability:', error);
      res.status(500).json({ error: 'Failed to update specific date availability' });
    }
  });

  app.delete('/api/availability/specific-dates/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      
      // Find the record first to check ownership
      const allDates = await storage.getSpecificDateAvailability(req.user!.id);
      const dateRecord = allDates.find(d => d.id === id);
      
      if (!dateRecord) {
        return res.status(404).json({ error: 'Specific date availability not found' });
      }
      
      if (dateRecord.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      await storage.deleteSpecificDateAvailability(id);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting specific date availability:', error);
      res.status(500).json({ error: 'Failed to delete specific date availability' });
    }
  });

  // Blocked time periods routes
  app.get('/api/availability/blocked-times', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      // Parse date range query parameters if provided
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const blockedTimes = await storage.getBlockedTimePeriods(req.user!.id, startDate, endDate);
      res.json(blockedTimes);
    } catch (error) {
      console.error('Error getting blocked time periods:', error);
      res.status(500).json({ error: 'Failed to get blocked time periods' });
    }
  });

  app.post('/api/availability/blocked-times', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const validData = insertBlockedTimePeriodsSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const blockedTime = await storage.createBlockedTimePeriod(validData);
      res.status(201).json(blockedTime);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating blocked time period:', error);
      res.status(500).json({ error: 'Failed to create blocked time period' });
    }
  });

  app.patch('/api/availability/blocked-times/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      
      // Find the record first to check ownership
      const allBlockedTimes = await storage.getBlockedTimePeriods(req.user!.id);
      const blockedTime = allBlockedTimes.find(b => b.id === id);
      
      if (!blockedTime) {
        return res.status(404).json({ error: 'Blocked time period not found' });
      }
      
      if (blockedTime.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      const updatedBlockedTime = await storage.updateBlockedTimePeriod(id, req.body);
      res.json(updatedBlockedTime);
    } catch (error) {
      console.error('Error updating blocked time period:', error);
      res.status(500).json({ error: 'Failed to update blocked time period' });
    }
  });

  app.delete('/api/availability/blocked-times/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const id = parseInt(req.params.id);
      
      // Find the record first to check ownership
      const allBlockedTimes = await storage.getBlockedTimePeriods(req.user!.id);
      const blockedTime = allBlockedTimes.find(b => b.id === id);
      
      if (!blockedTime) {
        return res.status(404).json({ error: 'Blocked time period not found' });
      }
      
      if (blockedTime.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      
      await storage.deleteBlockedTimePeriod(id);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting blocked time period:', error);
      res.status(500).json({ error: 'Failed to delete blocked time period' });
    }
  });

  // Calendar integration routes
  app.post('/api/availability/calendar/connect', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { provider, token, refreshToken, expiry } = req.body;
      
      if (!provider || !token || !refreshToken || !expiry) {
        return res.status(400).json({ error: 'Missing required calendar credentials' });
      }
      
      const preferences = await storage.saveCalendarCredentials(
        req.user!.id,
        provider,
        token,
        refreshToken,
        new Date(expiry)
      );
      
      res.json(preferences);
    } catch (error) {
      console.error('Error connecting calendar:', error);
      res.status(500).json({ error: 'Failed to connect calendar' });
    }
  });

  app.post('/api/availability/calendar/sync', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const success = await storage.syncUserCalendar(req.user!.id);
      
      if (success) {
        res.json({ message: 'Calendar synced successfully' });
      } else {
        res.status(400).json({ error: 'Failed to sync calendar. Calendar credentials may be missing or expired.' });
      }
    } catch (error) {
      console.error('Error syncing calendar:', error);
      res.status(500).json({ error: 'Failed to sync calendar' });
    }
  });

  // Available time slots routes
  app.get('/api/availability/time-slots', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      // Optionally allow checking another user's availability
      const userId = req.query.userId ? parseInt(req.query.userId as string) : req.user!.id;
      
      // If checking another user's availability, make sure current user is allowed
      if (userId !== req.user!.id) {
        // In a real app, we'd check if the current user is allowed to view this user's availability
        // For now, we'll allow it
      }
      
      const timeSlots = await storage.getUserAvailableTimeSlots(userId, date);
      res.json(timeSlots);
    } catch (error) {
      console.error('Error getting available time slots:', error);
      res.status(500).json({ error: 'Failed to get available time slots' });
    }
  });

  app.post('/api/availability/check', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { userId, startTime, endTime } = req.body;
      
      if (!userId || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const isAvailable = await storage.checkUserAvailability(
        userId,
        new Date(startTime),
        new Date(endTime)
      );
      
      res.json({ isAvailable });
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({ error: 'Failed to check availability' });
    }
  });
  
  // User metrics routes
  app.post('/api/user-metrics/time-credits', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { userId, credits, exchangeId } = req.body;
      
      if (!userId || !credits || !exchangeId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Get the user and update their time credits
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update user with added time credits
      const currentCredits = user.timeCredits || 0;
      const updatedUser = await storage.updateUser(userId, {
        timeCredits: currentCredits + parseInt(credits)
      });
      
      // Here we would also log the transaction in a separate metrics table if needed
      
      res.json({ 
        userId: updatedUser.id, 
        credits: updatedUser.timeCredits,
        added: parseInt(credits)
      });
    } catch (error) {
      console.error('Error updating time credits:', error);
      res.status(500).json({ error: 'Failed to update time credits' });
    }
  });
  
  // Get user metrics
  app.get('/api/user-metrics', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get user exchanges
      const exchanges = await storage.getExchangesByUserId(userId);
      const completedExchanges = exchanges.filter(e => e.status === 'completed');
      
      // Get user skills
      const skills = await storage.getSkillsByUserId(userId);
      
      // Get user bucket list
      const bucketList = await storage.getBucketListByUserId(userId);
      const completedBucketItems = bucketList.filter(item => item.status === 'completed');
      
      // Calculate total exchange hours
      const totalMinutes = completedExchanges.reduce((total, exchange) => {
        return total + (exchange.duration || 0);
      }, 0);
      const exchangeHours = totalMinutes / 60;
      
      // Return metrics
      res.json({
        userId: user.id,
        timeCredits: user.timeCredits || 0,
        exchangeCount: completedExchanges.length,
        exchangeHours: exchangeHours,
        skillCount: skills.length,
        bucketListTotal: bucketList.length,
        bucketListCompleted: completedBucketItems.length,
        // Add additional metrics as needed
        impactScore: calculateImpactScore({
          exchanges: completedExchanges.length,
          hours: exchangeHours,
          skills: skills.length,
          bucketItems: completedBucketItems.length,
          timeCredits: user.timeCredits || 0
        })
      });
    } catch (error) {
      console.error('Error getting user metrics:', error);
      res.status(500).json({ error: 'Failed to get user metrics' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

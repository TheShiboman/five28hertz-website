import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import Stripe from "stripe";
import { z } from "zod";
import { 
  insertTournamentSchema, 
  insertMatchSchema, 
  insertProductSchema, 
  insertVenueSchema 
} from "@shared/schema";
import { TournamentService } from "./services/tournament-service";
import admin from 'firebase-admin';

// Only initialize Stripe if we have the secret key
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Update the profile update endpoint to properly handle Firebase token verification
  app.patch('/api/user/profile', async (req, res) => {
    try {
      // Get the authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const token = authHeader.split('Bearer ')[1];
      console.log("Verifying token for profile update...");

      // Verify the Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log("Token verified, user:", decodedToken.uid);

      const { displayName, bio, photoURL } = req.body;

      // Validate input
      if (!displayName?.trim()) {
        return res.status(400).json({ message: "Display name is required" });
      }

      if (bio && bio.length > 300) {
        return res.status(400).json({ message: "Bio must not exceed 300 characters" });
      }

      // Update Firebase Auth user profile
      await admin.auth().updateUser(decodedToken.uid, {
        displayName,
        photoURL
      });

      // Store additional profile data in Firestore using Admin SDK
      const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid);
      await userDoc.set({
        displayName,
        bio,
        photoURL,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Return updated user data
      res.json({
        displayName,
        bio,
        photoURL,
        uid: decodedToken.uid,
        email: decodedToken.email
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // WebSocket handling
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'UPDATE_SCORE') {
          const match = await storage.updateMatch(message.matchId, {
            score1: message.score1,
            score2: message.score2
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'SCORE_UPDATED',
                match
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Tournament routes
  app.post('/api/tournaments', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Only admins and referees can create tournaments
    if (!['admin', 'referee'].includes(req.user!.role)) {
      return res.status(403).json({ message: "Not authorized to create tournaments" });
    }

    try {
      // Validate and parse the request body using the schema
      const validatedData = insertTournamentSchema.parse(req.body);

      const tournament = await storage.createTournament(validatedData);
      res.json(tournament);
    } catch (error) {
      console.error("Failed to create tournament:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid tournament data",
          errors: error.errors
        });
      }

      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  app.get('/api/tournaments', async (req, res) => {
    const tournaments = await storage.listTournaments();
    res.json(tournaments);
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    const tournament = await storage.getTournament(parseInt(req.params.id));
    if (!tournament) return res.status(404).send('Tournament not found');
    res.json(tournament);
  });

  // Match routes
  app.post('/api/matches', async (req, res) => {
    const match = await storage.createMatch(req.body);
    res.json(match);
  });

  app.patch('/api/matches/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!['admin', 'referee'].includes(req.user!.role)) {
      return res.status(403).json({ message: "Not authorized to update matches" });
    }

    try {
      const { score1, score2 } = req.body;
      await TournamentService.updateMatchResult(parseInt(req.params.id), score1, score2);
      res.sendStatus(200);
    } catch (error) {
      console.error("Failed to update match:", error);
      res.status(500).json({ message: "Failed to update match" });
    }
  });


  app.post('/api/tournaments/:id/start', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!['admin', 'referee'].includes(req.user!.role)) {
      return res.status(403).json({ message: "Not authorized to start tournaments" });
    }

    try {
      await TournamentService.startTournament(parseInt(req.params.id));
      res.sendStatus(200);
    } catch (error) {
      console.error("Failed to start tournament:", error);
      res.status(500).json({ message: "Failed to start tournament" });
    }
  });

  app.get('/api/tournaments/:id/matches', async (req, res) => {
    const matches = await storage.getMatchesByTournament(parseInt(req.params.id));

    // If matches need player details, fetch them
    const matchesWithPlayers = await Promise.all(
      matches.map(async (match) => {
        const [player1, player2] = await Promise.all([
          match.player1Id ? storage.getUser(match.player1Id) : null,
          match.player2Id ? storage.getUser(match.player2Id) : null
        ]);

        return {
          ...match,
          player1: player1 ? { id: player1.id, fullName: player1.fullName } : null,
          player2: player2 ? { id: player2.id, fullName: player2.fullName } : null
        };
      })
    );

    res.json(matchesWithPlayers);
  });

  app.get('/api/matches/player', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const matches = await storage.getPlayerMatches(req.user!.id);
    res.json(matches);
  });


  // Product routes
  app.get('/api/products', async (req, res) => {
    const products = await storage.listProducts();
    res.json(products);
  });

  // User routes
  app.get('/api/users', async (req, res) => {
    const users = await storage.listUsers();
    // Remove sensitive information before sending
    const sanitizedUsers = users.map(({ password, ...user }) => user);
    res.json(sanitizedUsers);
  });

  app.patch('/api/users/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Users can only update their own profile
    if (req.user!.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { role } = req.body;

    // Validate role
    if (!['player', 'coach', 'referee'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    try {
      const updatedUser = await storage.updateUser(req.user!.id, { role });
      req.login(updatedUser, (err) => {
        if (err) throw err;
        res.json(updatedUser);
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });


  // Stripe payment route
  app.post('/api/create-payment-intent', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: 'Payment service not available' });
    }

    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: 'Payment processing failed' });
    }
  });

  // Prediction routes
  app.post('/api/predictions', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const prediction = await storage.createPrediction({
      ...req.body,
      userId: req.user!.id
    });
    res.json(prediction);
  });

  app.get('/api/predictions/user', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const predictions = await storage.getUserPredictions(req.user!.id);
    res.json(predictions);
  });

  app.get('/api/tournaments/:id/predictions', async (req, res) => {
    const predictions = await storage.getTournamentPredictions(parseInt(req.params.id));
    res.json(predictions);
  });

  app.get('/api/tournaments/:id/leaderboard', async (req, res) => {
    const leaderboard = await storage.getLeaderboard(parseInt(req.params.id));
    res.json(leaderboard);
  });

  // Tournament registration routes
  app.post('/api/tournaments/:id/register', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const tournamentId = parseInt(req.params.id);
    const tournament = await storage.getTournament(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Check if tournament is still open for registration
    if (new Date(tournament.registrationDeadline) < new Date()) {
      return res.status(400).json({ message: "Registration deadline has passed" });
    }

    // Check if tournament is full
    if (tournament.currentParticipants >= tournament.participants) {
      return res.status(400).json({ message: "Tournament is full" });
    }

    try {
      // Check if user is already registered
      const existingRegistrations = await storage.getTournamentRegistrations(tournamentId);
      const alreadyRegistered = existingRegistrations.some(reg => reg.userId === req.user!.id);

      if (alreadyRegistered) {
        return res.status(400).json({ message: "You are already registered for this tournament" });
      }

      console.log(`Creating registration for user ${req.user!.id} in tournament ${tournamentId}`);
      const registration = await storage.createTournamentRegistration({
        tournamentId,
        userId: req.user!.id,
        status: 'confirmed' // Changed from 'pending' to 'confirmed'
      });

      console.log(`Registration created successfully:`, registration);
      res.json(registration);
    } catch (error) {
      console.error("Failed to register for tournament:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to register for tournament" });
    }
  });

  // Get tournament registrations (admin/referee only)
  app.get('/api/tournaments/:id/registrations', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!['admin', 'referee'].includes(req.user!.role)) {
      return res.status(403).json({ message: "Not authorized to view registrations" });
    }

    const registrations = await storage.getTournamentRegistrations(parseInt(req.params.id));
    res.json(registrations);
  });

  // Get user's tournament registrations
  app.get('/api/user/tournaments', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const registrations = await storage.getUserTournamentRegistrations(req.user!.id);
    res.json(registrations);
  });

  // Update registration status (admin/referee only)
  app.patch('/api/tournament-registrations/:id', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!['admin', 'referee'].includes(req.user!.role)) {
      return res.status(403).json({ message: "Not authorized to update registrations" });
    }

    try {
      const registration = await storage.updateTournamentRegistration(
        parseInt(req.params.id),
        { status: req.body.status }
      );
      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update registration" });
    }
  });

  // Add this route after the existing tournament registration routes
  app.post('/api/tournaments/:id/register-player', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!['admin', 'referee'].includes(req.user!.role)) {
      return res.status(403).json({ message: "Not authorized to register players" });
    }

    const tournamentId = parseInt(req.params.id);
    const { userId } = req.body;

    try {
      // Check if tournament exists and is open for registration
      const tournament = await storage.getTournament(tournamentId);

      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }

      // Check if tournament is still open for registration
      if (new Date(tournament.registrationDeadline) < new Date()) {
        return res.status(400).json({ message: "Registration deadline has passed" });
      }

      // Check if tournament is full
      if (tournament.currentParticipants >= tournament.participants) {
        return res.status(400).json({ message: "Tournament is full" });
      }

      // Check if player exists
      const player = await storage.getUser(userId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }

      // Check if player is already registered
      const existingRegistrations = await storage.getTournamentRegistrations(tournamentId);
      const alreadyRegistered = existingRegistrations.some(reg => reg.userId === userId);

      if (alreadyRegistered) {
        return res.status(400).json({ message: "Player is already registered for this tournament" });
      }

      const registration = await storage.createTournamentRegistration({
        tournamentId,
        userId,
        status: 'confirmed' // Auto-confirm when registered by organizer
      });

      res.json(registration);
    } catch (error) {
      console.error("Failed to register player:", error);
      res.status(500).json({ message: "Failed to register player" });
    }
  });

  // Venue routes
  app.get('/api/venues', async (req, res) => {
    const venues = await storage.listVenues();
    res.json(venues);
  });

  app.post('/api/venues', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!['admin', 'referee'].includes(req.user!.role)) {
      return res.status(403).json({ message: "Not authorized to register venues" });
    }

    try {
      console.log('Attempting to create venue with data:', req.body);
      const validatedData = await insertVenueSchema.parseAsync(req.body);
      const venue = await storage.createVenue(validatedData);
      res.json(venue);
    } catch (error) {
      console.error("Failed to create venue:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid venue data",
          errors: error.errors
        });
      }

      res.status(500).json({ message: "Failed to create venue" });
    }
  });

  app.get('/api/venues/:id', async (req, res) => {
    const venue = await storage.getVenue(parseInt(req.params.id));
    if (!venue) return res.status(404).send('Venue not found');
    res.json(venue);
  });

  return httpServer;
}
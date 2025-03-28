import { users, tournaments, matches, products, predictions, tournamentRegistrations, venues } from "@shared/schema";
import type { InsertUser, User, Tournament, Match, Product, InsertPrediction, Prediction, InsertTournamentRegistration, TournamentRegistration, Venue, InsertVenue } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ne } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<User>): Promise<User>; // Added updateUser method

  // Tournament operations
  createTournament(tournament: Tournament): Promise<Tournament>;
  getTournament(id: number): Promise<Tournament | undefined>;
  listTournaments(): Promise<Tournament[]>;
  updateTournament(id: number, data: Partial<Tournament>): Promise<Tournament>;

  // Match operations
  createMatch(match: Match): Promise<Match>;
  updateMatch(id: number, data: Partial<Match>): Promise<Match>;
  getMatch(id: number): Promise<Match | undefined>;
  getMatchesByTournament(tournamentId: number): Promise<Match[]>;
  getMatchByNumber(tournamentId: number, matchNumber: number): Promise<Match | undefined>;
  getPlayerMatches(playerId: number): Promise<Match[]>;

  // Product operations
  createProduct(product: Product): Promise<Product>;
  getProduct(id: number): Promise<Product | undefined>;
  listProducts(): Promise<Product[]>;

  // Prediction operations
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  getUserPredictions(userId: number): Promise<Prediction[]>;
  getTournamentPredictions(tournamentId: number): Promise<Prediction[]>;
  getLeaderboard(tournamentId: number): Promise<Array<{ user: User; points: number }>>;

  // Tournament registration operations
  createTournamentRegistration(registration: InsertTournamentRegistration): Promise<TournamentRegistration>;
  getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]>;
  getUserTournamentRegistrations(userId: number): Promise<TournamentRegistration[]>;
  updateTournamentRegistration(id: number, data: Partial<TournamentRegistration>): Promise<TournamentRegistration>;

  // Add new method for getting uncompleted matches
  getTournamentUncompletedMatches(tournamentId: number): Promise<Match[]>;
  listVenues(): Promise<Venue[]>;
  // Venue operations
  createVenue(venue: InsertVenue): Promise<Venue>;
  getVenue(id: number): Promise<Venue | undefined>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'user_sessions',
      schemaName: 'public',
      pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
      errorLog: console.error.bind(console)
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async listUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createTournament(tournament: Tournament): Promise<Tournament> {
    try {
      const [created] = await db.insert(tournaments).values({
        ...tournament,
        currentParticipants: 0,
        bracket: []
      }).returning();
      return created;
    } catch (error) {
      console.error("Database error creating tournament:", error);
      throw new Error("Failed to create tournament in database");
    }
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async listTournaments(): Promise<Tournament[]> {
    return db.select().from(tournaments);
  }

  async updateTournament(id: number, data: Partial<Tournament>): Promise<Tournament> {
    const [updated] = await db
      .update(tournaments)
      .set(data)
      .where(eq(tournaments.id, id))
      .returning();
    return updated;
  }

  async createMatch(match: Match): Promise<Match> {
    const [created] = await db.insert(matches).values(match).returning();
    return created;
  }

  async updateMatch(id: number, data: Partial<Match>): Promise<Match> {
    const [updated] = await db
      .update(matches)
      .set(data)
      .where(eq(matches.id, id))
      .returning();
    return updated;
  }

  async getMatch(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }

  async getMatchesByTournament(tournamentId: number): Promise<Match[]> {
    return db.select().from(matches).where(eq(matches.tournamentId, tournamentId));
  }

  async getMatchByNumber(tournamentId: number, matchNumber: number): Promise<Match | undefined> {
    const [match] = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.tournamentId, tournamentId),
          eq(matches.matchNumber, matchNumber)
        )
      );
    return match;
  }

  async getPlayerMatches(playerId: number): Promise<Match[]> {
    return db
      .select()
      .from(matches)
      .where(
        or(
          eq(matches.player1Id, playerId),
          eq(matches.player2Id, playerId)
        )
      );
  }

  async createProduct(product: Product): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async listProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const [created] = await db.insert(predictions).values({
      ...prediction,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return created;
  }

  async getPrediction(id: number): Promise<Prediction | undefined> {
    const [prediction] = await db.select().from(predictions).where(eq(predictions.id, id));
    return prediction;
  }

  async getUserPredictions(userId: number): Promise<Prediction[]> {
    return db.select().from(predictions).where(eq(predictions.userId, userId));
  }

  async getTournamentPredictions(tournamentId: number): Promise<Prediction[]> {
    return db.select().from(predictions).where(eq(predictions.tournamentId, tournamentId));
  }

  async getLeaderboard(tournamentId: number): Promise<Array<{ user: User; points: number }>> {
    try {
      const tournamentPredictions = await this.getTournamentPredictions(tournamentId);
      const userPoints = new Map<number, number>();

      for (const prediction of tournamentPredictions) {
        const currentPoints = userPoints.get(prediction.userId) || 0;
        userPoints.set(prediction.userId, currentPoints + (prediction.points || 0));
      }

      const leaderboardEntries = await Promise.all(
        Array.from(userPoints.entries()).map(async ([userId, points]) => {
          const user = await this.getUser(userId);
          if (!user) {
            // Skip entries where user doesn't exist
            return null;
          }
          return { user, points };
        })
      );

      // Filter out null entries and sort by points
      return leaderboardEntries
        .filter((entry): entry is { user: User; points: number } => entry !== null)
        .sort((a, b) => b.points - a.points);
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async createTournamentRegistration(registration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Create the registration
        const [created] = await tx
          .insert(tournamentRegistrations)
          .values({
            ...registration,
            registeredAt: new Date(),
            updatedAt: new Date()
          })
          .returning();

        // Get the current count with a separate query
        const [{ count }] = await tx
          .select({ count: sql`count(*)::int` })
          .from(tournamentRegistrations)
          .where(eq(tournamentRegistrations.tournamentId, registration.tournamentId));

        // Update the tournament with the new count
        await tx
          .update(tournaments)
          .set({ currentParticipants: count })
          .where(eq(tournaments.id, registration.tournamentId));

        return created;
      });
    } catch (error) {
      console.error("Database error creating tournament registration:", error);
      throw new Error("Failed to register for tournament. Please try again.");
    }
  }

  async getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]> {
    return db
      .select()
      .from(tournamentRegistrations)
      .where(eq(tournamentRegistrations.tournamentId, tournamentId));
  }

  async getUserTournamentRegistrations(userId: number): Promise<TournamentRegistration[]> {
    return db
      .select()
      .from(tournamentRegistrations)
      .where(eq(tournamentRegistrations.userId, userId));
  }

  async updateTournamentRegistration(id: number, data: Partial<TournamentRegistration>): Promise<TournamentRegistration> {
    const [updated] = await db
      .update(tournamentRegistrations)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(tournamentRegistrations.id, id))
      .returning();
    return updated;
  }

  async getTournamentUncompletedMatches(tournamentId: number): Promise<Match[]> {
    return db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.tournamentId, tournamentId),
          ne(matches.status, 'completed')
        )
      );
  }

  async listVenues(): Promise<Venue[]> {
    return db.select().from(venues);
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    try {
      const [created] = await db.insert(venues).values(venue).returning();
      return created;
    } catch (error) {
      console.error("Database error creating venue:", error);
      throw new Error("Failed to create venue in database");
    }
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    const [venue] = await db.select().from(venues).where(eq(venues.id, id));
    return venue;
  }
}

export const storage = new DatabaseStorage();
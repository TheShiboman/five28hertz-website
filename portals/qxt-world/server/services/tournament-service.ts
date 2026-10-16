import { type Tournament, type Match, type User } from "@shared/schema";
import { storage } from "../storage";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { tournaments, matches } from "@shared/schema";
import { wsService } from "./websocket-service";

export class TournamentService {
  static async startTournament(tournamentId: number): Promise<void> {
    try {
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        throw new Error("Tournament not found");
      }

      // Create initial bracket match
      const match = {
        tournamentId,
        player1Id: 0,
        player2Id: 0,
        round: 1,
        matchNumber: 1,
        nextMatchNumber: null,
        status: 'scheduled' as const,
        score1: null,
        score2: null,
        startTime: new Date(tournament.startDate),
        endTime: null,
        winner: null,
        isWinnersBracket: true,
        frameCount: 5,
        refereeId: null,
        canDraw: true,
        tableNumber: null,
        lastEditedBy: null,
        lastEditedAt: null,
        notes: '',
        isLocked: false
      };

      await db.transaction(async (tx) => {
        // Update tournament status
        await tx.update(tournaments)
          .set({ status: 'in_progress' })
          .where(eq(tournaments.id, tournamentId));

        // Create initial match
        await tx.insert(matches).values(match);
      });

    } catch (error) {
      console.error('[startTournament] Error:', error);
      throw error;
    }
  }

  static async updateMatchResult(
    matchId: number,
    data: {
      score1: number | null;
      score2: number | null;
      frameCount?: number;
      refereeId?: number;
      startTime?: Date;
      canDraw?: boolean;
      tableNumber?: number | null;
      notes?: string;
    },
    userId: number,
    userRole: string
  ): Promise<void> {
    try {
      const match = await storage.getMatch(matchId);
      if (!match) {
        throw new Error("Match not found");
      }

      // Only admins and referees can update scores
      if ((data.score1 !== undefined || data.score2 !== undefined) && 
          userRole !== 'admin' && userRole !== 'referee') {
        throw new Error("Only administrators and referees can update match scores.");
      }

      // Determine winner or draw
      let winner: number | null = null;
      let status = match.status;

      if (data.score1 !== null && data.score2 !== null) {
        if (data.canDraw && data.score1 === data.score2) {
          winner = null; // Draw
        } else {
          winner = data.score1 > data.score2 ? match.player1Id : match.player2Id;
        }

        // Update status if the match is complete
        const maxFrames = data.frameCount || match.frameCount || 5;
        if ((data.score1 + data.score2) >= Math.ceil(maxFrames / 2)) {
          status = 'completed';
        } else {
          status = 'in_progress';
        }
      }

      await db.update(matches)
        .set({
          ...data,
          winner,
          status,
          lastEditedBy: userId,
          lastEditedAt: new Date(),
        })
        .where(eq(matches.id, matchId));

      // Broadcast the update via WebSocket
      wsService.broadcastScoreUpdate({
        type: 'SCORE_UPDATE',
        matchId,
        score1: data.score1 || 0,
        score2: data.score2 || 0,
        frameNumber: Math.floor((data.score1 || 0) + (data.score2 || 0)) + 1,
        status
      });

    } catch (error) {
      console.error('[updateMatchResult] Error:', error);
      throw error;
    }
  }

  static async lockMatch(matchId: number, userRole: string): Promise<void> {
    if (userRole !== 'admin') {
      throw new Error("Only administrators can lock matches");
    }

    await db.update(matches)
      .set({ isLocked: true })
      .where(eq(matches.id, matchId));
  }

  static async unlockMatch(matchId: number, userRole: string): Promise<void> {
    if (userRole !== 'admin') {
      throw new Error("Only administrators can unlock matches");
    }

    await db.update(matches)
      .set({ isLocked: false })
      .where(eq(matches.id, matchId));
  }
}
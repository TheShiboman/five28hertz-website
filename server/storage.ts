import { 
  type User, type InsertUser,
  type Project, type InsertProject,
  type Newsletter, type InsertNewsletter,
  users,
  projects,
  newsletter
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Newsletter
  addNewsletterSubscription(email: InsertNewsletter): Promise<Newsletter>;
  isEmailSubscribed(email: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseId, firebaseId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set(projectUpdate)
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      throw new Error("Project not found");
    }

    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Newsletter
  async addNewsletterSubscription(subscription: InsertNewsletter): Promise<Newsletter> {
    const [newSubscription] = await db
      .insert(newsletter)
      .values(subscription)
      .returning();
    return newSubscription;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    const [subscription] = await db
      .select()
      .from(newsletter)
      .where(eq(newsletter.email, email));
    return !!subscription;
  }
}

export const storage = new DatabaseStorage();
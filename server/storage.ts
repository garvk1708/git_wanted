import { 
  users, 
  repositories, 
  bounties, 
  tags, 
  bountyTags, 
  activities, 
  reputation,
  type User, 
  type InsertUser, 
  type Repository, 
  type InsertRepository, 
  type Bounty, 
  type InsertBounty, 
  type Tag, 
  type InsertTag,
  type Activity,
  type InsertActivity,
  type Reputation,
  type InsertReputation
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray, desc, sql as sqlQuery, like, or } from "drizzle-orm";
import { BountyWithDetails } from "@shared/types";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Repository operations
  getRepository(id: number): Promise<Repository | undefined>;
  getRepositoryByGithubId(githubId: number): Promise<Repository | undefined>;
  getRepositoriesByOwner(ownerId: number): Promise<Repository[]>;
  createRepository(repository: InsertRepository): Promise<Repository>;
  
  // Bounty operations
  getBounty(id: number): Promise<Bounty | undefined>;
  getBountyWithDetails(id: number): Promise<BountyWithDetails | undefined>;
  getBounties(options?: { status?: string, limit?: number, offset?: number, search?: string }): Promise<BountyWithDetails[]>;
  getBountiesByCreator(creatorId: number): Promise<BountyWithDetails[]>;
  getBountiesByClaimer(claimerId: number): Promise<BountyWithDetails[]>;
  createBounty(bounty: InsertBounty): Promise<Bounty>;
  updateBounty(id: number, bounty: Partial<Bounty>): Promise<Bounty | undefined>;
  
  // Tag operations
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  getOrCreateTag(name: string): Promise<Tag>;
  addTagToBounty(bountyId: number, tagId: number): Promise<void>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByUser(userId: number, limit?: number): Promise<Activity[]>;
  
  // Reputation operations
  getReputation(userId: number): Promise<Reputation | undefined>;
  createOrUpdateReputation(userId: number, update: Partial<InsertReputation>): Promise<Reputation>;
  
  // Stats operations
  getDashboardStats(): Promise<{
    totalBounties: number;
    totalPaidOut: number;
    activeBounties: number;
    completedBounties: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.githubId, githubId));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Repository operations
  async getRepository(id: number): Promise<Repository | undefined> {
    const [repository] = await db.select().from(repositories).where(eq(repositories.id, id));
    return repository;
  }
  
  async getRepositoryByGithubId(githubId: number): Promise<Repository | undefined> {
    const [repository] = await db.select().from(repositories).where(eq(repositories.githubId, githubId));
    return repository;
  }
  
  async getRepositoriesByOwner(ownerId: number): Promise<Repository[]> {
    return await db.select().from(repositories).where(eq(repositories.ownerId, ownerId));
  }
  
  async createRepository(repository: InsertRepository): Promise<Repository> {
    const [createdRepository] = await db.insert(repositories).values(repository).returning();
    return createdRepository;
  }
  
  // Bounty operations
  async getBounty(id: number): Promise<Bounty | undefined> {
    const [bounty] = await db.select().from(bounties).where(eq(bounties.id, id));
    return bounty;
  }
  
  async getBountyWithDetails(id: number): Promise<BountyWithDetails | undefined> {
    const bounty = await this.getBounty(id);
    if (!bounty) return undefined;
    
    const [creator] = await db.select().from(users).where(eq(users.id, bounty.creatorId));
    
    let repository = null;
    if (bounty.repositoryId) {
      const [repo] = await db.select().from(repositories).where(eq(repositories.id, bounty.repositoryId));
      repository = repo;
    }
    
    // Get tags
    const tagResults = await db
      .select({
        name: tags.name
      })
      .from(bountyTags)
      .innerJoin(tags, eq(bountyTags.tagId, tags.id))
      .where(eq(bountyTags.bountyId, id));
    
    let claimedBy = undefined;
    if (bounty.claimedById) {
      const [claimer] = await db.select().from(users).where(eq(users.id, bounty.claimedById));
      if (claimer) {
        claimedBy = {
          id: claimer.id,
          username: claimer.username,
          githubId: claimer.githubId,
          avatarUrl: claimer.avatarUrl,
          name: claimer.name,
          ethAddress: claimer.ethAddress
        };
      }
    }
    
    return {
      ...bounty,
      creator: {
        id: creator.id,
        username: creator.username,
        githubId: creator.githubId,
        avatarUrl: creator.avatarUrl,
        name: creator.name,
        ethAddress: creator.ethAddress
      },
      repository,
      tags: tagResults.map(t => t.name),
      claimedBy
    };
  }
  
  async getBounties(options: { status?: string, limit?: number, offset?: number, search?: string } = {}): Promise<BountyWithDetails[]> {
    const { status, limit = 10, offset = 0, search } = options;
    
    let query = db.select().from(bounties);
    
    // Apply filters
    if (status) {
      query = query.where(eq(bounties.status, status));
    }
    
    if (search) {
      query = query.where(
        or(
          like(bounties.title, `%${search}%`),
          like(bounties.description, `%${search}%`)
        )
      );
    }
    
    // Apply pagination
    query = query.limit(limit).offset(offset).orderBy(desc(bounties.createdAt));
    
    const bountyList = await query;
    if (!bountyList.length) return [];
    
    // Get creator data for all bounties
    const creatorIds = [...new Set(bountyList.map(b => b.creatorId))];
    const creators = await db.select().from(users).where(inArray(users.id, creatorIds));
    
    // Get repository data for all bounties
    const repoIds = [...new Set(bountyList.map(b => b.repositoryId).filter(Boolean) as number[])];
    const repositories = repoIds.length 
      ? await db.select().from(repositories).where(inArray(repositories.id, repoIds))
      : [];
    
    // Get claimer data for all bounties
    const claimerIds = [...new Set(bountyList.map(b => b.claimedById).filter(Boolean) as number[])];
    const claimers = claimerIds.length
      ? await db.select().from(users).where(inArray(users.id, claimerIds))
      : [];
    
    // Get tags for all bounties
    const bountyIds = bountyList.map(b => b.id);
    const tagResults = await db
      .select({
        bountyId: bountyTags.bountyId,
        tagName: tags.name
      })
      .from(bountyTags)
      .innerJoin(tags, eq(bountyTags.tagId, tags.id))
      .where(inArray(bountyTags.bountyId, bountyIds));
    
    // Group tags by bounty ID
    const tagsByBounty: Record<number, string[]> = {};
    tagResults.forEach(result => {
      if (!tagsByBounty[result.bountyId]) {
        tagsByBounty[result.bountyId] = [];
      }
      tagsByBounty[result.bountyId].push(result.tagName);
    });
    
    // Map creators and repositories to bounties
    return bountyList.map(bounty => {
      const creator = creators.find(c => c.id === bounty.creatorId);
      const repository = repositories.find(r => r.id === bounty.repositoryId);
      const claimedBy = bounty.claimedById 
        ? claimers.find(c => c.id === bounty.claimedById) 
        : undefined;
      
      return {
        ...bounty,
        creator: creator ? {
          id: creator.id,
          username: creator.username,
          githubId: creator.githubId,
          avatarUrl: creator.avatarUrl,
          name: creator.name,
          ethAddress: creator.ethAddress
        } : {} as any,
        repository: repository || null,
        tags: tagsByBounty[bounty.id] || [],
        claimedBy: claimedBy ? {
          id: claimedBy.id,
          username: claimedBy.username,
          githubId: claimedBy.githubId,
          avatarUrl: claimedBy.avatarUrl,
          name: claimedBy.name,
          ethAddress: claimedBy.ethAddress
        } : undefined
      };
    });
  }
  
  async getBountiesByCreator(creatorId: number): Promise<BountyWithDetails[]> {
    return this.getBounties({ 
      limit: 100,
      offset: 0,
    }).then(allBounties => 
      allBounties.filter(bounty => bounty.creatorId === creatorId)
    );
  }
  
  async getBountiesByClaimer(claimerId: number): Promise<BountyWithDetails[]> {
    return this.getBounties({ 
      limit: 100,
      offset: 0,
    }).then(allBounties => 
      allBounties.filter(bounty => bounty.claimedById === claimerId)
    );
  }
  
  async createBounty(bounty: InsertBounty): Promise<Bounty> {
    const [createdBounty] = await db.insert(bounties).values(bounty).returning();
    return createdBounty;
  }
  
  async updateBounty(id: number, bountyData: Partial<Bounty>): Promise<Bounty | undefined> {
    const [updatedBounty] = await db
      .update(bounties)
      .set({ ...bountyData, updatedAt: new Date() })
      .where(eq(bounties.id, id))
      .returning();
    return updatedBounty;
  }
  
  // Tag operations
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const [createdTag] = await db.insert(tags).values(tag).returning();
    return createdTag;
  }
  
  async getOrCreateTag(name: string): Promise<Tag> {
    const [existingTag] = await db.select().from(tags).where(eq(tags.name, name));
    if (existingTag) return existingTag;
    
    return this.createTag({ name });
  }
  
  async addTagToBounty(bountyId: number, tagId: number): Promise<void> {
    await db.insert(bountyTags).values({ bountyId, tagId }).onConflictDoNothing();
  }
  
  // Activity operations
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [createdActivity] = await db.insert(activities).values(activity).returning();
    return createdActivity;
  }
  
  async getActivitiesByUser(userId: number, limit: number = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }
  
  // Reputation operations
  async getReputation(userId: number): Promise<Reputation | undefined> {
    const [userRep] = await db.select().from(reputation).where(eq(reputation.userId, userId));
    return userRep;
  }
  
  async createOrUpdateReputation(userId: number, update: Partial<InsertReputation>): Promise<Reputation> {
    const existing = await this.getReputation(userId);
    
    if (existing) {
      const [updated] = await db
        .update(reputation)
        .set({ 
          ...update, 
          points: update.points !== undefined 
            ? existing.points + update.points 
            : existing.points,
          completedBounties: update.completedBounties !== undefined 
            ? existing.completedBounties + update.completedBounties 
            : existing.completedBounties,
          createdBounties: update.createdBounties !== undefined 
            ? existing.createdBounties + update.createdBounties 
            : existing.createdBounties,
          updatedAt: new Date() 
        })
        .where(eq(reputation.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(reputation)
        .values({ 
          userId,
          points: update.points || 0,
          completedBounties: update.completedBounties || 0,
          createdBounties: update.createdBounties || 0
        })
        .returning();
      return created;
    }
  }
  
  // Stats operations
  async getDashboardStats(): Promise<{
    totalBounties: number;
    totalPaidOut: number;
    activeBounties: number;
    completedBounties: number;
  }> {
    const [totalResults] = await db
      .select({ count: sqlQuery`count(*)` })
      .from(bounties);
    const totalBounties = Number(totalResults.count);
    
    const [completedResults] = await db
      .select({ 
        count: sqlQuery`count(*)`,
        sum: sqlQuery`sum(amount)`
      })
      .from(bounties)
      .where(eq(bounties.status, "completed"));
    const completedBounties = Number(completedResults.count);
    const totalPaidOut = Number(completedResults.sum) || 0;
    
    const [activeResults] = await db
      .select({ count: sqlQuery`count(*)` })
      .from(bounties)
      .where(
        or(
          eq(bounties.status, "open"),
          eq(bounties.status, "claimed")
        )
      );
    const activeBounties = Number(activeResults.count);
    
    return {
      totalBounties,
      totalPaidOut,
      activeBounties,
      completedBounties,
    };
  }
}

export const storage = new DatabaseStorage();

import { pgTable, text, serial, integer, boolean, timestamp, uniqueIndex, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  githubId: text("github_id").notNull().unique(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  name: text("name"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ethAddress: text("eth_address"),
});

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  githubId: integer("github_id").notNull().unique(),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  full_name: text("full_name").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bounties = pgTable("bounties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: doublePrecision("amount").notNull(),
  currency: text("currency").notNull().default("ETH"),
  status: text("status").notNull().default("open"), // open, claimed, completed, cancelled
  creatorId: integer("creator_id").notNull().references(() => users.id),
  repositoryId: integer("repository_id").references(() => repositories.id),
  issueNumber: integer("issue_number"),
  issueUrl: text("issue_url").notNull(),
  claimedById: integer("claimed_by_id").references(() => users.id),
  claimedAt: timestamp("claimed_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  transactionHash: text("transaction_hash"),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const bountyTags = pgTable(
  "bounty_tags",
  {
    bountyId: integer("bounty_id")
      .notNull()
      .references(() => bounties.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (table) => {
    return {
      pk: uniqueIndex("bounty_tags_pk").on(table.bountyId, table.tagId),
    };
  }
);

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bountyId: integer("bounty_id").references(() => bounties.id),
  action: text("action").notNull(), // created, claimed, completed, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: text("metadata"), // JSON string with additional info
});

// Reputation points for users
export const reputation = pgTable("reputation", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  points: integer("points").notNull().default(0),
  completedBounties: integer("completed_bounties").notNull().default(0),
  createdBounties: integer("created_bounties").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRepositorySchema = createInsertSchema(repositories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBountySchema = createInsertSchema(bounties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  claimedAt: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
});

export const insertBountyTagSchema = createInsertSchema(bountyTags);

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertReputationSchema = createInsertSchema(reputation).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Repository = typeof repositories.$inferSelect;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;

export type Bounty = typeof bounties.$inferSelect;
export type InsertBounty = z.infer<typeof insertBountySchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type BountyTag = typeof bountyTags.$inferSelect;
export type InsertBountyTag = z.infer<typeof insertBountyTagSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Reputation = typeof reputation.$inferSelect;
export type InsertReputation = z.infer<typeof insertReputationSchema>;

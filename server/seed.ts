import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import { db } from './db';
import { storage } from './storage';
import { 
  users, repositories, bounties, tags, bountyTags, activities, reputation,
  type InsertUser, type InsertRepository, type InsertBounty, type InsertTag, 
  type InsertActivity, type InsertReputation
} from '../shared/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from './auth';

// Sample repository data
const sampleRepositories = [
  {
    name: 'react',
    full_name: 'facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    url: 'https://github.com/facebook/react',
    githubId: 10270250,
    ownerId: 1
  },
  {
    name: 'tensorflow',
    full_name: 'tensorflow/tensorflow',
    description: 'An Open Source Machine Learning Framework for Everyone',
    url: 'https://github.com/tensorflow/tensorflow',
    githubId: 45717250,
    ownerId: 1
  },
  {
    name: 'vscode',
    full_name: 'microsoft/vscode',
    description: 'Visual Studio Code',
    url: 'https://github.com/microsoft/vscode',
    githubId: 41881900,
    ownerId: 1
  }
];

// Sample tags
const sampleTags = [
  { name: 'javascript' },
  { name: 'react' },
  { name: 'python' },
  { name: 'machine-learning' },
  { name: 'typescript' },
  { name: 'frontend' },
  { name: 'backend' },
  { name: 'bug' },
  { name: 'enhancement' },
  { name: 'documentation' }
];

// Sample data for user reputations
const sampleReputations: (Partial<InsertReputation> & { username: string })[] = [
  { username: 'garvk1708', completedBounties: 5, createdBounties: 3, points: 80 },
  { username: 'user2', completedBounties: 3, createdBounties: 2, points: 50 },
  { username: 'user3', completedBounties: 7, createdBounties: 0, points: 70 },
  { username: 'user4', completedBounties: 1, createdBounties: 8, points: 90 },
  { username: 'user5', completedBounties: 4, createdBounties: 4, points: 80 }
];

// Sample users (excluding the current user)
const sampleUsers = [
  {
    username: 'user2',
    githubId: '12345678',
    avatarUrl: 'https://avatars.githubusercontent.com/u/12345678',
    name: 'Sample User 2',
    ethAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  },
  {
    username: 'user3',
    githubId: '23456789',
    avatarUrl: 'https://avatars.githubusercontent.com/u/23456789',
    name: 'Sample User 3',
    ethAddress: '0x9e42Cf834E609294FEcD32F62C5f53A3B8e14C65'
  },
  {
    username: 'user4',
    githubId: '34567890',
    avatarUrl: 'https://avatars.githubusercontent.com/u/34567890',
    name: 'Sample User 4',
    ethAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
  },
  {
    username: 'user5',
    githubId: '45678901',
    avatarUrl: 'https://avatars.githubusercontent.com/u/45678901',
    name: 'Sample User 5',
    ethAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
  }
];

// Sample bounties
const generateSampleBounties = (
  repositoryIds: number[], 
  tagIds: number[], 
  userIds: number[]
): (Partial<InsertBounty> & { tags: number[] })[] => {
  return [
    {
      title: '[TEST] Fix React rendering performance issue',
      description: 'Test bounty - This is a demo bounty that can be claimed and paid using Sepolia testnet ETH.',
      amount: 0.01,
      currency: 'ETH',
      status: 'active',
      creatorId: userIds[0],
      repositoryId: repositoryIds[0],
      issueUrl: 'https://github.com/facebook/react/issues/12345',
      tags: [tagIds[0], tagIds[1], tagIds[5]]
    },
    {
      title: '[TEST] Add TypeScript support for custom hooks',
      description: 'Test bounty - This is a demo bounty that can be claimed and paid using Sepolia testnet ETH.',
      amount: 0.005,
      currency: 'ETH',
      status: 'active',
      creatorId: userIds[0],
      repositoryId: repositoryIds[0],
      issueUrl: 'https://github.com/facebook/react/issues/23456',
      tags: [tagIds[0], tagIds[1], tagIds[4]]
    },
    {
      title: '[TEST] Implement new TensorFlow visualization component',
      description: 'Test bounty - This is a demo bounty that can be claimed and paid using Sepolia testnet ETH.',
      amount: 0.02,
      currency: 'ETH',
      status: 'claimed',
      creatorId: userIds[3],
      claimedById: userIds[0],
      repositoryId: repositoryIds[1],
      issueUrl: 'https://github.com/tensorflow/tensorflow/issues/34567',
      tags: [tagIds[2], tagIds[3], tagIds[8]]
    },
    {
      title: '[TEST] Fix VSCode extension API documentation',
      description: 'Test bounty - This is a demo bounty that can be claimed and paid using Sepolia testnet ETH.',
      amount: 0.01,
      currency: 'ETH',
      status: 'completed',
      creatorId: userIds[3],
      claimedById: userIds[2],
      repositoryId: repositoryIds[2],
      issueUrl: 'https://github.com/microsoft/vscode/issues/45678',
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      tags: [tagIds[4], tagIds[9]]
    },
    {
      title: '[TEST] Implement dark theme for TensorFlow dashboard',
      description: 'Test bounty - This is a demo bounty that can be claimed and paid using Sepolia testnet ETH.',
      amount: 0.015,
      currency: 'ETH',
      status: 'completed',
      creatorId: userIds[1],
      claimedById: userIds[0],
      repositoryId: repositoryIds[1],
      issueUrl: 'https://github.com/tensorflow/tensorflow/issues/56789',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      tags: [tagIds[2], tagIds[3], tagIds[5]]
    },
    {
      title: '[TEST] Add support for custom VSCode themes in workspace settings',
      description: 'Test bounty - This is a demo bounty that can be claimed and paid using Sepolia testnet ETH.',
      amount: 0.025,
      currency: 'ETH',
      status: 'active',
      creatorId: userIds[1],
      repositoryId: repositoryIds[2],
      issueUrl: 'https://github.com/microsoft/vscode/issues/67890',
      tags: [tagIds[4], tagIds[5], tagIds[8]]
    }
  ];
};

// Sample activities
const generateSampleActivities = (
  userIds: number[],
  bountyIds: number[]
): Partial<InsertActivity>[] => {
  return [
    {
      userId: userIds[0],
      action: 'created',
      bountyId: bountyIds[0],
      metadata: JSON.stringify({ title: '[TEST] Fix React rendering performance issue' })
    },
    {
      userId: userIds[0],
      action: 'created',
      bountyId: bountyIds[1],
      metadata: JSON.stringify({ title: '[TEST] Add TypeScript support for custom hooks' })
    },
    {
      userId: userIds[3],
      action: 'created',
      bountyId: bountyIds[2],
      metadata: JSON.stringify({ title: '[TEST] Implement new TensorFlow visualization component' })
    },
    {
      userId: userIds[0],
      action: 'claimed',
      bountyId: bountyIds[2],
      metadata: JSON.stringify({ title: '[TEST] Implement new TensorFlow visualization component' })
    },
    {
      userId: userIds[3],
      action: 'created',
      bountyId: bountyIds[3],
      metadata: JSON.stringify({ title: '[TEST] Fix VSCode extension API documentation' })
    },
    {
      userId: userIds[2],
      action: 'claimed',
      bountyId: bountyIds[3],
      metadata: JSON.stringify({ title: '[TEST] Fix VSCode extension API documentation' })
    },
    {
      userId: userIds[3],
      action: 'completed',
      bountyId: bountyIds[3],
      metadata: JSON.stringify({ title: '[TEST] Fix VSCode extension API documentation', amount: '0.01' })
    },
    {
      userId: userIds[1],
      action: 'created',
      bountyId: bountyIds[4],
      metadata: JSON.stringify({ title: '[TEST] Implement dark theme for TensorFlow dashboard' })
    },
    {
      userId: userIds[0],
      action: 'claimed',
      bountyId: bountyIds[4],
      metadata: JSON.stringify({ title: '[TEST] Implement dark theme for TensorFlow dashboard' })
    },
    {
      userId: userIds[1],
      action: 'completed',
      bountyId: bountyIds[4],
      metadata: JSON.stringify({ title: '[TEST] Implement dark theme for TensorFlow dashboard', amount: '0.015' })
    },
    {
      userId: userIds[1],
      action: 'created',
      bountyId: bountyIds[5],
      metadata: JSON.stringify({ title: '[TEST] Add support for custom VSCode themes in workspace settings' })
    }
  ];
};

/**
 * Seeds the database with sample data
 */
export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Get existing authenticated user
    const existingUser = await storage.getUserByUsername('garvk1708');
    if (!existingUser) {
      console.log('❌ No authenticated user found. Please login first.');
      return;
    }

    // Insert sample users
    const usersToInsert = sampleUsers;

    const insertedUsers = await db.insert(users).values(usersToInsert).returning();
    console.log(`✅ Inserted ${insertedUsers.length} sample users`);

    // Combine existing user with sample users
    const allUsers = [existingUser, ...insertedUsers];

    // Insert sample repositories
    const insertedRepositories = await db.insert(repositories)
      .values(sampleRepositories.map(repo => ({
        ...repo,
        // Ensure ownerId exists in database
        ownerId: existingUser.id
      })))
      .returning();
    console.log(`✅ Inserted ${insertedRepositories.length} sample repositories`);

    // Insert sample tags
    const insertedTags = await db.insert(tags).values(sampleTags).returning();
    console.log(`✅ Inserted ${insertedTags.length} sample tags`);

    // Insert sample bounties with proper relationships
    const bounciesToInsert = generateSampleBounties(
      insertedRepositories.map(r => r.id),
      insertedTags.map(t => t.id),
      allUsers.map(u => u.id)
    );

    // Insert bounties and their tags
    for (const bountyData of bounciesToInsert) {
      const { tags: tagIds, ...bountyInsertData } = bountyData;

      // Insert the bounty
      const [insertedBounty] = await db.insert(bounties).values(bountyInsertData).returning();

      // Insert bounty-tag relationships
      for (const tagId of tagIds) {
        await db.insert(bountyTags).values({
          bountyId: insertedBounty.id,
          tagId
        });
      }
    }
    console.log(`✅ Inserted ${bounciesToInsert.length} sample bounties with tags`);

    // Get inserted bounties for activity references
    const insertedBounties = await db.select().from(bounties);

    // Insert sample activities
    const activitiesToInsert = generateSampleActivities(
      allUsers.map(u => u.id),
      insertedBounties.map(b => b.id)
    );

    await db.insert(activities).values(activitiesToInsert);
    console.log(`✅ Inserted ${activitiesToInsert.length} sample activities`);

    // Update or create reputation records
    for (const repData of sampleReputations) {
      const { username, ...reputationData } = repData;
      const user = allUsers.find(u => u.username === username);

      if (user) {
        await storage.createOrUpdateReputation(user.id, reputationData);
      }
    }
    console.log(`✅ Updated reputation for ${sampleReputations.length} users`);

    console.log('✅ Database seeding completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
}

/**
 * Clears sample data from the database
 */
export async function clearSampleData() {
  try {
    console.log('🧹 Clearing sample data...');

    // Get the authenticated user ID to preserve
    const existingUser = await storage.getUserByUsername('garvk1708');

    if (!existingUser) {
      console.log('❌ No authenticated user found. Please login first.');
      return;
    }

    // Clear bounty tags first (foreign key constraints)
    await db.delete(bountyTags);
    console.log('✅ Cleared bounty tags');

    // Clear activities
    await db.delete(activities);
    console.log('✅ Cleared activities');

    // Clear bounties
    await db.delete(bounties);
    console.log('✅ Cleared bounties');

    // Clear repositories
    await db.delete(repositories);
    console.log('✅ Cleared repositories');

    // Clear tags
    await db.delete(tags);
    console.log('✅ Cleared tags');

    // Clear reputation data
    await db.delete(reputation);
    console.log('✅ Cleared reputation data');

    // Clear users except the authenticated user
    await db.delete(users).where(
      eq(users.id, existingUser.id).not()
    );
    console.log('✅ Cleared users (preserved authenticated user)');

    console.log('✅ Sample data cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing sample data:', error);
    return false;
  }
}
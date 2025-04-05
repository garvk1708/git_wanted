import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authenticate, 
  createJWT, 
  exchangeCodeForToken, 
  fetchGitHubUser,
  fetchGitHubRepositories,
  fetchGitHubIssues,
  findOrCreateUser 
} from "./auth";
import { verifyTransaction } from "./ethereum";
import { seedDatabase, clearSampleData } from "./seed";
import { getEnv } from "../shared/env";
import cookieParser from "cookie-parser";

const env = getEnv();

console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware setup
  app.use(cookieParser());
  
  // Use same-site strict for security and CORS prevention
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });
  
  // Define API routes with /api prefix
  
  // Authentication routes
  app.get("/api/auth/github", async (req: Request, res: Response) => {
    try {
      // Get host from request headers or use fallback
      const host = req.headers.host || "56ddbf20-f332-489a-955a-6490fe0001b5-00-24jikthftbrfj.janeway.replit.dev";
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const redirectUri = `${protocol}://${host}/api/auth/github/callback`;
      
      console.log("[AUTH] Using GitHub redirect URI:", redirectUri);
      
      const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
      githubAuthUrl.searchParams.append("client_id", env.GITHUB_CLIENT_ID);
      githubAuthUrl.searchParams.append("redirect_uri", redirectUri);
      githubAuthUrl.searchParams.append("scope", "user:email,read:user,read:org,repo");
      
      console.log("[AUTH] GitHub auth URL:", githubAuthUrl.toString());
      res.json({ authUrl: githubAuthUrl.toString() });
    } catch (error) {
      console.error("[AUTH] Error generating GitHub auth URL:", error);
      res.status(500).json({ message: "Failed to generate GitHub auth URL" });
    }
  });
  
  app.get("/api/auth/github/callback", async (req: Request, res: Response) => {
    const { code } = req.query;
    
    console.log("[AUTH] GitHub callback received with code:", code ? "valid code" : "no code");
    
    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Invalid OAuth code" });
    }
    
    try {
      // Exchange code for access token
      const accessToken = await exchangeCodeForToken(code);
      
      // Fetch user data from GitHub
      const githubUser = await fetchGitHubUser(accessToken);
      console.log("[AUTH] Fetched GitHub user data for:", githubUser.login);
      
      // Find or create user in database
      const user = await findOrCreateUser(githubUser);
      console.log("[AUTH] User found or created with ID:", user.id);
      
      // Create JWT
      const token = createJWT({
        id: user.id,
        username: user.username,
        githubId: user.githubId,
        avatarUrl: user.avatarUrl,
        name: user.name,
        ethAddress: user.ethAddress
      });
      
      // Set cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
        sameSite: "lax" as const
      };
      
      // Set the auth token cookie
      res.cookie("token", token, cookieOptions);
      
      // Store the GitHub access token in a cookie as well
      res.cookie("github_token", accessToken, {
        ...cookieOptions,
        // GitHub token should have shorter expiration
        maxAge: 6 * 60 * 60 * 1000 // 6 hours
      });
      
      console.log("[AUTH] Successfully set github_token cookie");
      
      // Redirect to the root URL
      const host = req.headers.host || "56ddbf20-f332-489a-955a-6490fe0001b5-00-24jikthftbrfj.janeway.replit.dev";
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const redirectUrl = `${protocol}://${host}/`;
      
      console.log("[AUTH] Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("[AUTH] GitHub authentication error:", error);
      
      // Provide a user-friendly error page
      res.status(500).send(`
        <html>
          <head>
            <title>Authentication Error</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 50px; }
              .error { color: red; margin: 20px 0; }
              .btn { padding: 10px 20px; background: #6366f1; color: white; 
                     text-decoration: none; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>Authentication Failed</h1>
            <p class="error">${error instanceof Error ? error.message : "Unknown error"}</p>
            <a class="btn" href="/">Return to Home</a>
          </body>
        </html>
      `);
    }
  });
  
  // Manual code exchange endpoint for client-side initiated auth flow
  app.get("/api/auth/github/manual-exchange", async (req: Request, res: Response) => {
    const { code } = req.query;
    
    console.log("[AUTH] Manual GitHub code exchange received:", code ? "valid code" : "no code");
    
    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Invalid OAuth code" });
    }
    
    try {
      // Exchange code for access token
      const accessToken = await exchangeCodeForToken(code);
      
      // Fetch user data from GitHub
      const githubUser = await fetchGitHubUser(accessToken);
      
      // Find or create user in database
      const user = await findOrCreateUser(githubUser);
      
      // Create JWT
      const token = createJWT({
        id: user.id,
        username: user.username,
        githubId: user.githubId,
        avatarUrl: user.avatarUrl,
        name: user.name,
        ethAddress: user.ethAddress
      });
      
      // Set cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
        sameSite: "lax" as const
      };
      
      // Set the auth token cookie
      res.cookie("token", token, cookieOptions);
      
      // Store the GitHub access token in a cookie as well
      res.cookie("github_token", accessToken, {
        ...cookieOptions,
        // GitHub token should have shorter expiration
        maxAge: 6 * 60 * 60 * 1000 // 6 hours
      });
      
      console.log("[AUTH] Successfully set github_token cookie in manual exchange");
      
      // Return user data to client
      res.json({ 
        success: true,
        user: {
          id: user.id,
          username: user.username,
          githubId: user.githubId,
          avatarUrl: user.avatarUrl,
          name: user.name,
          ethAddress: user.ethAddress
        }
      });
    } catch (error) {
      console.error("[AUTH] Manual GitHub code exchange error:", error);
      res.status(500).json({ 
        success: false,
        message: "Authentication failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  app.get("/api/auth/me", authenticate, (req: AuthenticatedRequest, res: Response) => {
    console.log("[AUTH] User data requested, returning:", req.user.username);
    res.json(req.user);
  });
  
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    console.log("[AUTH] Logging out user");
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const
    };
    
    // Clear both authentication and GitHub token cookies
    res.clearCookie("token", cookieOptions);
    res.clearCookie("github_token", cookieOptions);
    
    res.json({ message: "Logged out successfully" });
  });
  
  // User routes
  app.patch("/api/users/ethereum-address", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    const { ethAddress } = req.body;
    const userId = req.user.id;
    
    if (!ethAddress) {
      return res.status(400).json({ message: "Ethereum address is required" });
    }
    
    try {
      console.log("[USER] Updating ETH address for user:", req.user.username);
      const updatedUser = await storage.updateUser(userId, { ethAddress });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedToken = createJWT({
        ...req.user,
        ethAddress
      });
      
      res.cookie("token", updatedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
        sameSite: "lax" as const
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("[USER] Error updating Ethereum address:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  });
  
  // Repository routes
  app.get("/api/repositories", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Look for an existing token in the cookie
      const token = req.cookies.github_token;
      
      if (!token) {
        // If no token, get repositories from database as fallback
        const repositories = await storage.getRepositoriesByOwner(req.user.id);
        console.log("[REPOS] No GitHub token found, returning repositories from database:", repositories.length);
        return res.json(repositories);
      }
      
      // Use the GitHub API to fetch repositories
      console.log("[REPOS] Fetching repositories from GitHub API");
      const repositories = await fetchGitHubRepositories(token);
      
      // Transform the repositories to match our schema
      const formattedRepos = repositories.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || "",
        url: repo.html_url,
        owner: {
          id: repo.owner.id,
          login: repo.owner.login,
          avatarUrl: repo.owner.avatar_url
        }
      }));
      
      console.log("[REPOS] Returning repositories from GitHub API:", formattedRepos.length);
      res.json(formattedRepos);
    } catch (error) {
      console.error("[REPOS] Error fetching repositories:", error);
      res.status(500).json({ message: "Error fetching repositories" });
    }
  });
  
  // Repository issues route
  app.get("/api/repositories/:owner/:repo/issues", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { owner, repo } = req.params;
      const token = req.cookies.github_token;
      
      if (!token) {
        return res.status(401).json({ message: "GitHub authentication required" });
      }
      
      console.log(`[ISSUES] Fetching issues for ${owner}/${repo}`);
      const issues = await fetchGitHubIssues(token, owner, repo);
      
      // Transform the issues to match our schema
      const formattedIssues = issues.map((issue: any) => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body || "",
        url: issue.html_url,
        state: issue.state,
        user: {
          id: issue.user.id,
          login: issue.user.login,
          avatarUrl: issue.user.avatar_url
        },
        labels: Array.isArray(issue.labels) ? issue.labels.map((label: any) => ({
          id: label.id,
          name: label.name,
          color: label.color
        })) : []
      }));
      
      console.log(`[ISSUES] Returning issues for ${owner}/${repo}, count:`, formattedIssues.length);
      res.json(formattedIssues);
    } catch (error) {
      console.error("[ISSUES] Error fetching issues:", error);
      res.status(500).json({ message: "Error fetching repository issues" });
    }
  });
  
  // Bounty routes
  app.get("/api/bounties", async (req: Request, res: Response) => {
    try {
      const { status, limit, offset, search } = req.query;
      
      const bounties = await storage.getBounties({
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        search: search as string
      });
      
      console.log("[BOUNTIES] Fetched bounties, count:", bounties.length);
      res.json(bounties);
    } catch (error) {
      console.error("[BOUNTIES] Error fetching bounties:", error);
      res.status(500).json({ message: "Error fetching bounties" });
    }
  });
  
  app.get("/api/bounties/:id", async (req: Request, res: Response) => {
    try {
      const bounty = await storage.getBountyWithDetails(parseInt(req.params.id));
      
      if (!bounty) {
        return res.status(404).json({ message: "Bounty not found" });
      }
      
      res.json(bounty);
    } catch (error) {
      console.error("[BOUNTIES] Error fetching bounty:", error);
      res.status(500).json({ message: "Error fetching bounty" });
    }
  });
  
  app.post("/api/bounties", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, description, amount, currency, repositoryId, issueNumber, issueUrl, tags } = req.body;
      
      if (!title || !description || !amount || !issueUrl) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Create the bounty
      const bounty = await storage.createBounty({
        title,
        description,
        amount: parseFloat(amount),
        currency: currency || "ETH",
        creatorId: req.user.id,
        repositoryId: repositoryId ? parseInt(repositoryId) : undefined,
        issueNumber: issueNumber ? parseInt(issueNumber) : undefined,
        issueUrl,
        status: "open"
      });
      
      // Add tags if provided
      if (tags && Array.isArray(tags)) {
        for (const tagName of tags) {
          const tag = await storage.getOrCreateTag(tagName);
          await storage.addTagToBounty(bounty.id, tag.id);
        }
      }
      
      // Create activity
      await storage.createActivity({
        userId: req.user.id,
        bountyId: bounty.id,
        action: "created"
      });
      
      // Update reputation
      await storage.createOrUpdateReputation(req.user.id, {
        createdBounties: 1,
        points: 5 // Points for creating a bounty
      });
      
      const bountyWithDetails = await storage.getBountyWithDetails(bounty.id);
      res.status(201).json(bountyWithDetails);
    } catch (error) {
      console.error("[BOUNTIES] Error creating bounty:", error);
      res.status(500).json({ message: "Error creating bounty" });
    }
  });
  
  app.patch("/api/bounties/:id/claim", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const bountyId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const bounty = await storage.getBounty(bountyId);
      
      if (!bounty) {
        return res.status(404).json({ message: "Bounty not found" });
      }
      
      if (bounty.status !== "open") {
        return res.status(400).json({ message: "This bounty is not available for claiming" });
      }
      
      if (bounty.creatorId === userId) {
        return res.status(400).json({ message: "You cannot claim your own bounty" });
      }
      
      const updatedBounty = await storage.updateBounty(bountyId, {
        status: "claimed",
        claimedById: userId,
        claimedAt: new Date()
      });
      
      // Create activity
      await storage.createActivity({
        userId,
        bountyId,
        action: "claimed"
      });
      
      const bountyWithDetails = await storage.getBountyWithDetails(bountyId);
      res.json(bountyWithDetails);
    } catch (error) {
      console.error("[BOUNTIES] Error claiming bounty:", error);
      res.status(500).json({ message: "Error claiming bounty" });
    }
  });
  
  app.patch("/api/bounties/:id/complete", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const bountyId = parseInt(req.params.id);
      const userId = req.user.id;
      const { transactionHash } = req.body;
      
      if (!transactionHash) {
        return res.status(400).json({ message: "Transaction hash is required" });
      }
      
      const bounty = await storage.getBounty(bountyId);
      
      if (!bounty) {
        return res.status(404).json({ message: "Bounty not found" });
      }
      
      if (bounty.status !== "claimed") {
        return res.status(400).json({ message: "This bounty is not in claimed status" });
      }
      
      if (bounty.creatorId !== userId) {
        return res.status(403).json({ message: "Only the bounty creator can complete it" });
      }
      
      // Skip transaction verification in development for easier testing
      let verificationResult: { success: boolean; error?: string } = { success: true };
      
      if (process.env.NODE_ENV === "production") {
        // Verify the transaction
        verificationResult = await verifyTransaction(transactionHash);
        
        if (!verificationResult.success) {
          return res.status(400).json({ 
            message: `Transaction verification failed: ${verificationResult.error || 'Unknown error'}` 
          });
        }
      }
      
      const updatedBounty = await storage.updateBounty(bountyId, {
        status: "completed",
        completedAt: new Date(),
        transactionHash
      });
      
      // Create activities
      await storage.createActivity({
        userId,
        bountyId,
        action: "completed",
        metadata: JSON.stringify({ transactionHash })
      });
      
      // Update solver's reputation
      if (bounty.claimedById) {
        await storage.createOrUpdateReputation(bounty.claimedById, {
          completedBounties: 1,
          points: 10 // Points for completing a bounty
        });
      }
      
      const bountyWithDetails = await storage.getBountyWithDetails(bountyId);
      res.json(bountyWithDetails);
    } catch (error) {
      console.error("[BOUNTIES] Error completing bounty:", error);
      res.status(500).json({ message: "Error completing bounty" });
    }
  });
  
  app.get("/api/user/bounties", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { role } = req.query;
      const userId = req.user.id;
      
      let bounties;
      if (role === "creator") {
        bounties = await storage.getBountiesByCreator(userId);
      } else if (role === "solver") {
        bounties = await storage.getBountiesByClaimer(userId);
      } else {
        return res.status(400).json({ message: "Invalid role specified" });
      }
      
      res.json(bounties);
    } catch (error) {
      console.error("[BOUNTIES] Error fetching user bounties:", error);
      res.status(500).json({ message: "Error fetching user bounties" });
    }
  });
  
  // Tag routes
  app.get("/api/tags", async (req: Request, res: Response) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      console.error("[TAGS] Error fetching tags:", error);
      res.status(500).json({ message: "Error fetching tags" });
    }
  });
  
  // Stats routes
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("[STATS] Error fetching stats:", error);
      res.status(500).json({ message: "Error fetching stats" });
    }
  });
  
  // Sample data routes
  app.post("/api/seed", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log("[SEED] Seeding database with sample data");
      const result = await seedDatabase();
      
      if (result) {
        res.json({ success: true, message: "Database seeded successfully" });
      } else {
        res.status(400).json({ success: false, message: "Failed to seed database. Make sure you're logged in." });
      }
    } catch (error) {
      console.error("[SEED] Error seeding database:", error);
      res.status(500).json({ success: false, message: "Error seeding database" });
    }
  });
  
  app.post("/api/seed/clear", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log("[SEED] Clearing sample data from database");
      const result = await clearSampleData();
      
      if (result) {
        res.json({ success: true, message: "Sample data cleared successfully" });
      } else {
        res.status(400).json({ success: false, message: "Failed to clear sample data. Make sure you're logged in." });
      }
    } catch (error) {
      console.error("[SEED] Error clearing sample data:", error);
      res.status(500).json({ success: false, message: "Error clearing sample data" });
    }
  });
  
  // User reputation route
  app.get("/api/users/:id/reputation", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const reputation = await storage.getReputation(userId);
      
      if (!reputation) {
        return res.json({ points: 0, completedBounties: 0, createdBounties: 0 });
      }
      
      res.json(reputation);
    } catch (error) {
      console.error("[REPUTATION] Error fetching user reputation:", error);
      res.status(500).json({ message: "Error fetching user reputation" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
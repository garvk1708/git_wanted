import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { getEnv } from "../shared/env";
import { AuthUser, GitHubUserResponse } from "../shared/types";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Example: Access an environment variable
console.log("Database URL:", process.env.DATABASE_URL);

const env = getEnv();
const scryptAsync = promisify(scrypt);

// Hash password for secure storage
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Compare a supplied password with a stored hashed password
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Create JWT token
export function createJWT(user: AuthUser): string {
  return jwt.sign(user, env.JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token
export function verifyJWT(token: string): AuthUser | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthUser;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Middleware to authenticate requests
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    console.log("[AUTH] Checking authentication, token exists:", !!token);
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
    const user = verifyJWT(token);
    if (!user) {
      console.log("[AUTH] Invalid token, clearing cookie");
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    
    console.log("[AUTH] User authenticated:", user.username);
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("[AUTH] Authentication error:", error);
    res.clearCookie("token");
    return res.status(401).json({ message: "Authentication error" });
  }
}

// Exchange GitHub code for access token
export async function exchangeCodeForToken(code: string): Promise<string> {
  console.log("[GITHUB] Exchanging code for token");
  const params = new URLSearchParams();
  params.append("client_id", env.GITHUB_CLIENT_ID);
  params.append("client_secret", env.GITHUB_CLIENT_SECRET);
  params.append("code", code);
  
  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    
    if (!response.ok) {
      console.error("[GITHUB] Token exchange HTTP error:", response.status, response.statusText);
      const responseText = await response.text();
      console.error("[GITHUB] Response body:", responseText);
      throw new Error(`GitHub token exchange failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error("[GITHUB] Token exchange API error:", data.error, data.error_description);
      throw new Error(`GitHub API error: ${data.error_description}`);
    }
    
    console.log("[GITHUB] Successfully exchanged code for token");
    return data.access_token;
  } catch (error) {
    console.error("[GITHUB] Token exchange error:", error);
    throw error;
  }
}

// Fetch GitHub user data using access token
export async function fetchGitHubUser(token: string): Promise<GitHubUserResponse> {
  console.log("[GITHUB] Fetching user data with token");
  
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (!response.ok) {
      console.error("[GITHUB] User fetch HTTP error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("[GITHUB] Error details:", errorText);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const userData = await response.json();
    console.log("[GITHUB] Successfully fetched user data for:", userData.login);
    return userData;
  } catch (error) {
    console.error("[GITHUB] User fetch error:", error);
    throw error;
  }
}

// Fetch GitHub repositories for user
export async function fetchGitHubRepositories(token: string): Promise<any[]> {
  console.log("[GITHUB] Fetching user repositories");
  try {
    const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });
    
    if (!response.ok) {
      console.error("[GITHUB] Repos fetch HTTP error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("[GITHUB] Error details:", errorText);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const repos = await response.json();
    console.log("[GITHUB] Successfully fetched repositories, count:", repos.length);
    return repos;
  } catch (error) {
    console.error("[GITHUB] Repository fetch error:", error);
    throw error;
  }
}

// Fetch issues from a GitHub repository
export async function fetchGitHubIssues(token: string, owner: string, repo: string): Promise<any[]> {
  console.log(`[GITHUB] Fetching issues for ${owner}/${repo}`);
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`, {
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github.v3+json",
      },
    });
    
    if (!response.ok) {
      console.error(`[GITHUB] Issues fetch HTTP error for ${owner}/${repo}:`, response.status, response.statusText);
      const errorText = await response.text();
      console.error("[GITHUB] Error details:", errorText);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const issues = await response.json();
    console.log(`[GITHUB] Successfully fetched issues for ${owner}/${repo}, count:`, issues.length);
    return issues;
  } catch (error) {
    console.error(`[GITHUB] Issue fetch error for ${owner}/${repo}:`, error);
    throw error;
  }
}

// Find or create user in database
export async function findOrCreateUser(githubUser: GitHubUserResponse) {
  try {
    console.log("[DB] Looking up user by GitHub ID:", githubUser.id);
    let user = await storage.getUserByGithubId(githubUser.id.toString());
    
    if (!user) {
      console.log("[DB] User not found, creating new user for:", githubUser.login);
      // Create new user
      user = await storage.createUser({
        username: githubUser.login,
        githubId: githubUser.id.toString(),
        email: githubUser.email || null,
        avatarUrl: githubUser.avatar_url,
        name: githubUser.name || null,
        bio: githubUser.bio || null,
      });
      
      console.log("[DB] New user created with ID:", user.id);
      
      // Initialize reputation
      await storage.createOrUpdateReputation(user.id, {
        points: 0,
        completedBounties: 0,
        createdBounties: 0,
      });
      
      console.log("[DB] Initialized reputation for new user");
    } else {
      console.log("[DB] User found:", user.username, "ID:", user.id);
    }
    
    return user;
  } catch (error) {
    console.error("[DB] Error in findOrCreateUser:", error);
    throw error;
  }
}
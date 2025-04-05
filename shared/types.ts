import { User, Bounty, Repository } from "./schema";

export type AuthUser = Pick<User, "id" | "username" | "githubId" | "avatarUrl" | "name" | "ethAddress">;

// GitHub API responses
export interface GitHubUserResponse {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  email: string;
  bio: string;
}

export interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  issues_url: string;
  owner: {
    id: number;
    login: string;
    avatar_url: string;
  };
}

export interface GitHubIssueResponse {
  id: number;
  number: number;
  title: string;
  body: string;
  html_url: string;
  state: string;
  user: {
    id: number;
    login: string;
    avatar_url: string;
  };
  labels: {
    id: number;
    name: string;
    color: string;
  }[];
}

// API response types
export interface BountyWithDetails extends Bounty {
  creator: AuthUser;
  repository: Repository | null;
  tags: string[];
  claimedBy?: AuthUser;
}

export interface DashboardStats {
  totalBounties: number;
  totalPaidOut: number;
  activeBounties: number;
  completedBounties: number;
}

export enum UserRole {
  CREATOR = "creator",
  SOLVER = "solver"
}

export interface EthereumTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: "pending" | "confirmed" | "failed";
}

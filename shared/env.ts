import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Database
  DATABASE_URL: z.string().min(1),
  
  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GITHUB_REDIRECT_URI: z.string().url().optional(),
  
  // Ethereum/Infura
  INFURA_API_KEY: z.string().min(1),
  ETHEREUM_NETWORK: z.enum(["mainnet", "goerli", "sepolia"]).default("sepolia"),
  
  // JWT Secret
  JWT_SECRET: z.string().min(1).default("dev_jwt_secret"),
  
  // Stripe (optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  VITE_STRIPE_PUBLIC_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Default environment to development
const nodeEnv = process.env.NODE_ENV || "development";

// Function to validate and get environment variables
export function getEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Invalid environment variables");
  }
}

// For client-side usage (only expose what's needed)
export const clientEnv = {
  VITE_GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  VITE_INFURA_API_KEY: process.env.INFURA_API_KEY,
  VITE_ETHEREUM_NETWORK: process.env.ETHEREUM_NETWORK || "sepolia",
  VITE_STRIPE_PUBLIC_KEY: process.env.VITE_STRIPE_PUBLIC_KEY,
};

// Example: Access an environment variable
console.log("Database URL:", process.env.DATABASE_URL);

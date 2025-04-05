# GitWanted: Blockchain-Powered Bounty Platform

![GitWanted Logo]

GitWanted is a full-stack web application that bridges GitHub issues with cryptocurrency rewards, empowering developers to earn crypto for solving open-source challenges. This platform connects project maintainers who need help with developers looking to earn rewards, all managed through blockchain technology.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Configuration & Environment Variables](#configuration--environment-variables)
5. [API Integration](#api-integration)
6. [Database Schema](#database-schema)
7. [Authentication Flow](#authentication-flow)
8. [Ethereum Integration](#ethereum-integration)
9. [Application Workflow](#application-workflow)
10. [Local Development Setup](#local-development-setup)
11. [Deployment Guide](#deployment-guide)
12. [Troubleshooting](#troubleshooting)

## Features

- **GitHub Integration**: Authenticate with GitHub, browse your repositories and issues
- **Bounty Creation**: Create bounties for specific GitHub issues with crypto rewards
- **Ethereum Wallet Connection**: Connect your MetaMask or other Web3 wallet
- **Bounty Management**: Track, claim, and complete bounties
- **Reputation System**: Build reputation through successful bounty completions
- **Activity Timeline**: Track all platform activities
- **Responsive Design**: Mobile, tablet, and desktop friendly UI

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - TanStack Query for data fetching
  - Tailwind CSS + shadcn/ui for styling
  - Framer Motion for animations
  - Ethers.js for Ethereum interactions

- **Backend**:
  - Express.js server
  - PostgreSQL database
  - Drizzle ORM for database interactions
  - JSON Web Tokens (JWT) for authentication

- **Integrations**:
  - GitHub OAuth for authentication
  - Ethereum blockchain for transactions
  - Infura API for blockchain interaction

## Project Structure

The project follows a structured organization where frontend and backend code are separated but share common type definitions:

```
/
├── client/                    # Frontend React application
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React context providers 
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions & configuration
│   │   ├── pages/             # Page components
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # Entry point
│   └── index.html             # HTML template
├── server/                    # Backend Express application
│   ├── auth.ts                # Authentication logic
│   ├── db.ts                  # Database connection
│   ├── ethereum.ts            # Ethereum interaction utilities
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Data access layer
│   └── vite.ts                # Server development configuration
└── shared/                    # Shared code between client and server
    ├── env.ts                 # Environment variable validation
    ├── schema.ts              # Database schema definitions
    └── types.ts               # Shared TypeScript interfaces
```

## Configuration & Environment Variables

The application requires several environment variables to be set up. Create a `.env` file in the root directory with the following:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/gitwanted

# Authentication
JWT_SECRET=your_jwt_secret_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Ethereum/Web3
INFURA_API_KEY=your_infura_api_key
```

### How to set up these variables:

1. **DATABASE_URL**:
   - Install PostgreSQL on your machine or use a cloud provider
   - Create a new database called `gitwanted`
   - Format: `postgresql://username:password@hostname:port/database_name`

2. **JWT_SECRET**:
   - Generate a secure random string (at least 32 characters)
   - Example: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **GitHub OAuth Credentials**:
   - Go to GitHub Developer Settings: https://github.com/settings/developers
   - Create a new OAuth App
   - Set Homepage URL to `http://localhost:5000`
   - Set Authorization callback URL to `http://localhost:5000/api/auth/github/callback`
   - Copy the generated Client ID and Client Secret

4. **Infura API Key**:
   - Sign up at Infura: https://infura.io/
   - Create a new project
   - Copy the Project ID (API Key)

## API Integration

### GitHub API

The application interacts with the GitHub API for:
- User authentication via OAuth
- Fetching user repositories
- Fetching repository issues
- Linking bounties to specific issues

Key files:
- `server/auth.ts`: Contains GitHub OAuth logic
- `server/routes.ts`: API endpoints for GitHub data

### Ethereum API

The application interacts with the Ethereum blockchain via:
- Ethers.js library
- Infura API as a provider

Key files:
- `server/ethereum.ts`: Server-side Ethereum utilities
- `client/src/contexts/ethereum-context.tsx`: Frontend Ethereum context provider

## Database Schema

The database schema is defined in `shared/schema.ts` using Drizzle ORM. Key tables include:

1. **users**: User accounts, linked to GitHub profiles
2. **repositories**: GitHub repositories referenced in bounties
3. **bounties**: The core bounty entities with details and rewards
4. **tags**: Categories or skills for bounties
5. **bountyTags**: Many-to-many relationship between bounties and tags
6. **activities**: Timeline of platform activities
7. **reputation**: User reputation and stats

Each table has corresponding TypeScript interfaces for type safety throughout the application.

### How to Create and Update Database

The database can be managed using Drizzle migrations:

```bash
# Push schema changes to database
npm run db:push

# Generate migration file
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Authentication Flow

1. **GitHub OAuth Flow**:
   - User clicks "Sign in with GitHub"
   - Redirected to GitHub authorization page
   - Upon approval, GitHub redirects back with a temporary code
   - Server exchanges code for an access token
   - User information is fetched from GitHub API
   - User is created or updated in database
   - JWT token is generated and set as an HTTP-only cookie

2. **JWT Authentication**:
   - Protected routes check for valid JWT token in cookies
   - Token contains encoded user ID and expiration time
   - Invalid or expired tokens trigger 401 Unauthorized response

## Ethereum Integration

### Wallet Connection

1. User clicks "Connect Wallet" in the UI
2. Application checks if MetaMask or other wallet is installed
3. Once connected, the application stores the wallet address
4. User can now send and receive crypto transactions

### Transaction Flow

1. **Creating a Bounty**:
   - Creator sets bounty amount and currency
   - Creates an escrow transaction to lock funds
   - Transaction is verified on the blockchain
   - Bounty is marked as "funded" once transaction is confirmed

2. **Completing a Bounty**:
   - Creator confirms work is completed
   - Initiates a transaction to transfer funds to solver
   - Transaction is verified on the blockchain
   - Bounty is marked as "completed" once transaction is confirmed

## Application Workflow

### Creator Workflow

1. Creator authenticates with GitHub
2. Connects Ethereum wallet
3. Browses their repositories and issues
4. Creates a bounty for a specific issue
   - Sets title, description, and amount
   - Funds bounty with cryptocurrency
5. Reviews and approves submitted solutions
6. Releases payment once work is satisfactory

### Solver Workflow

1. Solver authenticates with GitHub
2. Connects Ethereum wallet
3. Browses available bounties filtered by tags, amount, etc.
4. Claims a bounty they want to work on
5. Submits their solution through GitHub
6. Receives payment when creator approves the work

## Local Development Setup

Follow these steps to set up the project for local development:

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Git
- PostgreSQL (v13 or later)
- MetaMask browser extension (for testing Ethereum features)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/gitwanted.git
cd gitwanted
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create PostgreSQL Database

```bash
# Log into PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE gitwanted;

# Create user (optional)
CREATE USER gituser WITH ENCRYPTED PASSWORD 'yourpassword';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE gitwanted TO gituser;

# Exit PostgreSQL
\q
```

### Step 4: Set Up Environment Variables

Create a `.env` file in the root directory with the variables mentioned in the [Configuration section](#configuration--environment-variables).

### Step 5: Initialize the Database

```bash
npm run db:push
```

### Step 6: Start the Development Server

```bash
npm run dev
```

This will start both the backend server and the React development server. The application should be accessible at:
- Frontend: http://localhost:5000
- API: http://localhost:5000/api

### Making Changes

- Frontend code is in the `client` directory
- Backend code is in the `server` directory
- Shared code is in the `shared` directory

When you make changes to any file, the development server will automatically reload with your changes.

## Deployment Guide



### Option 1: Deploy to Traditional Hosting

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set up environment variables on your hosting provider
3. Start the server:
   ```bash
   npm start
   ```

### Option 2: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t gitwanted .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 --env-file .env gitwanted
   ```

## Testing with Sepolia Testnet

### Setup Sepolia Wallet
1. Install MetaMask browser extension
2. Switch network to "Sepolia Test Network"
3. Get test ETH from a Sepolia faucet:
   - Visit https://sepoliafaucet.com
   - Enter your wallet address
   - Receive free test ETH

### Testing Bounty Payments
1. Create a bounty:
   - Click "Create Bounty"
   - Set amount (e.g. 0.01 ETH)
   - Confirm MetaMask transaction
2. Claim a bounty:
   - Browse existing bounties
   - Click "Claim" on a bounty
   - Confirm MetaMask transaction
3. Complete bounty:
   - Submit your solution
   - Wait for creator approval
   - Receive test ETH payment

Note: All transactions use test ETH on Sepolia, not real funds.

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify DATABASE_URL is correctly formatted
   - Ensure PostgreSQL is running
   - Check database user permissions

2. **GitHub Authentication Issues**:
   - Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
   - Ensure callback URL matches the one registered in GitHub OAuth settings
   - Check network connectivity to GitHub API

3. **Ethereum Connection Problems**:
   - Verify INFURA_API_KEY is correct
   - Ensure MetaMask is installed and unlocked
   - Check if you're connected to the correct network

4. **Issues Not Appearing in Repository Selector**:
   - Ensure GitHub token has sufficient permissions
   - Verify the repository has open issues
   - Check the browser console for API errors

### Getting Help

If you're still experiencing issues, please:
1. Check the browser console for error messages
2. Review server logs for backend errors
3. Create an issue on the GitHub repository with:
   - Detailed description of the problem
   - Steps to reproduce
   - Error messages and logs
   - Environment information (browser, OS, etc.)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- The shadcn/ui team for the component library
- The Ethereum and Web3 community for resources and inspiration
- All the open source libraries that made this project possible

---

Made with ❤️ by the GitWanted Team
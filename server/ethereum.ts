import * as ethers from "ethers";
import { getEnv } from "../shared/env";

const env = getEnv();

// Initialize Ethereum provider
const getProvider = () => {
  const network = env.ETHEREUM_NETWORK || 'sepolia';
  console.log(`Using Ethereum network: ${network}`);
  return new ethers.JsonRpcProvider(
    `https://${network}.infura.io/v3/${env.INFURA_API_KEY}`
  );
};

// Verify an Ethereum transaction
export async function verifyTransaction(txHash: string): Promise<{
  success: boolean;
  amount?: string;
  from?: string;
  to?: string;
  error?: string;
}> {
  try {
    const provider = getProvider();
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      return { success: false, error: "Transaction not found" };
    }
    
    // Wait for transaction to be mined (if it's not already)
    const receipt = await provider.waitForTransaction(txHash);
    
    if (!receipt.status) {
      return { success: false, error: "Transaction failed" };
    }
    
    const amount = ethers.formatEther(tx.value);
    
    return {
      success: true,
      amount,
      from: tx.from,
      to: tx.to,
    };
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

// Get ETH balance for address
export async function getBalance(address: string): Promise<string> {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}

// Get current ETH price in USD
export async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error("Error getting ETH price:", error);
    return 0; // Default fallback
  }
}

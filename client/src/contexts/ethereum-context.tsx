import { createContext, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EthereumContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (params: {
    to: string;
    value: string;
    currency: string;
  }) => Promise<string | null>;
  balance: string | null;
  isConnecting: boolean;
}

interface TransactionParams {
  to: string;
  value: string;
  currency: string;
}

const EthereumContext = createContext<EthereumContextType>({
  address: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  sendTransaction: async () => null,
  balance: null,
  isConnecting: false,
});

export function EthereumProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>("0.0");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const mockAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  
  const connectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAddress(mockAddress);
      setBalance("1.5"); // Mock balance
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error("Connect wallet error:", error);
      toast({
        title: "Wallet connection failed",
        description: "Could not connect to wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
    toast({
      title: "Wallet disconnected",
      variant: "default",
    });
  };

  const sendTransaction = async ({ to, value, currency }: TransactionParams): Promise<string | null> => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send transactions",
        variant: "destructive",
      });
      return null;
    }

    try {
      // For now, only ETH is supported
      if (currency !== "ETH") {
        toast({
          title: "Unsupported currency",
          description: "Only ETH transactions are currently supported",
          variant: "destructive",
        });
        return null;
      }

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock transaction hash
      const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      toast({
        title: "Transaction sent",
        description: `Transaction hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
      });
      
      return txHash;
    } catch (error) {
      console.error("Send transaction error:", error);
      toast({
        title: "Transaction failed",
        description: "Failed to send transaction",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <EthereumContext.Provider
      value={{
        address,
        connectWallet,
        disconnectWallet,
        sendTransaction,
        balance,
        isConnecting,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}

export const useEthereum = () => useContext(EthereumContext);

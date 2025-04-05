import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare const window: EthereumWindow;

interface UseEthereumReturn {
  address: string | null;
  balance: string | null;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  sendTransaction: (to: string, value: string) => Promise<string>;
  isMetaMaskInstalled: boolean;
}

export function useEthereumWallet(): UseEthereumReturn {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for MetaMask installation
  useEffect(() => {
    const checkMetaMask = async () => {
      const ethereum = (window as EthereumWindow).ethereum;
      setIsMetaMaskInstalled(!!ethereum && !!ethereum.isMetaMask);
    };

    checkMetaMask();
  }, []);

  // Update balance when address changes
  useEffect(() => {
    const getBalance = async () => {
      if (!address || !window.ethereum) return;

      try {
        const balanceHex = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });
        
        // Convert balance from wei to ETH
        const balanceInWei = parseInt(balanceHex, 16);
        const balanceInEth = balanceInWei / 1e18;
        setBalance(balanceInEth.toFixed(4));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      }
    };

    if (address) {
      getBalance();
    }
  }, [address]);

  // Listen for account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setAddress(null);
        setBalance(null);
      } else if (accounts[0] !== address) {
        // User switched to a different account
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when the user switches networks
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [address]);

  // Connect wallet
  const connect = useCallback(async (): Promise<string | null> => {
    console.log("Attempting to connect wallet...");
    if (!window.ethereum) {
      console.log("MetaMask not detected");
      toast({
        title: "MetaMask not installed",
        description: "Please install the MetaMask browser extension to connect your wallet",
        variant: "destructive",
      });
      // Open MetaMask website in a new tab
      window.open('https://metamask.io/download/', '_blank');
      return null;
    }

    try {
      console.log("Requesting accounts...");
      
      // Mock wallet functionality if in development (for testing)
      if (window.location.hostname.includes('replit') || window.location.hostname.includes('localhost')) {
        console.log("Using mock wallet for development environment");
        const mockAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik's address
        setAddress(mockAddress);
        setBalance("1.2345");
        
        toast({
          title: "Development Mode",
          description: "Connected to mock wallet for development",
        });
        
        return mockAddress;
      }
      
      // Normal wallet flow for production
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        console.log("Account connected:", accounts[0]);
        setAddress(accounts[0]);
        return accounts[0];
      }
      return null;
    } catch (error: any) {
      if (error.code === 4001) {
        // User rejected the request
        console.log("User rejected wallet connection");
        toast({
          title: "Connection rejected",
          description: "You rejected the connection request",
          variant: "destructive",
        });
      } else {
        console.error("Error connecting to wallet:", error);
        toast({
          title: "Connection error",
          description: error.message || "Failed to connect to wallet",
          variant: "destructive",
        });
      }
      return null;
    }
  }, [toast]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
  }, []);

  // Send transaction
  const sendTransaction = useCallback(
    async (to: string, value: string): Promise<string> => {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      if (!address) {
        throw new Error("Wallet not connected");
      }

      try {
        // Convert ETH value to wei
        const valueInWei = `0x${(parseFloat(value) * 1e18).toString(16)}`;

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: address,
              to,
              value: valueInWei,
              gas: "0x5208", // 21000 gas (standard transaction)
            },
          ],
        });

        return txHash;
      } catch (error: any) {
        if (error.code === 4001) {
          throw new Error("Transaction rejected by user");
        } else {
          console.error("Transaction error:", error);
          throw new Error(error.message || "Failed to send transaction");
        }
      }
    },
    [address]
  );

  return {
    address,
    balance,
    connect,
    disconnect,
    sendTransaction,
    isMetaMaskInstalled,
  };
}

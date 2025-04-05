import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BountyWithDetails } from "@shared/types";
import { useAuthContext } from "@/contexts/auth-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BountyDetailProps {
  id: string;
}

export default function BountyDetail({ id }: BountyDetailProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuthContext();
  const { address, connectWallet, sendTransaction } = useEthereum();
  const { toast } = useToast();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const { data: bounty, isLoading, error, refetch } = useQuery<BountyWithDetails>({
    queryKey: [`/api/bounties/${id}`],
  });

  const claimMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/bounties/${id}/claim`, {});
    },
    onSuccess: () => {
      toast({
        title: "Bounty claimed successfully!",
        description: "You can now start working on this issue.",
        variant: "default",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to claim bounty",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/bounties/${id}/complete`, {
        transactionHash,
      });
    },
    onSuccess: () => {
      toast({
        title: "Bounty completed successfully!",
        description: "The payment has been verified and the bounty is now marked as completed.",
        variant: "default",
      });
      setIsPaymentModalOpen(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Failed to complete bounty",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleClaim = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to claim this bounty.",
        variant: "destructive",
      });
      return;
    }

    claimMutation.mutate();
  };

  const handlePay = async () => {
    if (!address) {
      toast({
        title: "Wallet required",
        description: "Please connect your Ethereum wallet to make a payment.",
        variant: "destructive",
      });
      await connectWallet();
      return;
    }

    if (!bounty || !bounty.claimedBy || !bounty.claimedBy.ethAddress) {
      toast({
        title: "Payment error",
        description: "The solver doesn't have an Ethereum address configured.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send the transaction
      const hash = await sendTransaction({
        to: bounty.claimedBy.ethAddress,
        value: bounty.amount.toString(),
        currency: bounty.currency,
      });

      if (hash) {
        setTransactionHash(hash);
        setIsPaymentModalOpen(true);
      }
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Failed to send transaction",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTransaction = () => {
    if (!transactionHash) {
      toast({
        title: "Transaction hash required",
        description: "Please provide the transaction hash to complete the bounty.",
        variant: "destructive",
      });
      return;
    }

    completeMutation.mutate();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getBountyStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-primary-400 bg-primary-500/20';
      case 'claimed':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-dark-400 bg-dark-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900">
      <Header />
      
      <motion.section 
        className="container mx-auto max-w-5xl px-4 pt-32 pb-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {isLoading ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-8" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
            
            <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
              <Skeleton className="h-7 w-40 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-6" />
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ) : error ? (
          <motion.div
            variants={itemVariants}
            className="text-center p-8 bg-dark-800/30 border border-dark-700 rounded-xl"
          >
            <p className="text-red-400">Failed to load bounty details. Please try again later.</p>
            <Button
              className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white"
              onClick={() => setLocation('/bounties')}
            >
              Back to Bounties
            </Button>
          </motion.div>
        ) : bounty ? (
          <>
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
                    {bounty.title}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBountyStatusColor(bounty.status)}`}>
                    {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center text-dark-300 mb-8">
                  <span>Created by </span>
                  <div className="flex items-center ml-2">
                    {bounty.creator.avatarUrl ? (
                      <img 
                        className="w-5 h-5 rounded-full mr-1" 
                        src={bounty.creator.avatarUrl} 
                        alt={bounty.creator.username}
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full mr-1 bg-dark-600 flex items-center justify-center text-dark-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-white">{bounty.creator.username}</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                {user && bounty.status === 'open' && bounty.creator.id !== user.id && (
                  <Button 
                    className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
                    onClick={handleClaim}
                    disabled={claimMutation.isPending}
                  >
                    {claimMutation.isPending ? "Claiming..." : "Claim Bounty"}
                  </Button>
                )}
                
                {user && bounty.status === 'claimed' && bounty.creator.id === user.id && (
                  <Button 
                    className="w-full md:w-auto px-8 py-3 bg-accent-600 hover:bg-accent-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]"
                    onClick={handlePay}
                  >
                    Pay Bounty
                  </Button>
                )}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-primary-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white font-heading">Reward</h3>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary-400 mr-2">{bounty.amount}</span>
                  <span className="text-white">{bounty.currency}</span>
                </div>
              </div>
              
              <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-primary-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white font-heading">
                    {bounty.status === 'claimed' || bounty.status === 'completed' ? "Claimed By" : "Status"}
                  </h3>
                </div>
                {(bounty.status === 'claimed' || bounty.status === 'completed') && bounty.claimedBy ? (
                  <div className="flex items-center">
                    {bounty.claimedBy.avatarUrl ? (
                      <img 
                        className="w-6 h-6 rounded-full mr-2" 
                        src={bounty.claimedBy.avatarUrl} 
                        alt={bounty.claimedBy.username}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full mr-2 bg-dark-600 flex items-center justify-center text-dark-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-white">{bounty.claimedBy.username}</span>
                  </div>
                ) : (
                  <div className="text-white">
                    {bounty.status === 'open' ? "Available" : bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                  </div>
                )}
              </div>
              
              <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-primary-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white font-heading">GitHub Issue</h3>
                </div>
                <a 
                  href={bounty.issueUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 transition-colors break-all"
                >
                  {bounty.issueUrl}
                </a>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-dark-800/30 border border-dark-700 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 font-heading">Description</h3>
              <p className="text-dark-200 whitespace-pre-line mb-6">
                {bounty.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {bounty.tags.map((tag, i) => (
                  <span key={i} className="bg-dark-700 text-dark-300 px-3 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {bounty.status === 'completed' && bounty.transactionHash && (
              <motion.div variants={itemVariants} className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 font-heading">Payment Details</h3>
                <div className="mb-2">
                  <span className="text-dark-300">Transaction Hash: </span>
                  <a 
                    href={`https://${bounty.currency === 'ETH' ? (process.env.ETHEREUM_NETWORK || 'sepolia') : 'sepolia'}.etherscan.io/tx/${bounty.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:underline break-all"
                  >
                    {bounty.transactionHash}
                  </a>
                </div>
                <div>
                  <span className="text-dark-300">Completed: </span>
                  <span className="text-white">
                    {new Date(bounty.completedAt || '').toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )}
          </>
        ) : null}
      </motion.section>
      
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="bg-dark-800 border border-dark-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading text-white">Complete Bounty Payment</DialogTitle>
          </DialogHeader>
          
          <div>
            <p className="text-dark-200 mb-4">
              Please verify the transaction hash to complete the bounty payment.
            </p>
            
            <div className="mb-4">
              <label className="text-white text-sm mb-1 block">Transaction Hash</label>
              <Input
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                className="bg-dark-900 border-dark-600 text-white"
                placeholder="0x..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
              className="border-dark-600 text-dark-200 hover:text-white hover:border-dark-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteTransaction}
              className="bg-primary-600 hover:bg-primary-500 text-white"
              disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? "Verifying..." : "Complete Bounty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}

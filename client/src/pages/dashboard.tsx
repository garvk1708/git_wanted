import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/auth-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { UserRole } from "@shared/types";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuthContext();
  const { address, connectWallet } = useEthereum();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Redirect to appropriate dashboard when role is selected
  useEffect(() => {
    if (selectedRole === UserRole.CREATOR) {
      setLocation("/creator/dashboard");
    } else if (selectedRole === UserRole.SOLVER) {
      setLocation("/solver/dashboard");
    }
  }, [selectedRole, setLocation]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900">
      <Header />
      
      <motion.section 
        className="container mx-auto max-w-6xl px-4 pt-32 pb-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
            Welcome, <span className="text-primary-400">{user?.name || user?.username}</span>
          </h1>
          <p className="text-dark-200 text-lg mb-12">
            Choose which role you'd like to use today. You can switch between roles at any time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            className="bg-dark-800/40 border border-dark-700 rounded-xl p-8 transition-all duration-300 hover:border-primary-500/60 group"
            variants={itemVariants}
          >
            <div className="mb-6 flex justify-between items-start">
              <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:bg-primary-500/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-primary-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <span className="bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-xs font-medium">For Project Maintainers</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4 font-heading">Bounty Creator</h3>
            <p className="text-dark-300 mb-6">Create and fund bounties for issues in your repositories. Attract talented developers to help solve your project's challenges.</p>
            
            <Button 
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
              onClick={() => setSelectedRole(UserRole.CREATOR)}
            >
              Continue as Creator
            </Button>
          </motion.div>
          
          <motion.div 
            className="bg-dark-800/40 border border-dark-700 rounded-xl p-8 transition-all duration-300 hover:border-accent-500/60 group"
            variants={itemVariants}
          >
            <div className="mb-6 flex justify-between items-start">
              <div className="w-16 h-16 bg-accent-500/20 rounded-xl flex items-center justify-center group-hover:bg-accent-500/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-accent-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <span className="bg-accent-500/10 text-accent-400 px-3 py-1 rounded-full text-xs font-medium">For Developers</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4 font-heading">Bounty Solver</h3>
            <p className="text-dark-300 mb-6">Find and claim bounties that match your skills. Earn cryptocurrency rewards by solving open source issues.</p>
            
            <Button 
              className="w-full py-3 bg-accent-600 hover:bg-accent-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]"
              onClick={() => setSelectedRole(UserRole.SOLVER)}
            >
              Continue as Solver
            </Button>
          </motion.div>
        </div>

        {!address && (
          <motion.div 
            className="bg-dark-800/30 border border-dark-700 rounded-xl p-6 mb-8"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-heading">Connect Your Ethereum Wallet</h3>
                <p className="text-dark-300">Connect your wallet to fund or receive bounty payments through Ethereum.</p>
              </div>
              <Button 
                className="px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="text-center mt-16"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold text-white mb-4 font-heading">Not sure where to start?</h3>
          <Button 
            variant="outline"
            className="mx-auto py-2 border border-dark-600 hover:border-primary-500 rounded-lg text-dark-100 hover:text-white transition-all duration-300"
            onClick={() => setLocation("/bounties")}
          >
            Browse Available Bounties
          </Button>
        </motion.div>
      </motion.section>
      
      <Footer />
    </div>
  );
}

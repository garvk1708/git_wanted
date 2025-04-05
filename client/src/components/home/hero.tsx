import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";
import { Link } from "wouter";

export default function Hero() {
  const controls = useAnimation();
  const { user, login } = useAuthContext();
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  // Define the words for the typing animation with their colors
  const words = [
    { text: "Fund", color: "#6366f1" },      // Primary purple
    { text: "Solve", color: "#22c55e" },     // Green
    { text: "Earn", color: "#eab308" },      // Yellow/Gold
    { text: "Build", color: "#ec4899" },     // Pink
    { text: "Code", color: "#8b5cf6" },      // Light purple
  ];
  
  // Advanced typing animation that cycles through words
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Handle the typing effect
    const handleTyping = () => {
      // Current word data
      const currentWord = words[wordIndex].text;
      const shouldDelete = isDeleting;
      
      // Set typing speed based on action (typing vs deleting)
      setTypingSpeed(isDeleting ? 80 : 150);
      
      // Update text based on typing direction
      setText(prev => {
        if (!shouldDelete) {
          // Typing forward
          return currentWord.substring(0, prev.length + 1);
        } else {
          // Deleting
          return currentWord.substring(0, prev.length - 1);
        }
      });
      
      // Determine next state
      if (!shouldDelete && text === currentWord) {
        // Finished typing a word - pause before deleting
        setTypingSpeed(1500); // Pause at full word
        setIsDeleting(true);
      } else if (shouldDelete && text === '') {
        // Finished deleting a word - move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    };
    
    // Set timeout for typing effect
    timeout = setTimeout(handleTyping, typingSpeed);
    
    // Cleanup
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed]);
  
  const handleLogin = async () => {
    try {
      console.log("Hero login button clicked");
      await login();
    } catch (error) {
      console.error('Error starting GitHub auth flow:', error);
    }
  };
  
  return (
    <section className="pt-24 pb-16 md:pt-36 md:pb-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.15),transparent_40%)]"></div>
      <div className="absolute top-20 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
              <div className="flex items-center">
                <span
                  className="inline-block typing-animation overflow-hidden border-r-4 border-primary-500 whitespace-nowrap pr-1"
                  style={{ color: words[wordIndex].color }}
                >
                  {text}
                </span>
              </div>
              <span className="text-primary-400 block mt-2">Open Source Bounties</span>
            </h1>
            <p className="text-lg text-dark-200 mb-8 max-w-xl">
              Connect GitHub issues with blockchain rewards. GitWanted bridges Web2 and Web3 to incentivize open source contributions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Button 
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
                    onClick={() => window.location.href = "/creator/dashboard"}
                  >
                    Create a Bounty
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-8 py-3 bg-transparent border border-dark-600 hover:border-primary-500 rounded-lg text-dark-100 hover:text-white transition-all duration-300"
                    onClick={() => window.location.href = "/solver/dashboard"}
                  >
                    Find Bounties to Solve
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
                    onClick={handleLogin}
                  >
                    Create a Bounty
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-8 py-3 bg-transparent border border-dark-600 hover:border-primary-500 rounded-lg text-dark-100 hover:text-white transition-all duration-300"
                    onClick={handleLogin}
                  >
                    Find Bounties to Solve
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-dark-800 bg-dark-300 overflow-hidden flex items-center justify-center text-dark-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-dark-800 bg-dark-300 overflow-hidden flex items-center justify-center text-dark-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-dark-800 bg-dark-300 overflow-hidden flex items-center justify-center text-dark-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-dark-200">Joined by <span className="text-white font-medium">1,200+</span> developers</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-8">
            <motion.div 
              className="bg-dark-800/60 backdrop-blur-sm border border-dark-700 rounded-xl p-6 shadow-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-500/20 rounded-md flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-accent-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 014.486 6.336l-3.276 3.276a3.004 3.004 0 01-2.25-2.25l3.276-3.276c.236-.236.36-.552.36-.89a1.152 1.152 0 00-1.365-1.137l-.04.007m-5.108.233l-3.85 4.737h.017" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-white">Featured Bounty</h3>
                </div>
                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-xs font-medium">0.25 ETH</span>
              </div>
              
              <h4 className="text-white font-medium mb-2 text-lg">Implement OAuth2 flow for GitHub authentication</h4>
              <p className="text-dark-300 text-sm mb-4">Handle the complete OAuth2 flow for GitHub authentication including token exchange and user profile fetching.</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-dark-700 text-dark-300 px-2 py-1 rounded-md text-xs">React</span>
                <span className="bg-dark-700 text-dark-300 px-2 py-1 rounded-md text-xs">TypeScript</span>
                <span className="bg-dark-700 text-dark-300 px-2 py-1 rounded-md text-xs">OAuth</span>
              </div>
              
              <div className="border-t border-dark-700 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full mr-2 bg-dark-500 flex items-center justify-center text-dark-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <span className="text-dark-200 text-sm">ethDev.eth</span>
                  </div>
                  <div 
                    className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors cursor-pointer"
                    onClick={() => window.location.href = "/bounties/featured"}
                  >
                    View Details →
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <motion.div 
                className="bg-dark-800/60 backdrop-blur-sm border border-dark-700 rounded-xl p-5 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-primary-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                  <h3 className="font-heading font-medium text-white">$42K+</h3>
                </div>
                <p className="text-dark-300 text-sm">Total bounties paid</p>
              </motion.div>
              
              <motion.div 
                className="bg-dark-800/60 backdrop-blur-sm border border-dark-700 rounded-xl p-5 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-accent-400 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <h3 className="font-heading font-medium text-white">350+</h3>
                </div>
                <p className="text-dark-300 text-sm">Completed bounties</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

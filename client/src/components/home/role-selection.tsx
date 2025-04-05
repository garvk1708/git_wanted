import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";

export default function RoleSelection() {
  const { user, login } = useAuthContext();
  
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="bg-accent-500/20 text-accent-400 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Choose Your Path</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">Join GitWanted as</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-dark-800/40 border border-dark-700 rounded-xl p-8 transition-all duration-300 hover:border-primary-500/60 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
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
            <p className="text-dark-300 mb-6">Fund issues in your repository and attract talented developers to solve them. Set bounty amounts, review submissions, and release funds when satisfied.</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-200">Create bounties for GitHub issues</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-200">Fund with ETH or fiat currency</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-200">Review and approve submissions</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-200">Attract skilled developers to your project</span>
              </li>
            </ul>
            
            {user ? (
              <Link href="/creator/dashboard">
                <a className="block w-full py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 text-center shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]">
                  Start as Creator
                </a>
              </Link>
            ) : (
              <button 
                className="w-full py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
                onClick={handleLogin}
              >
                Start as Creator
              </button>
            )}
          </motion.div>
          
          <motion.div 
            className="bg-dark-800/40 border border-dark-700 rounded-xl p-8 transition-all duration-300 hover:border-accent-500/60 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
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
            <p className="text-dark-300 mb-6">Find and claim bounties that match your skills. Submit your solutions, get your work reviewed, and earn rewards in ETH or fiat currency.</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-200">Browse available bounties by technology</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-200">Claim issues that match your expertise</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-200">Submit your work through GitHub</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-dark-200">Get paid in ETH or fiat after approval</span>
              </li>
            </ul>
            
            {user ? (
              <Link href="/solver/dashboard">
                <a className="block w-full py-3 bg-accent-600 hover:bg-accent-500 rounded-lg text-white font-medium transition-all duration-300 text-center shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]">
                  Start as Solver
                </a>
              </Link>
            ) : (
              <button 
                className="w-full py-3 bg-accent-600 hover:bg-accent-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]"
                onClick={handleLogin}
              >
                Start as Solver
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";

export default function Configuration() {
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="bg-accent-500/20 text-accent-400 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Configuration</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">Easy Environment Setup</h2>
            <p className="text-dark-200 mb-8">GitWanted makes it simple to configure your connection to GitHub, Ethereum, and other services with a straightforward environment variable system.</p>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="mr-4 bg-accent-500/20 rounded-lg p-2 h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-accent-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-heading">GitHub Authentication</h3>
                  <p className="text-dark-300">Configure GitHub OAuth credentials to enable seamless authentication for your users.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 bg-accent-500/20 rounded-lg p-2 h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-accent-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-heading">Ethereum Integration</h3>
                  <p className="text-dark-300">Connect to Ethereum networks with your Infura API key and specify desired network (mainnet or testnet).</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 bg-accent-500/20 rounded-lg p-2 h-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-accent-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-heading">Payment Processing</h3>
                  <p className="text-dark-300">Set up Stripe API keys to enable fiat currency payments alongside cryptocurrency transactions.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-dark-800/30 border border-dark-700 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-dark-800 border-b border-dark-700">
                <div className="w-3 h-3 rounded-full bg-dark-500"></div>
                <div className="w-3 h-3 rounded-full bg-dark-500"></div>
                <div className="w-3 h-3 rounded-full bg-dark-500"></div>
                <span className="ml-2 text-dark-300 text-sm">.env</span>
              </div>
              <div className="p-6 relative font-mono text-sm">
                <pre className="text-dark-200">
<span className="text-primary-400"># Database</span>
DATABASE_URL=postgresql://username:password@localhost:5432/gitwanted

<span className="text-primary-400"># GitHub OAuth</span>
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://your-domain.com/api/auth/github/callback

<span className="text-primary-400"># Ethereum/Infura</span>
INFURA_API_KEY=your_infura_api_key
ETHEREUM_NETWORK=sepolia

<span className="text-primary-400"># Stripe (optional)</span>
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key</pre>
                {!isCodeVisible && (
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-dark-900/80"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button 
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300"
                      onClick={() => setIsCodeVisible(true)}
                    >
                      Show Configuration
                    </button>
                  </motion.div>
                )}
              </div>
              
              <div className="flex justify-between items-center border-t border-dark-700 py-3 px-6 bg-dark-800/50">
                <div className="text-dark-300 text-sm">Set up your environment variables</div>
                <button 
                  className="px-3 py-1.5 bg-primary-600/20 text-primary-400 rounded-md text-sm hover:bg-primary-600/30 transition-colors"
                  onClick={() => {
                    const envText = `# Database
DATABASE_URL=postgresql://username:password@localhost:5432/gitwanted

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://your-domain.com/api/auth/github/callback

# Ethereum/Infura
INFURA_API_KEY=your_infura_api_key
ETHEREUM_NETWORK=sepolia

# Stripe (optional)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key`;
                    
                    navigator.clipboard.writeText(envText);
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

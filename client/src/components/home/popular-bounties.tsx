import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BountyWithDetails } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function PopularBounties() {
  const { data: bounties, isLoading, error } = useQuery<BountyWithDetails[]>({
    queryKey: ['/api/bounties?limit=3&status=open'],
  });

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

  return (
    <section className="py-16 px-4 bg-dark-900/50 relative overflow-hidden">
      <div className="absolute top-40 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <span className="bg-primary-500/20 text-primary-400 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Explore</span>
            <h2 className="text-3xl font-bold text-white font-heading">Popular Bounties</h2>
          </div>
          <div 
            className="hidden md:flex items-center text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
            onClick={() => {
              window.location.href = "/bounties";
            }}
          >
            <span>View All Bounties</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-dark-800/30 border border-dark-700 rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start">
                      <Skeleton className="h-10 w-10 rounded-md mr-3" />
                      <div>
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-5" />
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-12 rounded-md" />
                  </div>
                </div>
                
                <div className="border-t border-dark-700 bg-dark-800/50 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Skeleton className="w-6 h-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-dark-800/30 border border-dark-700 rounded-xl">
            <p className="text-red-400">Failed to load bounties. Please try again later.</p>
          </div>
        ) : bounties && bounties.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {bounties.map((bounty) => (
              <motion.div 
                key={bounty.id} 
                className="bg-dark-800/30 border border-dark-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary-500/50 hover:translate-y-[-5px]"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <div className="w-10 h-10 bg-dark-700 rounded-md flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">{bounty.title}</h3>
                        <p className="text-dark-400 text-sm">
                          {bounty.repository ? bounty.repository.full_name : 'External Repository'}
                        </p>
                      </div>
                    </div>
                    <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-xs font-medium">
                      {bounty.amount} {bounty.currency}
                    </span>
                  </div>
                  
                  <p className="text-dark-300 text-sm mb-5">
                    {bounty.description.length > 100 
                      ? `${bounty.description.substring(0, 100)}...` 
                      : bounty.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bounty.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="bg-dark-700 text-dark-300 px-2 py-1 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-dark-700 bg-dark-800/50 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {bounty.creator.avatarUrl ? (
                        <img 
                          className="w-6 h-6 rounded-full mr-2" 
                          src={bounty.creator.avatarUrl} 
                          alt={bounty.creator.username}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full mr-2 bg-dark-500 flex items-center justify-center text-dark-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-dark-300 text-sm">{bounty.creator.username}</span>
                    </div>
                    <div 
                      className="text-primary-400 hover:text-primary-300 text-sm transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/bounties/${bounty.id}`;
                      }}
                    >
                      View Bounty →
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center p-8 bg-dark-800/30 border border-dark-700 rounded-xl">
            <p className="text-dark-300">No bounties available at the moment. Check back later!</p>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <div 
            className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = "/bounties";
            }}
          >
            <span>View All Bounties</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BountyWithDetails } from "@shared/types";
import { useAuthContext } from "@/contexts/auth-context";

export default function BountiesIndex() {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: bounties, isLoading, error } = useQuery<BountyWithDetails[]>({
    queryKey: [
      `/api/bounties${statusFilter ? `?status=${statusFilter}` : ''}`,
    ],
  });

  const filteredBounties = bounties?.filter(bounty => 
    bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bounty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bounty.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900">
      <Header />
      
      <motion.section 
        className="container mx-auto max-w-6xl px-4 pt-32 pb-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
            Explore Bounties
          </h1>
          <p className="text-dark-200 text-lg mb-8">
            Find and claim open source issues with cryptocurrency rewards. Filter by status or search for specific technologies.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-dark-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <Input 
              placeholder="Search by title, description or technology..." 
              className="w-full pl-10 py-2 bg-dark-800 border-dark-700 focus:border-primary-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === null 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
              onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            <Button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === 'open' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
              onClick={() => setStatusFilter('open')}
            >
              Open
            </Button>
            <Button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === 'claimed' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
              onClick={() => setStatusFilter('claimed')}
            >
              Claimed
            </Button>
            <Button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === 'completed' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              }`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </motion.div>

        {user && (
          <motion.div variants={itemVariants} className="mb-10">
            <Link href="/creator/dashboard">
              <a className="block w-full md:w-auto md:inline-block px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 text-center shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]">
                Create New Bounty
              </a>
            </Link>
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <motion.div variants={itemVariants} className="text-center p-8 bg-dark-800/30 border border-dark-700 rounded-xl">
            <p className="text-red-400">Failed to load bounties. Please try again later.</p>
          </motion.div>
        ) : filteredBounties && filteredBounties.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {filteredBounties.map((bounty) => (
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
                          {bounty.status === 'open' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                            </svg>
                          )}
                          {bounty.status === 'claimed' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-yellow-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                            </svg>
                          )}
                          {bounty.status === 'completed' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
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
                    {bounty.description.length > 120 
                      ? `${bounty.description.substring(0, 120)}...` 
                      : bounty.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bounty.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="bg-dark-700 text-dark-300 px-2 py-1 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                    {bounty.tags.length > 3 && (
                      <span className="bg-dark-700 text-dark-300 px-2 py-1 rounded-md text-xs">
                        +{bounty.tags.length - 3} more
                      </span>
                    )}
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
                    <Link href={`/bounties/${bounty.id}`}>
                      <a className="text-primary-400 hover:text-primary-300 text-sm transition-colors">View Details →</a>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center p-8 bg-dark-800/30 border border-dark-700 rounded-xl">
            <p className="text-dark-300">
              {bounties?.length === 0 
                ? "No bounties available at the moment. Check back later!" 
                : "No bounties match your search. Try different keywords."}
            </p>
          </motion.div>
        )}

        {/* Pagination - can be implemented as needed */}
      </motion.section>
      
      <Footer />
    </div>
  );
}

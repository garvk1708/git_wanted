import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BountyWithDetails } from "@shared/types";
import { useAuthContext } from "@/contexts/auth-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { Link } from "wouter";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Flame, 
  Shield, 
  CheckCircle2, 
  Gift, 
  Users 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Sample activity data for the chart
const activityData = [
  { day: "Mon", activity: 12 },
  { day: "Tue", activity: 18 },
  { day: "Wed", activity: 15 },
  { day: "Thu", activity: 25 },
  { day: "Fri", activity: 35 },
  { day: "Sat", activity: 30 },
  { day: "Sun", activity: 28 },
  { day: "Mon", activity: 32 },
  { day: "Tue", activity: 37 },
  { day: "Wed", activity: 32 },
  { day: "Thu", activity: 40 },
  { day: "Fri", activity: 35 },
  { day: "Sat", activity: 42 },
  { day: "Sun", activity: 38 },
];

// Sample open bounties
const sampleOpenBounties = [
  {
    id: 1,
    repository: "facebook/react",
    title: "Fix memory leak in useEffect hook",
    amount: 0.2,
    currency: "ETH",
    daysLeft: 4
  },
  {
    id: 2,
    repository: "vercel/next.js",
    title: "Improve SSR performance",
    amount: 16000,
    currency: "INR",
    daysLeft: 7
  },
  {
    id: 3,
    repository: "ethereum/solidity",
    title: "Add new optimization for gas reduction",
    amount: 0.5,
    currency: "ETH",
    daysLeft: 2
  }
];

export default function SolverDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuthContext();
  const { address, connectWallet } = useEthereum();

  // Get solver's claimed bounties
  const { data: bounties, isLoading, error } = useQuery<BountyWithDetails[]>({
    queryKey: ['/api/user/bounties?role=solver'],
  });

  // Get user reputation
  const { data: reputation } = useQuery<{
    points: number;
    completedBounties: number;
    level: number;
    rank: string;
    skills: { name: string; level: number }[];
  }>({
    queryKey: [`/api/users/${user?.id}/reputation`],
    // When actual API isn't ready, use placeholder data
    placeholderData: {
      points: 425,
      completedBounties: 8,
      level: 3,
      rank: "Rising Star",
      skills: [
        { name: "React", level: 85 },
        { name: "Node.js", level: 75 },
        { name: "Solidity", level: 60 },
        { name: "TypeScript", level: 90 }
      ]
    }
  });

  // If not authenticated, redirect to home
  if (!user) {
    setLocation("/");
    return null;
  }

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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">Solver Dashboard</h1>
          <p className="text-dark-200 text-lg mb-8">Find, claim, and solve bounties to earn cryptocurrency rewards.</p>
        </motion.div>

        {!address && (
          <motion.div 
            className="bg-dark-800/30 border border-dark-700 rounded-xl p-6 mb-8"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-heading">Connect Your Ethereum Wallet</h3>
                <p className="text-dark-300">Connect your wallet to receive bounty payments directly to your Ethereum address.</p>
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

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
          <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-dark-300 mb-1">Reputation Score</h3>
                <p className="text-3xl font-bold text-white font-heading">
                  {reputation ? reputation.points : <Skeleton className="h-9 w-16" />}
                </p>
                {reputation && (
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-primary-400">
                      Level {reputation.level} • {reputation.rank}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </div>
          <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-dark-300 mb-1">Completed Bounties</h3>
                <p className="text-3xl font-bold text-white font-heading">
                  {reputation ? reputation.completedBounties : <Skeleton className="h-9 w-16" />}
                </p>
                <span className="text-sm text-green-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> +3 this month
                </span>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-dark-300 mb-1">Active Claims</h3>
                <p className="text-3xl font-bold text-white font-heading">
                  {!isLoading && bounties 
                    ? bounties.filter(b => b.status === 'claimed').length || 2
                    : <Skeleton className="h-9 w-16" />
                  }
                </p>
                <span className="text-sm text-yellow-400 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" /> 3 days avg completion time
                </span>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Reputation System */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white font-heading">Activity Overview</h3>
              <span className="text-sm text-dark-300">Last 30 days</span>
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    stroke="#4B5563" 
                    strokeWidth={0.5}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#4B5563" 
                    strokeWidth={0.5}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickCount={5}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151',
                      borderRadius: '0.5rem',
                      color: '#E5E7EB'
                    }}
                    labelStyle={{ color: '#D1D5DB' }}
                    itemStyle={{ color: '#A5B4FC' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="activity" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#activityGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white font-heading">Skills</h3>
              <Shield className="h-5 w-5 text-primary-400" />
            </div>
            
            {reputation?.skills ? (
              <div className="space-y-4">
                {reputation.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-dark-200">{skill.name}</span>
                      <span className="text-xs text-primary-400">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2 bg-dark-700">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </Progress>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-dark-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-dark-300">Next skill assessment:</span>
                <span className="text-primary-400">3 days</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Open Bounties */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white font-heading">Open Bounties</h3>
            <span className="text-sm text-primary-400 cursor-pointer">View all</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleOpenBounties.map((bounty) => (
              <div 
                key={bounty.id}
                className="bg-dark-800/30 border border-dark-700 rounded-xl p-4 transition-all hover:border-primary-500/50"
              >
                <div className="flex items-center mb-2">
                  <span className="text-xs bg-dark-700/50 text-dark-300 px-2 py-1 rounded">
                    {bounty.repository}
                  </span>
                </div>
                <h4 className="text-white font-medium mb-3">{bounty.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-400">{bounty.amount} {bounty.currency}</span>
                  <span className="text-xs text-yellow-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {bounty.daysLeft} days left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-8">
          <Button 
            className="px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
            onClick={() => setLocation("/bounties")}
          >
            Find New Bounties
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4 font-heading">Your Bounties</h2>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-dark-800/50 border border-dark-700 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="claimed" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
                In Progress
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
                Completed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderBountyList(bounties, isLoading, error)}
            </TabsContent>
            <TabsContent value="claimed">
              {renderBountyList(
                bounties?.filter(b => b.status === 'claimed'), 
                isLoading, 
                error
              )}
            </TabsContent>
            <TabsContent value="completed">
              {renderBountyList(
                bounties?.filter(b => b.status === 'completed'), 
                isLoading, 
                error
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.section>
      
      <Footer />
    </div>
  );
}

function renderBountyList(bounties?: BountyWithDetails[], isLoading?: boolean, error?: unknown) {
  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-dark-800/40 border border-dark-700 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-6 p-6 bg-dark-800/40 border border-dark-700 rounded-xl text-center">
        <p className="text-red-400">Failed to load bounties. Please try again later.</p>
      </div>
    );
  }
  
  if (!bounties || bounties.length === 0) {
    return (
      <div className="mt-6 p-6 bg-dark-800/40 border border-dark-700 rounded-xl text-center">
        <p className="text-dark-300">No bounties found. Find and claim your first bounty!</p>
        <Button 
          className="mt-4 px-5 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium"
          onClick={() => window.location.href = "/bounties"}
        >
          Browse Bounties
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-6 space-y-4">
      {bounties.map((bounty) => (
        <div 
          key={bounty.id} 
          className="bg-dark-800/40 border border-dark-700 rounded-xl p-6 transition-all duration-300 hover:border-primary-500/50"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-medium text-white mb-1">{bounty.title}</h3>
              <p className="text-dark-400 text-sm">
                {bounty.repository ? bounty.repository.full_name : 'External Repository'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                bounty.status === 'claimed' 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {bounty.status === 'claimed' ? 'In Progress' : 'Completed'}
              </span>
              <span className="bg-dark-700 text-dark-300 px-3 py-1 rounded-full text-xs">
                {bounty.amount} {bounty.currency}
              </span>
            </div>
          </div>
          
          <p className="text-dark-300 text-sm mb-4 line-clamp-2">{bounty.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
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
            <div 
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors cursor-pointer"
              onClick={() => window.location.href = `/bounties/${bounty.id}`}
            >
              View Details →
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

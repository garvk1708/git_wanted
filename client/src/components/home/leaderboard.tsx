import { motion } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Award, TrendingUp } from "lucide-react";

// Sample leaderboard data
const topSolvers = [
  { 
    id: 1, 
    username: "web3_wizard", 
    avatarUrl: "https://github.com/identicons/app/favicon.png", 
    reputation: 1250, 
    bounties: 23, 
    earnings: 5.2,
    streak: 7,
    specialty: "Smart Contracts"
  },
  { 
    id: 2, 
    username: "devguru42", 
    avatarUrl: "https://github.com/identicons/app/favicon.png", 
    reputation: 980, 
    bounties: 19, 
    earnings: 4.1,
    streak: 4,
    specialty: "Frontend"
  },
  { 
    id: 3, 
    username: "cryptoNinja", 
    avatarUrl: "https://github.com/identicons/app/favicon.png", 
    reputation: 875, 
    bounties: 15, 
    earnings: 3.6,
    streak: 2,
    specialty: "Security"
  },
  { 
    id: 4, 
    username: "codeBeast", 
    avatarUrl: "https://github.com/identicons/app/favicon.png", 
    reputation: 760, 
    bounties: 14, 
    earnings: 3.2,
    streak: 3,
    specialty: "Backend"
  },
  { 
    id: 5, 
    username: "eth_explorer", 
    avatarUrl: "https://github.com/identicons/app/favicon.png", 
    reputation: 650, 
    bounties: 11, 
    earnings: 2.8,
    streak: 0,
    specialty: "dApps"
  }
];

export default function Leaderboard() {
  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)]"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center mb-4"
          >
            <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
            <h2 className="text-3xl font-bold font-heading text-white">Developer Leaderboard</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-dark-200 max-w-2xl mx-auto"
          >
            Top problem solvers earning rewards and building their reputation in the GitWanted ecosystem
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-dark-800/80 backdrop-blur-sm border border-dark-700 rounded-xl overflow-hidden shadow-xl"
        >
          <Table>
            <TableCaption className="text-dark-300">
              Monthly rankings based on completed bounties and reputation
            </TableCaption>
            <TableHeader>
              <TableRow className="border-dark-700 hover:bg-dark-700/50">
                <TableHead className="text-dark-100 w-12 text-center">Rank</TableHead>
                <TableHead className="text-dark-100">Developer</TableHead>
                <TableHead className="text-dark-100 text-center">Reputation</TableHead>
                <TableHead className="text-dark-100 text-center">Bounties</TableHead>
                <TableHead className="text-dark-100 text-center">ETH Earned</TableHead>
                <TableHead className="text-dark-100 text-center">Specialty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSolvers.map((solver, index) => (
                <TableRow key={solver.id} className="border-dark-700 hover:bg-dark-700/50">
                  <TableCell className="font-medium text-center">
                    {index === 0 ? (
                      <div className="bg-yellow-500/20 text-yellow-400 font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                        1
                      </div>
                    ) : index === 1 ? (
                      <div className="bg-zinc-400/20 text-zinc-300 font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                        2
                      </div>
                    ) : index === 2 ? (
                      <div className="bg-amber-700/20 text-amber-600 font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                        3
                      </div>
                    ) : (
                      <div className="text-dark-300 font-bold w-8 h-8 flex items-center justify-center mx-auto">
                        {index + 1}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="rounded-full h-10 w-10 overflow-hidden mr-3 border border-dark-700">
                        <img src={solver.avatarUrl} alt={solver.username} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{solver.username}</div>
                        <div className="flex items-center mt-1">
                          {solver.streak > 0 && (
                            <div className="flex items-center text-xs text-orange-400 mr-2">
                              <Flame className="h-3 w-3 mr-1" />
                              <span>{solver.streak} day streak</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-primary-400 font-medium">{solver.reputation}</span>
                      <div className="flex items-center text-xs text-primary-500 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+{Math.floor(Math.random() * 50 + 10)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-dark-100">{solver.bounties}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-green-400 font-medium">{solver.earnings} ETH</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="border-dark-600 text-dark-200">
                      {solver.specialty}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-dark-300 text-sm">
            Top solvers are featured on our homepage and receive priority access to premium bounties
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Award className="h-5 w-5 text-primary-500" />
            <span className="text-dark-200 text-sm">Leaderboard updates daily based on activity</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import RoleSelection from "@/components/home/role-selection";
import PopularBounties from "@/components/home/popular-bounties";
import Leaderboard from "@/components/home/leaderboard";
import CTA from "@/components/home/cta";

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <Hero />
      <Features />
      <RoleSelection />
      <PopularBounties />
      <Leaderboard />
      <CTA />
      <Footer />
    </motion.div>
  );
}

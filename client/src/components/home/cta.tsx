import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/auth-context";
import { Link } from "wouter";

export default function CTA() {
  const { user, login } = useAuthContext();
  
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(99,102,241,0.15),transparent_50%)]"></div>
      
      <motion.div 
        className="container mx-auto max-w-6xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-8 md:p-12 lg:p-16 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center">
            <span className="bg-primary-500/20 text-primary-400 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Get Started Today</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-heading">
              Ready to revolutionize open source funding?
            </h2>
            <p className="text-lg text-dark-200 mb-10">
              Join GitWanted today and become part of a community that values and rewards open source contributions. Whether you're a project maintainer or developer, there's a place for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button className="px-8 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/bounties">
                    <Button variant="outline" className="px-8 py-3 bg-transparent border border-dark-600 hover:border-primary-500 rounded-lg text-dark-100 hover:text-white transition-all duration-300">
                      Explore Bounties
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button 
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
                    onClick={handleLogin}
                  >
                    Sign In with GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-8 py-3 bg-transparent border border-dark-600 hover:border-primary-500 rounded-lg text-dark-100 hover:text-white transition-all duration-300"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

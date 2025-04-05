import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "../ui/button";
import { useAuthContext } from "@/contexts/auth-context";
import { useEthereum } from "@/contexts/ethereum-context";
import MobileMenu from "./mobile-menu";
import { motion } from "framer-motion";

export default function Header() {
  const [, setLocation] = useLocation();
  const { user, login, logout } = useAuthContext();
  const { connectWallet, address, disconnectWallet } = useEthereum();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = async () => {
    try {
      console.log("Login button clicked");
      await login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/", id: "home" },
    { name: "Discover", path: user ? "/bounties" : "/", id: "discover" },
    { name: "How It Works", path: "/#features", id: "features" },
    { name: "Docs", path: "/#documentation", id: "docs" },
  ];

  return (
    <header className="border-b border-dark-700 backdrop-blur-md bg-dark-900/70 fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => setLocation("/")}
        >
          <motion.div 
            className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-white font-heading">Git<span className="text-primary-500">Wanted</span></h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="nav-item text-dark-100 hover:text-white transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary-500 after:bottom-[-4px] after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
              onClick={() => setLocation(item.path)}
            >
              {item.name}
            </div>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              {address ? (
                <Button 
                  variant="outline" 
                  className="hidden md:block px-4 py-2 border border-dark-600 rounded-lg hover:border-primary-500 text-dark-100 hover:text-white transition-all duration-300"
                  onClick={disconnectWallet}
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="hidden md:block px-4 py-2 border border-dark-600 rounded-lg hover:border-primary-500 text-dark-100 hover:text-white transition-all duration-300"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </Button>
              )}
              <Button 
                className="flex items-center px-5 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
                onClick={handleLogin}
              >
                <span>Sign In with GitHub</span>
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </Button>
            </>
          ) : (
            <>
              {address ? (
                <Button 
                  variant="outline" 
                  className="hidden md:block px-4 py-2 border border-dark-600 rounded-lg hover:border-primary-500 text-dark-100 hover:text-white transition-all duration-300"
                  onClick={disconnectWallet}
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="hidden md:block px-4 py-2 border border-dark-600 rounded-lg hover:border-primary-500 text-dark-100 hover:text-white transition-all duration-300"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </Button>
              )}
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setLocation("/dashboard")}
              >
                <div className="rounded-full h-8 w-8 overflow-hidden">
                  <img 
                    src={user.avatarUrl || "https://github.com/identicons/app/favicon.png"} 
                    alt={user.username} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="hidden md:block text-sm text-dark-100">Dashboard</span>
              </div>
              <Button 
                variant="ghost" 
                className="text-dark-300 hover:text-white hidden md:block"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-dark-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </Button>
        </div>
      </div>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        address={address}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
      />
    </header>
  );
}

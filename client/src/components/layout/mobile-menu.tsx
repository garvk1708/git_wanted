import { Button } from "../ui/button";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { AuthUser } from "@shared/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ name: string; path: string; id: string }>;
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
  address: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  navItems,
  user,
  onLogin,
  onLogout,
  address,
  onConnectWallet,
  onDisconnectWallet
}: MobileMenuProps) {
  const [, setLocation] = useLocation();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="fixed top-0 right-0 w-full max-w-xs h-full bg-dark-800 p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end mb-8">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            
            {user && (
              <div className="mb-6 pb-6 border-b border-dark-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full h-10 w-10 overflow-hidden">
                    <img 
                      src={user.avatarUrl || "https://github.com/identicons/app/favicon.png"} 
                      alt={user.username} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">{user.name || user.username}</div>
                    <div className="text-sm text-dark-300">@{user.username}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className="text-sm text-center py-2 px-3 rounded bg-dark-700 text-white hover:bg-dark-600 transition-colors cursor-pointer"
                    onClick={() => {
                      setLocation("/dashboard");
                      onClose();
                    }}
                  >
                    Dashboard
                  </div>
                  <button 
                    className="text-sm text-center py-2 px-3 rounded bg-dark-700 text-white hover:bg-dark-600 transition-colors"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            
            <nav className="space-y-6">
              {navItems.map(item => (
                <div 
                  key={item.id}
                  className="block text-dark-100 hover:text-white py-2 transition-colors cursor-pointer"
                  onClick={() => {
                    setLocation(item.path);
                    onClose();
                  }}
                >
                  {item.name}
                </div>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-dark-700 space-y-4">
              {!user && (
                <Button 
                  className="w-full py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300"
                  onClick={() => {
                    onLogin();
                    onClose();
                  }}
                >
                  Sign In with GitHub
                </Button>
              )}
              
              {address ? (
                <Button 
                  variant="outline"
                  className="w-full py-2 border border-dark-600 rounded-lg hover:border-primary-500 text-dark-100 hover:text-white transition-all duration-300"
                  onClick={() => {
                    onDisconnectWallet();
                    onClose();
                  }}
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full py-2 border border-dark-600 rounded-lg hover:border-primary-500 text-dark-100 hover:text-white transition-all duration-300"
                  onClick={() => {
                    onConnectWallet();
                    onClose();
                  }}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

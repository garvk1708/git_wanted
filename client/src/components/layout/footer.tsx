import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 pt-12 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Git<span className="text-primary-500">Wanted</span></h3>
            </div>
            <p className="text-dark-300 mb-4">Blockchain-Powered Bounty Platform for GitHub Issues</p>
            <div className="flex space-x-4">
              <div onClick={() => window.open("https://github.com", "_blank")} className="text-dark-400 hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div onClick={() => window.open("https://twitter.com", "_blank")} className="text-dark-400 hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </div>
              <div onClick={() => window.open("https://linkedin.com", "_blank")} className="text-dark-400 hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-2-8a1 1 0 112-0 1 1 0 01-2 0zm8 8h-2v-2.5c0-.833-.17-1.5-1-1.5-.547 0-1 .31-1 1l.003 3H11V9h2v1c.53-.97 1.59-1 2.5-1 1.11 0 2.5.67 2.5 3v3z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4 font-heading">Platform</h4>
              <ul className="space-y-2">
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">How it Works</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Pricing</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Features</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Creators</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Solvers</div></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 font-heading">Resources</h4>
              <ul className="space-y-2">
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Documentation</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">API Reference</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Smart Contracts</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">GitHub</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Developer Portal</div></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 font-heading">Company</h4>
              <ul className="space-y-2">
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">About</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Blog</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Careers</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Privacy Policy</div></li>
                <li><div className="text-dark-300 hover:text-white transition-colors cursor-pointer">Terms of Service</div></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-dark-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-dark-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} GitWanted. All rights reserved.</p>
          <div className="flex space-x-6">
            <div className="text-dark-400 hover:text-white text-sm transition-colors cursor-pointer">Privacy Policy</div>
            <div className="text-dark-400 hover:text-white text-sm transition-colors cursor-pointer">Terms of Service</div>
            <div className="text-dark-400 hover:text-white text-sm transition-colors cursor-pointer">Cookies</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

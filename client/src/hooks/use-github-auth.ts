import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useGithubAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Get GitHub auth URL - direct to GitHub instead of going through the backend
  const getAuthUrl = async () => {
    setIsLoading(true);
    
    try {
      // Use hardcoded values for direct GitHub login
      // This bypasses our backend for auth URL generation to eliminate potential issues
      const clientId = "Ov23liFLewafbNVgTBco";
      const redirectUri = "http://127.0.0.1:3000/api/auth/github/callback";
      const scope = "user:email,read:user,read:org,repo";
      
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
      
      console.log("Using direct GitHub auth URL:", authUrl);
      
      return { authUrl };
    } catch (error) {
      console.error("Error preparing GitHub auth URL:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to start GitHub authentication process.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle GitHub OAuth callback
  const handleAuthCallback = useCallback(async (code: string) => {
    setIsLoading(true);
    
    try {
      console.log("Handling GitHub callback with code present");
      
      // Clear any existing tokens
      document.cookie = "github_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // The GitHub callback is handled by the backend with cookies,
      // so we don't need to make an API request here.
      // We just need to clear the OAuth code from the URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("code");
      currentUrl.searchParams.delete("state");
      window.history.replaceState({}, document.title, currentUrl.pathname);
      
      return true;
    } catch (error) {
      console.error("Error handling GitHub callback:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to complete GitHub authentication.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  return {
    isLoading,
    getAuthUrl,
    handleAuthCallback,
  };
}

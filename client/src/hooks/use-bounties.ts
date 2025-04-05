import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BountyWithDetails } from "@shared/types";
import { useToast } from "./use-toast";

/**
 * Hook for fetching bounties with various filters
 */
export function useBounties(options: {
  status?: string;
  limit?: number;
  offset?: number;
  search?: string;
} = {}) {
  return useQuery<BountyWithDetails[]>({
    queryKey: [
      `/api/bounties${buildQueryString(options)}`,
    ],
  });
}

/**
 * Hook for fetching a single bounty by ID
 */
export function useBounty(id: string | number) {
  return useQuery<BountyWithDetails>({
    queryKey: [`/api/bounties/${id}`],
    enabled: !!id,
  });
}

/**
 * Hook for fetching user's bounties based on role
 */
export function useUserBounties(role: "creator" | "solver") {
  return useQuery<BountyWithDetails[]>({
    queryKey: [`/api/user/bounties?role=${role}`],
  });
}

/**
 * Hook for claiming a bounty
 */
export function useClaimBounty() {
  const { toast } = useToast();

  const claimBounty = async (id: number | string) => {
    try {
      await apiRequest("PATCH", `/api/bounties/${id}/claim`, {});
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/bounties/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/bounties'] });
      
      toast({
        title: "Bounty claimed successfully!",
        description: "You can now start working on this issue.",
        variant: "success",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to claim bounty",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return { claimBounty };
}

/**
 * Hook for completing a bounty
 */
export function useCompleteBounty() {
  const { toast } = useToast();

  const completeBounty = async (id: number | string, transactionHash: string) => {
    try {
      if (!transactionHash) {
        toast({
          title: "Transaction hash required",
          description: "Please provide the transaction hash to complete the bounty.",
          variant: "destructive",
        });
        return false;
      }
      
      await apiRequest("PATCH", `/api/bounties/${id}/complete`, { transactionHash });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/bounties/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/bounties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      
      toast({
        title: "Bounty completed successfully!",
        description: "The payment has been verified and the bounty is now marked as completed.",
        variant: "success",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to complete bounty",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return { completeBounty };
}

/**
 * Hook for creating a new bounty
 */
export function useCreateBounty() {
  const { toast } = useToast();

  const createBounty = async (data: {
    title: string;
    description: string;
    amount: number;
    currency: string;
    issueUrl: string;
    tags?: string[];
  }) => {
    try {
      const response = await apiRequest("POST", "/api/bounties", data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/bounties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/bounties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      
      toast({
        title: "Bounty created successfully!",
        variant: "success",
      });
      
      return await response.json();
    } catch (error) {
      toast({
        title: "Error creating bounty",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { createBounty };
}

// Helper function to build query string from options
function buildQueryString(options: {
  status?: string;
  limit?: number;
  offset?: number;
  search?: string;
}): string {
  const params = new URLSearchParams();
  
  if (options.status) params.append('status', options.status);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());
  if (options.search) params.append('search', options.search);
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

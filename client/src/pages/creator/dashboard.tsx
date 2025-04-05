import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BountyWithDetails, GitHubRepositoryResponse, GitHubIssueResponse } from "@shared/types";
import { useAuthContext } from "@/contexts/auth-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AlertTriangle, Check, GitFork, GitPullRequest, Github, Loader2 } from "lucide-react";

interface CreateBountyForm {
  title: string;
  description: string;
  amount: string;
  currency: string;
  issueUrl: string;
  tags: string;
  repositoryId?: string;
  issueId?: string;
}

export default function CreatorDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuthContext();
  const { address, connectWallet } = useEthereum();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateBountyForm>({
    title: "",
    description: "",
    amount: "",
    currency: "ETH",
    issueUrl: "",
    tags: "",
    repositoryId: "",
    issueId: ""
  });

  // For GitHub repository and issue selection
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [isGitHubSelectorOpen, setIsGitHubSelectorOpen] = useState(false);

  // Get user's GitHub repositories
  const { 
    data: repositories, 
    isLoading: isReposLoading,
    error: reposError
  } = useQuery<GitHubRepositoryResponse[]>({
    queryKey: ['/api/repositories'],
    queryFn: async () => {
      console.log('Fetching GitHub repositories');
      const res = await fetch('/api/repositories');

      if (!res.ok) {
        console.error("Failed to fetch repositories:", res.status, res.statusText);
        const errorText = await res.text();
        console.error("Error details:", errorText);
        throw new Error(`Failed to fetch GitHub repositories: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log(`Successfully fetched ${data.length} repositories`);
      return data;
    },
    enabled: isGitHubSelectorOpen, // Only fetch when selector is open
  });

  // Get issues for selected repository
  const { 
    data: issues, 
    isLoading: isIssuesLoading,
    error: issuesError
  } = useQuery<GitHubIssueResponse[]>({
    queryKey: ['/api/repositories', selectedRepoId, 'issues'],
    queryFn: async ({ queryKey }) => {
      if (!selectedRepoId) return [];
      const repo = repositories?.find(r => r.id.toString() === selectedRepoId);

      // Validate repository data
      if (!repo) {
        throw new Error('Repository not found');
      }

      if (!repo.fullName && !repo.full_name) {
        console.error('Repository data:', repo);
        throw new Error('Repository is missing name property');
      }

      const repoFullName = repo.fullName || repo.full_name;
      const parts = repoFullName.split('/');
      if (parts.length !== 2) {
        console.error('Invalid repository name format:', repoFullName);
        throw new Error(`Invalid repository name format: ${repoFullName}`);
      }
      const [owner, repoName] = parts;
      console.log(`Fetching issues for ${owner}/${repoName}`);

      try {
        const res = await fetch(`/api/repositories/${owner}/${repoName}/issues`);

        if (!res.ok) {
          console.error("Failed to fetch issues:", res.status, res.statusText);
          const errorText = await res.text();
          console.error("Error details:", errorText);
          throw new Error(`Failed to fetch repository issues: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log(`Successfully fetched ${data.length} issues for ${owner}/${repoName}`);
        return data;
      } catch (error) {
        console.error("Error fetching issues:", error);
        throw error;
      }
    },
    enabled: !!selectedRepoId && isGitHubSelectorOpen && !!repositories, // Only fetch when a repo is selected
  });

  // Get creator's bounties
  const { data: bounties, isLoading, error } = useQuery<BountyWithDetails[]>({
    queryKey: ['/api/user/bounties?role=creator'],
  });

  // Get dashboard stats
  const { data: stats } = useQuery<{
    totalBounties: number;
    totalPaidOut: number;
    activeBounties: number;
    completedBounties: number;
  }>({
    queryKey: ['/api/stats'],
  });

  // Create bounty mutation
  const createBountyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/bounties", data);
    },
    onSuccess: () => {
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        amount: "",
        currency: "ETH",
        issueUrl: "",
        tags: "",
        repositoryId: "",
        issueId: ""
      });
      setSelectedRepoId("");
      queryClient.invalidateQueries({ queryKey: ['/api/user/bounties'] });
      toast({
        title: "Bounty created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating bounty",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleCreateBounty = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a bounty.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.amount || !formData.issueUrl) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);

    createBountyMutation.mutate({
      title: formData.title,
      description: formData.description,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      issueUrl: formData.issueUrl,
      tags: tagsArray,
      repositoryId: formData.repositoryId,
      issueId: formData.issueId
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">Creator Dashboard</h1>
            <p className="text-dark-200 text-lg">Manage your bounties and track your open source funding.</p>
          </div>

          <Button 
            className="px-5 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.8)]"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Bounty
          </Button>
        </motion.div>

        {!address && (
          <motion.div 
            className="bg-dark-800/30 border border-dark-700 rounded-xl p-6 mb-8"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-heading">Connect Your Ethereum Wallet</h3>
                <p className="text-dark-300">Connect your wallet to fund bounties through Ethereum transactions.</p>
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

        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10" variants={itemVariants}>
          <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <h3 className="text-lg font-medium text-dark-300 mb-1">Total Bounties</h3>
            <p className="text-3xl font-bold text-white font-heading">
              {stats ? stats.totalBounties : <Skeleton className="h-9 w-16" />}
            </p>
          </div>
          <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <h3 className="text-lg font-medium text-dark-300 mb-1">Active Bounties</h3>
            <p className="text-3xl font-bold text-white font-heading">
              {stats ? stats.activeBounties : <Skeleton className="h-9 w-16" />}
            </p>
          </div>
          <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <h3 className="text-lg font-medium text-dark-300 mb-1">Completed</h3>
            <p className="text-3xl font-bold text-white font-heading">
              {stats ? stats.completedBounties : <Skeleton className="h-9 w-16" />}
            </p>
          </div>
          <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
            <h3 className="text-lg font-medium text-dark-300 mb-1">Total Paid</h3>
            <p className="text-3xl font-bold text-white font-heading">
              {stats ? `${stats.totalPaidOut} ETH` : <Skeleton className="h-9 w-16" />}
            </p>
          </div>
        </motion.div>

        <motion.div className="mb-6" variants={itemVariants}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-dark-800/50 border border-dark-700 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
                All Bounties
              </TabsTrigger>
              <TabsTrigger value="open" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
                Open
              </TabsTrigger>
              <TabsTrigger value="claimed" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
                Claimed
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-primary-600 data-[state=active]:text-white">
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {renderBountyList(bounties, isLoading, error)}
            </TabsContent>
            <TabsContent value="open">
              {renderBountyList(
                bounties?.filter(b => b.status === 'open'), 
                isLoading, 
                error
              )}
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

      {/* Create Bounty Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-dark-800 border border-primary-800/30 text-white max-w-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-primary-500/20 rounded-lg flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-primary-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Create New Bounty</h2>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-3">
                <Label htmlFor="title" className="text-white font-medium text-base mb-1.5 block">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-dark-900 border-dark-700 text-white text-lg py-3 px-4 focus:border-primary-500 shadow-sm placeholder:text-dark-300/70 placeholder:text-base rounded-lg"
                  placeholder="Enter a descriptive title for your bounty"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-white font-medium text-base mb-1.5 block">Amount *</Label>
                <div className="flex">
                  <div className="flex-1">
                    <div className="relative">
                      <input 
                        id="amount"
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="w-full px-4 py-3 bg-dark-900 border border-dark-700 focus:border-primary-500 rounded-lg text-white text-lg placeholder:text-dark-300/70 placeholder:text-base transition-colors shadow-sm"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300">ETH</div>
                    </div>
                  </div>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange as any}
                    className="ml-2 bg-dark-900 border border-dark-700 rounded-lg text-white px-3 shadow-sm"
                  >
                    <option value="ETH">ETH</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white font-medium text-base mb-1.5 block">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-dark-900 border-dark-700 text-white text-lg h-32 focus:border-primary-500 shadow-sm placeholder:text-dark-300/70 placeholder:text-base"
                placeholder="Provide a detailed description of the bounty requirements and goals"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="issueUrl" className="text-white font-medium text-base">GitHub Issue URL *</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 flex items-center gap-1.5 transition-all duration-200"
                  onClick={() => setIsGitHubSelectorOpen(true)}
                >
                  <Github className="h-4 w-4" />
                  Browse GitHub Issues
                </Button>
              </div>
              <Input
                id="issueUrl"
                name="issueUrl"
                value={formData.issueUrl}
                onChange={handleInputChange}
                className="bg-dark-900 border-dark-700 text-white text-lg py-3 px-4 focus:border-primary-500 shadow-sm placeholder:text-dark-300/70 placeholder:text-base rounded-lg"
                placeholder="Enter the URL of the GitHub issue"
                required
              />
            </div>

            <div>
              <Label htmlFor="tags" className="text-white font-medium text-base mb-1.5 block">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="bg-dark-900 border-dark-700 text-white text-lg py-3 px-4 focus:border-primary-500 shadow-sm placeholder:text-dark-300/70 placeholder:text-base rounded-lg"
                placeholder="Enter relevant tags (e.g., javascript, react, ethereum)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="border-dark-600 text-dark-200 hover:text-white hover:border-dark-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBounty}
              className="bg-primary-600 hover:bg-primary-500 text-white"
              disabled={createBountyMutation.isPending}
            >
              {createBountyMutation.isPending ? "Creating..." : "Create Bounty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GitHub Repository Selector Dialog */}
      <Dialog open={isGitHubSelectorOpen} onOpenChange={setIsGitHubSelectorOpen}>
        <DialogContent className="bg-dark-800 border border-primary-800/30 text-white max-w-3xl overflow-hidden shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading text-white">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary-500/20 rounded-lg flex items-center justify-center shadow-md">
                  <Github className="h-5 w-5 text-primary-400" />
                </div>
                <h2 className="text-xl font-semibold">Select GitHub Repository & Issue</h2>
              </div>
            </DialogTitle>
            <DialogDescription className="text-dark-300 mt-2">
              Choose a repository and issue to create a bounty for. This will automatically fill in the related fields.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Repository Selection */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white flex items-center gap-2">
                <div className="h-5 w-5 bg-primary-500/20 rounded-md flex items-center justify-center">
                  <GitFork className="h-3 w-3 text-primary-400" />
                </div>
                Your Repositories
              </h3>

              {isReposLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-dark-700/50 rounded-lg p-4 animate-pulse">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : repositories && repositories.length > 0 ? (
                <div className="space-y-2.5">
                  {repositories.map(repo => (
                    <div 
                      key={repo.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedRepoId === repo.id.toString() 
                          ? 'bg-primary-600/20 border border-primary-500/40 shadow-[0_0_8px_rgba(99,102,241,0.3)]' 
                          : 'bg-dark-700/50 hover:bg-dark-700/80 border border-transparent hover:border-dark-600'
                      }`}
                      onClick={() => setSelectedRepoId(repo.id.toString())}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <GitFork className="h-4 w-4 text-primary-400" />
                        <h4 className="font-medium text-white">{repo.name}</h4>
                      </div>
                      <p className="text-xs text-dark-300 line-clamp-2">
                        {repo.description || 'No description available'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : reposError ? (
                <div className="text-center py-8 border border-dashed border-dark-600 rounded-lg">
                  <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <p className="text-dark-200 text-sm">Error loading repositories. Please ensure your GitHub token has the necessary permissions.</p>
                  <p className="text-dark-400 text-xs mt-2">
                    {reposError instanceof Error ? reposError.message : "An unknown error occurred"}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-dark-600 rounded-lg">
                  <AlertTriangle className="h-10 w-10 text-dark-400 mx-auto mb-2" />
                  <p className="text-dark-300 text-sm">No repositories found. Make sure your GitHub account is connected properly.</p>
                </div>
              )}
            </div>

            {/* Issue Selection */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white flex items-center gap-2">
                <div className="h-5 w-5 bg-green-500/20 rounded-md flex items-center justify-center">
                  <GitPullRequest className="h-3 w-3 text-green-400" />
                </div>
                Issues
              </h3>

              {!selectedRepoId ? (
                <div className="text-center py-14 border border-dashed border-dark-600 rounded-lg">
                  <GitPullRequest className="h-12 w-12 text-dark-400 mx-auto mb-3" />
                  <p className="text-dark-300 text-sm">Select a repository to view available issues.</p>
                </div>
              ) : isIssuesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-dark-700/50 rounded-lg p-4 animate-pulse">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                    </div>
                  ))}
                </div>
              ) : issues && issues.length > 0 ? (
                <div className="space-y-2.5">
                  {issues.map(issue => (
                    <div 
                      key={issue.id}
                      className="p-4 rounded-lg cursor-pointer bg-dark-700/50 hover:bg-dark-700/80 border border-transparent hover:border-dark-600 transition-all duration-200"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          title: issue.title,
                          description: issue.body,
                          issueUrl: issue.html_url,
                          repositoryId: selectedRepoId,
                          issueId: issue.id.toString()
                        });
                        setIsGitHubSelectorOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="h-5 w-5 flex items-center justify-center mt-0.5 text-green-500">
                          <svg viewBox="0 0 16 16" width="1em" height="1em">
                            <path fill="currentColor" d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                            <path fill="currentColor" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>
                          </svg>
                        </span>
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{issue.title}</h4>
                          <p className="text-xs text-dark-300 line-clamp-2 mt-1.5">
                            {issue.body || 'No description available'}
                          </p>
                          <div className="flex items-center gap-2 mt-2.5">
                            <span className="text-xs px-1.5 py-0.5 bg-dark-600/50 rounded-md text-dark-300">#{issue.number}</span>
                            {issue.labels.length > 0 && (
                              <div className="flex items-center gap-1.5">
                                {issue.labels.slice(0, 3).map(label => (
                                  <span 
                                    key={label.id}
                                    className="px-2 py-0.5 text-[10px] rounded-full"
                                    style={{ backgroundColor: `#${label.color}20`, color: `#${label.color}` }}
                                  >
                                    {label.name}
                                  </span>
                                ))}
                                {issue.labels.length > 3 && (
                                  <span className="text-[10px] text-dark-400">+{issue.labels.length - 3} more</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : issuesError ? (
                <div className="text-center py-8 border border-dashed border-dark-600 rounded-lg">
                  <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <p className="text-dark-200 text-sm">Error loading issues. Please ensure your GitHub token has the necessary permissions.</p>
                  <p className="text-dark-400 text-xs mt-2">
                    {issuesError instanceof Error ? issuesError.message : "An unknown error occurred"}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-dark-600 rounded-lg">
                  <AlertTriangle className="h-10 w-10 text-dark-400 mx-auto mb-2" />
                  <p className="text-dark-300 text-sm">No open issues found for this repository.</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGitHubSelectorOpen(false)}
              className="border-dark-600 text-dark-200 hover:text-white hover:border-dark-500"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      <div className="mt-6 p-6 bg-dark-800/40 border border-dark-700 rounded-xl text-center">    <p className="text-dark-300">No bounties found. Create your first bounty to get started!</p>
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
                bounty.status === 'open' 
                  ? 'bg-primary-500/20 text-primary-400' 
                  : bounty.status === 'claimed' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-green-500/20 text-green-400'
              }`}>
                {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
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
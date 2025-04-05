import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import BountiesIndex from "@/pages/bounties/index";
import BountyDetail from "@/pages/bounties/detail";
import CreatorDashboard from "@/pages/creator/dashboard";
import SolverDashboard from "@/pages/solver/dashboard";
import { AuthProvider, useAuthContext } from "./contexts/auth-context";
import { EthereumProvider } from "./contexts/ethereum-context";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// Protected route component to handle authentication
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuthContext();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-lg font-medium text-foreground">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to home page which has login button
    return <Redirect to="/" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>
        <Route path="/bounties">
          {() => <ProtectedRoute component={BountiesIndex} />}
        </Route>
        <Route path="/bounties/:id">
          {(params) => <ProtectedRoute component={BountyDetail} id={params.id} />}
        </Route>
        <Route path="/creator/dashboard">
          {() => <ProtectedRoute component={CreatorDashboard} />}
        </Route>
        <Route path="/solver/dashboard">
          {() => <ProtectedRoute component={SolverDashboard} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EthereumProvider>
          <Router />
          <Toaster />
        </EthereumProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

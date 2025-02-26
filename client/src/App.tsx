import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import PostJob from "@/pages/post-job";
import Jobs from "@/pages/jobs";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "@/components/header";
import { LanguageSelector } from "@/components/language-selector";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Switch>
        <ProtectedRoute path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/post-job" component={PostJob} />
        <ProtectedRoute path="/jobs" component={Jobs} />
        <Route component={NotFound} />
      </Switch>
      <LanguageSelector />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
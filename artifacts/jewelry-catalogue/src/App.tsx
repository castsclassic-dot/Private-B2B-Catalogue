import { type ReactNode } from 'react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppShell } from '@/components/app-shell';
import { AuthProvider, useAuth } from '@/lib/auth';
import CataloguePage from '@/pages/catalogue';
import AdminPage from '@/pages/admin';
import VendorPage from '@/pages/vendor';
import LoginPage from '@/pages/login';
import UnauthorizedPage from '@/pages/unauthorized';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function HomeRedirect() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  useEffect(() => { setLocation(user ? '/catalogue' : '/login'); }, [setLocation, user]);
  return null;
}

function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAdmin } = useAuth();
  useEffect(() => {
    if (!isLoading && !user) setLocation('/login');
  }, [isLoading, setLocation, user]);
  if (isLoading) return <div className="min-h-[100dvh] bg-background" />;
  if (!user) return null;
  if (adminOnly && !isAdmin) return <AppShell><UnauthorizedPage /></AppShell>;
  return <AppShell>{children}</AppShell>;
}

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={HomeRedirect} />
    <Route path="/login" component={LoginPage} />
    <Route path="/catalogue"><ProtectedRoute><CataloguePage /></ProtectedRoute></Route>
    <Route path="/admin"><ProtectedRoute adminOnly><AdminPage /></ProtectedRoute></Route>
    <Route path="/vendor"><ProtectedRoute><VendorPage /></ProtectedRoute></Route>
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><AuthProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter></AuthProvider></TooltipProvider><Toaster /></QueryClientProvider>;
}

export default App;
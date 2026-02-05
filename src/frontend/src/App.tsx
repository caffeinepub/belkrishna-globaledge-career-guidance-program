import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AssessmentsListPage from './pages/AssessmentsListPage';
import AssessmentStartPage from './pages/AssessmentStartPage';
import AssessmentRunnerPage from './pages/AssessmentRunnerPage';
import AssessmentReviewPage from './pages/AssessmentReviewPage';
import AssessmentCompletePage from './pages/AssessmentCompletePage';
import ResultsPage from './pages/ResultsPage';
import ReportEditorPage from './pages/ReportEditorPage';
import HistoryPage from './pages/HistoryPage';
import ProfileSetupModal from './components/profile/ProfileSetupModal';
import LoginButton from './components/auth/LoginButton';
import { Loader2 } from 'lucide-react';

function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (loginStatus === 'initializing') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-accent/5 px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <img 
              src="/assets/generated/belkrishna-logo.dim_512x512.png" 
              alt="BELKRISHNA GlobalEdge" 
              className="w-32 h-32 mx-auto"
            />
            <h1 className="text-4xl font-bold tracking-tight">BELKRISHNA GlobalEdge</h1>
            <p className="text-xl text-muted-foreground">Career Guidance Program</p>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Discover your career path with our comprehensive assessment program
            </p>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showProfileSetup && <ProfileSetupModal />}
      {children}
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <AuthGate>
      <Layout />
    </AuthGate>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const assessmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assessments',
  component: AssessmentsListPage,
});

const assessmentStartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assessment/start',
  component: AssessmentStartPage,
});

const assessmentRunnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assessment/run/$sessionId',
  component: AssessmentRunnerPage,
});

const assessmentReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assessment/review/$sessionId',
  component: AssessmentReviewPage,
});

const assessmentCompleteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assessment/complete/$sessionId',
  component: AssessmentCompletePage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results/$sessionId',
  component: ResultsPage,
});

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report/$reportId',
  component: ReportEditorPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  profileRoute,
  assessmentsRoute,
  assessmentStartRoute,
  assessmentRunnerRoute,
  assessmentReviewRoute,
  assessmentCompleteRoute,
  resultsRoute,
  reportRoute,
  historyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

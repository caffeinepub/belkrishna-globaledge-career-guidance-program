import { Link } from '@tanstack/react-router';
import { useGetCallerUserProfile, useGetUserAssessmentSessions } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ClipboardList, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: sessions, isLoading: sessionsLoading } = useGetUserAssessmentSessions();

  const inProgressSession = sessions?.find(s => !s.completed);
  const completedSessions = sessions?.filter(s => s.completed) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="space-y-6 flex flex-col justify-center">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Welcome{profileLoading ? '' : profile ? `, ${profile.name}` : ''}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Discover your strengths and explore career paths tailored to your unique abilities
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/assessments">
                  <Button size="lg" className="gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Start Assessment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                {completedSessions.length > 0 && (
                  <Link to="/history">
                    <Button size="lg" variant="outline" className="gap-2">
                      <BookOpen className="w-5 h-5" />
                      View Reports
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/assets/generated/career-hero.dim_1600x900.png" 
                alt="Career Planning" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Assessments</CardDescription>
              <CardTitle className="text-3xl">
                {sessionsLoading ? <Skeleton className="h-9 w-12" /> : sessions?.length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">
                {sessionsLoading ? <Skeleton className="h-9 w-12" /> : completedSessions.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl">
                {sessionsLoading ? <Skeleton className="h-9 w-12" /> : inProgressSession ? 1 : 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Current Status */}
        {inProgressSession && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Continue Your Assessment
              </CardTitle>
              <CardDescription>
                You have an assessment in progress. Pick up where you left off.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Progress: {inProgressSession.responses.length} / 150 questions
                  </p>
                  <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(inProgressSession.responses.length / 150) * 100}%` }}
                    />
                  </div>
                </div>
                <Link to="/assessment/run/$sessionId" params={{ sessionId: inProgressSession.sessionId }}>
                  <Button>Continue</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Section */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comprehensive Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete 150 carefully designed questions to evaluate your skills, interests, and aptitudes across multiple dimensions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalized Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Receive detailed career guidance reports with actionable insights tailored to your unique profile and aspirations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Track Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access your assessment history and reports anytime. Watch your career journey unfold with each completed assessment.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

import { Link } from '@tanstack/react-router';
import { useGetUserAssessmentSessions, useGetUserCareerReports } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { History, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function HistoryPage() {
  const { data: sessions, isLoading: sessionsLoading } = useGetUserAssessmentSessions();
  const { data: reports, isLoading: reportsLoading } = useGetUserCareerReports();

  const completedSessions = sessions?.filter(s => s.completed) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="w-8 h-8" />
            Assessment History
          </h1>
          <p className="text-muted-foreground">
            View your past assessments and career reports
          </p>
        </div>

        {/* Reports Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Career Reports
          </h2>
          {reportsLoading ? (
            <div className="grid gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="grid gap-4">
              {reports.map((report) => {
                const generatedDate = new Date(Number(report.generatedTime) / 1000000);
                const updatedDate = new Date(Number(report.updatedTime) / 1000000);
                
                return (
                  <Card key={report.reportId} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="flex items-center gap-2">
                            Career Guidance Report
                            <Badge variant="secondary">v{Number(report.version)}</Badge>
                          </CardTitle>
                          <CardDescription className="flex flex-col gap-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Generated: {generatedDate.toLocaleDateString()}
                            </span>
                            {report.version > 1n && (
                              <span className="text-xs">
                                Last updated: {updatedDate.toLocaleDateString()}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <Link to="/report/$reportId" params={{ reportId: report.reportId }}>
                          <Button>View Report</Button>
                        </Link>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No career reports yet</p>
                <Link to="/assessments">
                  <Button>Take an Assessment</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completed Assessments Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Completed Assessments
          </h2>
          {sessionsLoading ? (
            <div className="grid gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : completedSessions.length > 0 ? (
            <div className="grid gap-4">
              {completedSessions.map((session) => {
                const completedDate = new Date(Number(session.startTime) / 1000000);
                const correctAnswers = session.responses.filter(r => r.isCorrect).length;
                const accuracy = (correctAnswers / session.responses.length) * 100;

                return (
                  <Card key={session.sessionId} className="hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Assessment Completed</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {completedDate.toLocaleDateString()} at {completedDate.toLocaleTimeString()}
                          </p>
                          <p className="text-sm">
                            Score: {correctAnswers} / {session.responses.length} ({Math.round(accuracy)}%)
                          </p>
                        </div>
                        <Link to="/results/$sessionId" params={{ sessionId: session.sessionId }}>
                          <Button variant="outline">View Results</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No completed assessments yet</p>
                <Link to="/assessments">
                  <Button>Start Your First Assessment</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

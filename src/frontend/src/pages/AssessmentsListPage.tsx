import { Link } from '@tanstack/react-router';
import { useGetUserAssessmentSessions } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ClipboardList, Play, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function AssessmentsListPage() {
  const { data: sessions, isLoading } = useGetUserAssessmentSessions();

  const inProgressSession = sessions?.find(s => !s.completed);
  const completedSessions = sessions?.filter(s => s.completed) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="w-8 h-8" />
            Career Assessments
          </h1>
          <p className="text-muted-foreground">
            Take comprehensive assessments to discover your career path
          </p>
        </div>

        {/* Main Assessment Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">GlobalEdge Career Assessment</CardTitle>
            <CardDescription>
              A comprehensive 150-question assessment designed to evaluate your skills, interests, and career aptitudes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-muted-foreground">45-60 minutes</p>
              </div>
              <div>
                <p className="font-medium">Questions</p>
                <p className="text-muted-foreground">150 total</p>
              </div>
              <div>
                <p className="font-medium">Format</p>
                <p className="text-muted-foreground">Multiple choice</p>
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : inProgressSession ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Your Progress</span>
                  <span className="text-muted-foreground">
                    {inProgressSession.responses.length} / 150 questions
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(inProgressSession.responses.length / 150) * 100}%` }}
                  />
                </div>
                <Link to="/assessment/run/$sessionId" params={{ sessionId: inProgressSession.sessionId }}>
                  <Button className="w-full" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Assessment
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/assessment/start">
                <Button className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Start New Assessment
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Completed Assessments */}
        {completedSessions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Completed Assessments
            </h2>
            <div className="grid gap-4">
              {completedSessions.map((session) => (
                <Card key={session.sessionId}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Assessment Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(Number(session.startTime) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                      <Link to="/results/$sessionId" params={{ sessionId: session.sessionId }}>
                        <Button variant="outline">View Results</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

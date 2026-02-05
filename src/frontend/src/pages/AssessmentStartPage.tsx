import { useNavigate } from '@tanstack/react-router';
import { useStartAssessmentSession } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertCircle, Clock, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function AssessmentStartPage() {
  const navigate = useNavigate();
  const startSession = useStartAssessmentSession();

  const handleStart = async () => {
    const sessionId = `session-${Date.now()}`;
    try {
      await startSession.mutateAsync(sessionId);
      navigate({ to: `/assessment/run/${sessionId}` });
    } catch (error) {
      console.error('Failed to start assessment:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Start Your Career Assessment</h1>
          <p className="text-muted-foreground">
            Take your time and answer honestly for the most accurate results
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your progress is automatically saved. You can pause and resume at any time.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>What to Expect</CardTitle>
            <CardDescription>
              This assessment will help identify your strengths and career interests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex gap-3">
                <FileText className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">150 Questions</p>
                  <p className="text-sm text-muted-foreground">
                    Covering various aspects of your skills, interests, and personality
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">45-60 Minutes</p>
                  <p className="text-sm text-muted-foreground">
                    Average completion time, but take as long as you need
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Auto-Save Feature</p>
                  <p className="text-sm text-muted-foreground">
                    Your answers are saved automatically as you progress
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips for Success</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Answer honestly based on your true preferences and abilities</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Don't overthink your responses - go with your first instinct</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Find a quiet space where you can focus without interruptions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>You can review and change your answers before final submission</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate({ to: '/assessments' })}>
            Cancel
          </Button>
          <Button size="lg" onClick={handleStart} disabled={startSession.isPending}>
            {startSession.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              'Begin Assessment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

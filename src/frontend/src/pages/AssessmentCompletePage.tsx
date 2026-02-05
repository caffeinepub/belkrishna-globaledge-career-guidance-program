import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useCompleteAssessmentSession, useCreateCareerReport } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, Loader2, FileText } from 'lucide-react';

export default function AssessmentCompletePage() {
  const { sessionId } = useParams({ from: '/assessment/complete/$sessionId' });
  const navigate = useNavigate();
  const completeSession = useCompleteAssessmentSession();
  const createReport = useCreateCareerReport();
  const [isCompleting, setIsCompleting] = useState(true);

  useEffect(() => {
    const complete = async () => {
      try {
        await completeSession.mutateAsync(sessionId);
        setIsCompleting(false);
      } catch (error) {
        console.error('Failed to complete session:', error);
        setIsCompleting(false);
      }
    };
    complete();
  }, [sessionId]);

  const handleViewResults = () => {
    navigate({ to: `/results/${sessionId}` });
  };

  const handleGenerateReport = async () => {
    const reportId = `report-${sessionId}`;
    const initialContent = JSON.stringify({
      introduction: 'Your comprehensive career guidance report based on the assessment results.',
      strengths: 'Analysis of your key strengths and abilities.',
      recommendations: 'Personalized career path recommendations.',
      actionPlan: 'Next steps for your career development.',
    });

    try {
      await createReport.mutateAsync({
        reportId,
        sessionId,
        content: initialContent,
      });
      navigate({ to: `/report/${reportId}` });
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  if (isCompleting) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-12 pb-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Completing your assessment...</p>
            <p className="text-sm text-muted-foreground">Please wait while we process your responses</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <Card className="border-green-500/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl">Assessment Complete!</CardTitle>
            <CardDescription className="text-base">
              Congratulations on completing the BELKRISHNA GlobalEdge Career Assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>View your detailed results and scores</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Generate a comprehensive career guidance report</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Explore personalized career recommendations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Access your report anytime from your history</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={handleViewResults} className="w-full">
                View Results
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleGenerateReport}
                disabled={createReport.isPending}
                className="w-full"
              >
                {createReport.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Career Report
                  </>
                )}
              </Button>
              <Link to="/assessments">
                <Button variant="ghost" size="lg" className="w-full">
                  Back to Assessments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

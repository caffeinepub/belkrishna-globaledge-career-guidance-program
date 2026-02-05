import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useGetAssessmentSession, useCreateCareerReport } from '../hooks/useQueries';
import { ASSESSMENT_QUESTIONS } from '../lib/assessment/questions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { FileText, Loader2, TrendingUp } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function ResultsPage() {
  const { sessionId } = useParams({ from: '/results/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetAssessmentSession(sessionId);
  const createReport = useCreateCareerReport();

  const handleGenerateReport = async () => {
    const reportId = `report-${sessionId}`;
    
    // Calculate scores by category
    const categoryScores: Record<string, { correct: number; total: number }> = {};
    
    session?.responses.forEach(response => {
      const question = ASSESSMENT_QUESTIONS.find(q => q.id === Number(response.questionId));
      if (question) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = { correct: 0, total: 0 };
        }
        categoryScores[question.category].total++;
        if (response.isCorrect) {
          categoryScores[question.category].correct++;
        }
      }
    });

    const reportContent = {
      sessionId,
      completedDate: new Date().toISOString(),
      overallScore: {
        correct: session?.responses.filter(r => r.isCorrect).length || 0,
        total: session?.responses.length || 0,
        percentage: ((session?.responses.filter(r => r.isCorrect).length || 0) / (session?.responses.length || 1)) * 100,
      },
      categoryScores,
      introduction: 'Your comprehensive career guidance report based on the GlobalEdge Career Assessment.',
      strengths: 'Based on your assessment results, you demonstrate strong capabilities in areas that align with your highest-scoring categories.',
      recommendations: 'Consider exploring career paths that leverage your identified strengths and interests.',
      actionPlan: 'Continue developing your skills through targeted learning and practical experience in your areas of interest.',
    };

    try {
      await createReport.mutateAsync({
        reportId,
        sessionId,
        content: JSON.stringify(reportContent),
      });
      navigate({ to: `/report/${reportId}` });
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p className="text-muted-foreground">Session not found</p>
        <Link to="/assessments">
          <Button className="mt-4">Back to Assessments</Button>
        </Link>
      </div>
    );
  }

  const totalQuestions = session.responses.length;
  const correctAnswers = session.responses.filter(r => r.isCorrect).length;
  const accuracy = (correctAnswers / totalQuestions) * 100;

  // Calculate category scores
  const categoryScores: Record<string, { correct: number; total: number }> = {};
  session.responses.forEach(response => {
    const question = ASSESSMENT_QUESTIONS.find(q => q.id === Number(response.questionId));
    if (question) {
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { correct: 0, total: 0 };
      }
      categoryScores[question.category].total++;
      if (response.isCorrect) {
        categoryScores[question.category].correct++;
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Assessment Results
          </h1>
          <p className="text-muted-foreground">
            Your performance summary and detailed breakdown
          </p>
        </div>

        {/* Overall Score */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Overall Performance</CardTitle>
            <CardDescription>Your total score across all categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{Math.round(accuracy)}%</p>
                <p className="text-sm text-muted-foreground mt-1">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">{correctAnswers}</p>
                <p className="text-sm text-muted-foreground mt-1">Correct Answers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">{totalQuestions}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>Detailed breakdown of your scores in each assessment area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(categoryScores).map(([category, scores]) => {
              const percentage = (scores.correct / scores.total) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category}</span>
                    <span className="text-muted-foreground">
                      {scores.correct} / {scores.total} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Generate your personalized career guidance report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Based on your assessment results, we can generate a comprehensive career guidance report
              with personalized recommendations, strengths analysis, and an action plan for your career development.
            </p>
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleGenerateReport}
                disabled={createReport.isPending}
                className="flex-1"
              >
                {createReport.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Career Report
                  </>
                )}
              </Button>
              <Link to="/assessments">
                <Button variant="outline" size="lg">
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

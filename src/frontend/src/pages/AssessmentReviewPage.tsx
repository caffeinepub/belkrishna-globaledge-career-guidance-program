import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useGetAssessmentSession } from '../hooks/useQueries';
import { ASSESSMENT_QUESTIONS } from '../lib/assessment/questions';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function AssessmentReviewPage() {
  const { sessionId } = useParams({ from: '/assessment/review/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetAssessmentSession(sessionId);

  const answeredQuestions = session?.responses.map(r => Number(r.questionId)) || [];
  const unansweredCount = 150 - answeredQuestions.length;

  const handleQuestionClick = (index: number) => {
    navigate({ to: '/assessment/run/$sessionId', params: { sessionId } });
  };

  const handleComplete = () => {
    navigate({ to: '/assessment/complete/$sessionId', params: { sessionId } });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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

  const questionsByCategory = ASSESSMENT_QUESTIONS.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, typeof ASSESSMENT_QUESTIONS>);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Review Your Answers</h1>
          <p className="text-muted-foreground">
            Check your progress and navigate to any question before submitting
          </p>
        </div>

        {/* Summary Card */}
        <Card className={unansweredCount > 0 ? 'border-orange-500/50' : 'border-green-500/50'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {answeredQuestions.length} / {ASSESSMENT_QUESTIONS.length}
                </p>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </div>
              {unansweredCount > 0 ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{unansweredCount} unanswered</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">All questions answered</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions by Category */}
        <div className="space-y-6">
          {Object.entries(questionsByCategory).map(([category, questions]) => {
            const categoryAnswered = questions.filter(q => 
              answeredQuestions.includes(q.id)
            ).length;

            return (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <Badge variant={categoryAnswered === questions.length ? 'default' : 'secondary'}>
                      {categoryAnswered} / {questions.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {questions.map((question) => {
                      const isAnswered = answeredQuestions.includes(question.id);
                      return (
                        <Button
                          key={question.id}
                          variant={isAnswered ? 'default' : 'outline'}
                          size="sm"
                          className="w-full"
                          onClick={() => handleQuestionClick(question.id - 1)}
                        >
                          {isAnswered ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                          <span className="ml-1">{question.id}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Link to="/assessment/run/$sessionId" params={{ sessionId }}>
            <Button variant="outline" size="lg">
              Continue Assessment
            </Button>
          </Link>
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={unansweredCount > 0}
          >
            {unansweredCount > 0 ? (
              `Answer ${unansweredCount} more to submit`
            ) : (
              'Submit Assessment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useGetAssessmentSession, useSubmitResponse } from '../hooks/useQueries';
import { ASSESSMENT_QUESTIONS } from '../lib/assessment/questions';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { ChevronLeft, ChevronRight, List, Loader2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function AssessmentRunnerPage() {
  const { sessionId } = useParams({ from: '/assessment/run/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetAssessmentSession(sessionId);
  const submitResponse = useSubmitResponse();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const progress = session ? (session.responses.length / 150) * 100 : 0;

  // Load existing answer if available
  useEffect(() => {
    if (session && currentQuestion) {
      const existingResponse = session.responses.find(
        r => Number(r.questionId) === currentQuestion.id
      );
      setSelectedAnswer(existingResponse?.answer || '');
    }
  }, [session, currentQuestion]);

  const handleAnswerChange = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (selectedAnswer && currentQuestion) {
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      await submitResponse.mutateAsync({
        sessionId,
        response: {
          questionId: BigInt(currentQuestion.id),
          answer: selectedAnswer,
          isCorrect,
        },
      });
    }

    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReview = () => {
    navigate({ to: `/assessment/review/${sessionId}` });
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Progress Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Career Assessment</h1>
            <Button variant="outline" size="sm" onClick={handleReview}>
              <List className="w-4 h-4 mr-2" />
              Review
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
              </span>
              <span className="font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <p className="text-sm text-muted-foreground">{currentQuestion.category}</p>
                <CardTitle className="text-xl leading-relaxed">{currentQuestion.text}</CardTitle>
              </div>
              <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                #{currentQuestion.id}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedAnswer === option
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleAnswerChange(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedAnswer || submitResponse.isPending}
              >
                {submitResponse.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1 ? (
                  'Save Answer'
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

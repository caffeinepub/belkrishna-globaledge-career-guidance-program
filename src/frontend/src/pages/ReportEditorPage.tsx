import { useState, useEffect } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useGetCareerReport, useUpdateCareerReport } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { FileText, Save, Loader2, Clock } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function ReportEditorPage() {
  const { reportId } = useParams({ from: '/report/$reportId' });
  const { data: report, isLoading } = useGetCareerReport(reportId);
  const updateReport = useUpdateCareerReport();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<any>(null);

  useEffect(() => {
    if (report) {
      try {
        const parsed = JSON.parse(report.content);
        setEditedContent(parsed);
      } catch {
        setEditedContent({ introduction: report.content });
      }
    }
  }, [report]);

  const handleSave = async () => {
    if (!editedContent) return;

    try {
      await updateReport.mutateAsync({
        reportId,
        content: JSON.stringify(editedContent),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedContent({ ...editedContent, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!report || !editedContent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p className="text-muted-foreground">Report not found</p>
        <Link to="/history">
          <Button className="mt-4">Back to History</Button>
        </Link>
      </div>
    );
  }

  const lastUpdated = new Date(Number(report.updatedTime) / 1000000);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Career Guidance Report
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: {lastUpdated.toLocaleDateString()} at {lastUpdated.toLocaleTimeString()}
              </div>
              <div>Version {Number(report.version)}</div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateReport.isPending}>
                  {updateReport.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Report</Button>
            )}
          </div>
        </div>

        {/* Overall Score (if available) */}
        {editedContent.overallScore && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {Math.round(editedContent.overallScore.percentage)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{editedContent.overallScore.correct}</p>
                  <p className="text-sm text-muted-foreground mt-1">Correct Answers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{editedContent.overallScore.total}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
            <CardDescription>Overview of your career assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedContent.introduction || ''}
                onChange={(e) => handleFieldChange('introduction', e.target.value)}
                rows={4}
                className="resize-none"
              />
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {editedContent.introduction}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Strengths</CardTitle>
            <CardDescription>Key abilities identified through the assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedContent.strengths || ''}
                onChange={(e) => handleFieldChange('strengths', e.target.value)}
                rows={6}
                className="resize-none"
              />
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {editedContent.strengths}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Recommendations</CardTitle>
            <CardDescription>Suggested career paths based on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedContent.recommendations || ''}
                onChange={(e) => handleFieldChange('recommendations', e.target.value)}
                rows={6}
                className="resize-none"
              />
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {editedContent.recommendations}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Plan</CardTitle>
            <CardDescription>Next steps for your career development</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedContent.actionPlan || ''}
                onChange={(e) => handleFieldChange('actionPlan', e.target.value)}
                rows={6}
                className="resize-none"
              />
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {editedContent.actionPlan}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Category Scores (if available) */}
        {editedContent.categoryScores && Object.keys(editedContent.categoryScores).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Category Performance</CardTitle>
              <CardDescription>Your scores across different assessment areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(editedContent.categoryScores).map(([category, scores]: [string, any]) => (
                  <div key={category} className="flex items-center justify-between py-2">
                    <span className="font-medium">{category}</span>
                    <span className="text-muted-foreground">
                      {scores.correct} / {scores.total} ({Math.round((scores.correct / scores.total) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        <div className="flex justify-center">
          <Link to="/history">
            <Button variant="outline" size="lg">
              Back to History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

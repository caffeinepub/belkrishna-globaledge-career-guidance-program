import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Loader2, Save, User } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setSchool(profile.school);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !school.trim()) return;

    try {
      await saveProfile.mutateAsync({ name, email, school });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const hasChanges = profile && (
    name !== profile.name || 
    email !== profile.email || 
    school !== profile.school
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <User className="w-8 h-8" />
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile details. Changes are saved immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School/Institution</Label>
                  <Input
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Enter your school name"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={saveProfile.isPending || !hasChanges}
                  className="w-full sm:w-auto"
                >
                  {saveProfile.isPending ? (
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
                {saveProfile.isSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Profile updated successfully!
                  </p>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

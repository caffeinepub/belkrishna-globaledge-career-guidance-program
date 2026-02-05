import { Link, useRouterState } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import { Home, ClipboardList, History, User } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/assessments', label: 'Assessments', icon: ClipboardList },
    { path: '/history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/assets/generated/belkrishna-logo.dim_512x512.png" 
                alt="BELKRISHNA GlobalEdge" 
                className="w-10 h-10"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight">BELKRISHNA GlobalEdge</h1>
                <p className="text-xs text-muted-foreground">Career Guidance Program</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <nav className="flex md:hidden items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026. Built with ❤️ using{' '}
              <a 
                href="https://caffeine.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

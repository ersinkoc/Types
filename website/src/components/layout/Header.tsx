import { Github, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { GitHubStar } from '@/components/common/GitHubStar';
import { Button } from '@/components/ui/button';
import { PACKAGE_NAME, GITHUB_REPO, NPM_PACKAGE } from '@/lib/constants';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold">{PACKAGE_NAME}</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </Link>
          <Link to="/api" className="text-muted-foreground hover:text-foreground transition-colors">
            API
          </Link>
          <Link to="/examples" className="text-muted-foreground hover:text-foreground transition-colors">
            Examples
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <GitHubStar />
          <a
            href={`https://www.npmjs.com/package/${NPM_PACKAGE}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Package className="h-5 w-5" />
            </Button>
          </a>
          <a
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

import { Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GITHUB_REPO } from '@/lib/constants';

export function GitHubStar() {
  return (
    <a
      href={`https://github.com/${GITHUB_REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
    >
      <Star className="h-4 w-4" />
      <span>Star</span>
    </a>
  );
}

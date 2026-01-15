import { useState, useEffect } from 'react';
import { CopyButton } from './CopyButton';
import { Github, ChevronDown } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  className?: string;
}

const themes = [
  { name: 'Github Dark', value: 'github-dark' },
  { name: 'VS Code', value: 'vscode' },
  { name: 'Dracula', value: 'dracula' },
  { name: 'One Dark', value: 'one-dark' },
];

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = true,
  showCopyButton = true,
  className,
}: CodeBlockProps) {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const trimmedCode = code.trim();
  const lines = trimmedCode.split('\n');

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  // Prism.js sanitizes output - safe to use with dangerouslySetInnerHTML
  const highlightedLines = lines.map((line) => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.javascript;
      return Prism.highlight(line || ' ', grammar, language);
    } catch {
      return escapeHtml(line) || '&nbsp;';
    }
  });

  return (
    <div className={`code-block relative group rounded-xl overflow-hidden border border-border/50 bg-card shadow-lg ${className || ''}`}>
      {/* IDE Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border/50">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
          </div>
          {/* Filename */}
          {filename && (
            <span className="text-sm text-muted-foreground font-mono">{filename}</span>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Language badge */}
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {language}
          </span>

          {/* Theme selector */}
          <div className="relative">
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>{selectedTheme.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Theme dropdown */}
            {isThemeOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-border bg-popover shadow-lg py-1 z-50">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => {
                      setSelectedTheme(theme);
                      setIsThemeOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-accent transition-colors ${
                      selectedTheme.value === theme.value ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copy button */}
          {showCopyButton && <CopyButton text={trimmedCode} />}
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto bg-[hsl(222,47%,6%)]">
        <pre className="p-4 m-0 font-mono text-sm leading-relaxed">
          <code className="text-[#e6e6e6]">
            {lines.map((_, i) => (
              <div key={i} className="flex hover:bg-white/5 -mx-4 px-4">
                {showLineNumbers && (
                  <span className="text-[#6e7681] select-none mr-6 inline-block w-8 text-right text-xs leading-relaxed">
                    {i + 1}
                  </span>
                )}
                <span
                  className="flex-1"
                  // Prism.highlight output is safe - it escapes HTML entities
                  dangerouslySetInnerHTML={{ __html: highlightedLines[i] || '&nbsp;' }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// HTML escape function for fallback
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

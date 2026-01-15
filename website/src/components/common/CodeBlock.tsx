import { useState, useMemo } from 'react';
import { CodeBlock as CodeshinBlock } from '@oxog/codeshine/react';
import { githubDark, githubLight, vscodeDark, vscodeLight, dracula, oneDark } from '@oxog/codeshine/themes';
import { useTheme } from '@/hooks/useTheme';
import { ChevronDown } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  className?: string;
}

const darkThemes = [
  { name: 'Github Dark', value: 'github-dark', theme: githubDark },
  { name: 'VS Code Dark', value: 'vscode-dark', theme: vscodeDark },
  { name: 'Dracula', value: 'dracula', theme: dracula },
  { name: 'One Dark', value: 'one-dark', theme: oneDark },
];

const lightThemes = [
  { name: 'Github Light', value: 'github-light', theme: githubLight },
  { name: 'VS Code Light', value: 'vscode-light', theme: vscodeLight },
];

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = true,
  showCopyButton = true,
  className,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Theme options based on site theme
  const themeOptions = useMemo(() => isDark ? darkThemes : lightThemes, [isDark]);

  // Default to first theme of current mode
  const [selectedThemeValue, setSelectedThemeValue] = useState<string | null>(null);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  // Get the current theme - reset to default when site theme changes
  const selectedTheme = useMemo(() => {
    const found = themeOptions.find(t => t.value === selectedThemeValue);
    return found || themeOptions[0];
  }, [themeOptions, selectedThemeValue]);

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
              <span>{selectedTheme.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Theme dropdown */}
            {isThemeOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-border bg-popover shadow-lg py-1 z-50">
                {themeOptions.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => {
                      setSelectedThemeValue(theme.value);
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
        </div>
      </div>

      {/* Code content using @oxog/codeshine */}
      <CodeshinBlock
        code={code.trim()}
        language={language}
        theme={selectedTheme.theme}
        lineNumbers={showLineNumbers}
        copyButton={showCopyButton}
        showLanguageBadge={false}
        className="rounded-none! border-0!"
      />
    </div>
  );
}

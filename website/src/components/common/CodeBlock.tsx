import { CopyButton } from './CopyButton';
import { useTheme } from '@/hooks/useTheme';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import typescriptLang from 'prismjs/components/prism-typescript.js';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = true,
  showCopyButton = true,
  className,
}: CodeBlockProps) {
  const trimmedCode = code.trim();
  const lines = trimmedCode.split('\n');

  const highlightedLines = lines.map((line) => {
    const grammar = Prism.languages[language] || Prism.languages.javascript;
    return Prism.highlight(line, grammar, language);
  });

  return (
    <div className={`relative group rounded-xl overflow-hidden border bg-card shadow-sm my-4 ${className || ''}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
          {filename && (
            <span className="text-sm text-muted-foreground font-mono">{filename}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{language}</span>
          {showCopyButton && <CopyButton text={trimmedCode} />}
        </div>
      </div>

      <div className="overflow-x-auto">
        <pre className="p-4 m-0 font-mono text-sm bg-background">
          <code className="text-foreground">
            {lines.map((_, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="text-muted-foreground select-none mr-4 inline-block w-8 text-right">
                    {i + 1}
                  </span>
                )}
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: highlightedLines[i] || '&nbsp;' }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

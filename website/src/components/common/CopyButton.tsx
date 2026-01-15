import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => copy(text)}
      className="h-8 w-8"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}

import { useState } from 'react';
import { CopyButton } from './CopyButton';
import { Button } from '@/components/ui/button';

const PACKAGE_NAME = '@oxog/types';

const commands = [
  { name: 'npm', value: `npm install ${PACKAGE_NAME}` },
  { name: 'yarn', value: `yarn add ${PACKAGE_NAME}` },
  { name: 'pnpm', value: `pnpm add ${PACKAGE_NAME}` },
  { name: 'bun', value: `bun add ${PACKAGE_NAME}` },
];

export function InstallTabs() {
  const [active, setActive] = useState(commands[0].name);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center border-b">
        {commands.map((cmd) => (
          <Button
            key={cmd.name}
            variant={active === cmd.name ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActive(cmd.name)}
            className="rounded-none"
          >
            {cmd.name}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-3 font-mono text-sm">
        <code className="text-foreground">
          {commands.find((c) => c.name === active)?.value}
        </code>
        <CopyButton text={commands.find((c) => c.name === active)?.value || ''} />
      </div>
    </div>
  );
}

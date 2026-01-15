import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InstallTabs } from '@/components/common/InstallTabs';
import { CodeBlock } from '@/components/common/CodeBlock';
import { PACKAGE_NAME } from '@/lib/constants';

export function Home() {
  const exampleCode = `import { Plugin, Kernel, Result, Ok, Err } from '${PACKAGE_NAME}';

// Example: Using Result type
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err('Division by zero');
  return Ok(a / b);
}

const result = divide(10, 2);
if (isOk(result)) {
  console.log(result.value); // 5
}

// Example: Creating a plugin
const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(kernel) {
    kernel.on('event', (payload) => {
      console.log('Event received:', payload);
    });
  },
};`;

  return (
    <div className="flex flex-col">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="container relative max-w-screen-2xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 bg-card">
              <span className="text-primary font-medium">@oxog/types</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-muted-foreground">v1.0.0</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Shared TypeScript types and utilities
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              {PACKAGE_NAME} provides micro-kernel plugin architecture, Rust-inspired Result type,
              comprehensive error handling, and utility types with zero dependencies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/docs">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <a href="https://github.com/ersinkoc/types" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View on GitHub
                </Button>
              </a>
            </div>

            <InstallTabs />
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/50">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Zero Dependencies</CardTitle>
                <CardDescription>Pure TypeScript</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Type-Safe</CardTitle>
                <CardDescription>100% TypeScript</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Bundle Size</CardTitle>
                <CardDescription>Under 3KB</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Test Coverage</CardTitle>
                <CardDescription>100% Coverage</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Quick Example</h2>
            <CodeBlock code={exampleCode} language="typescript" filename="example.ts" />
          </div>
        </div>
      </section>
    </div>
  );
}

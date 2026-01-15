import { Link } from 'react-router-dom';
import { ArrowRight, Github, Sparkles, Shield, Puzzle, Zap, Box, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/common/CodeBlock';
import { CopyButton } from '@/components/common/CopyButton';
import { PACKAGE_NAME, VERSION, GITHUB_REPO } from '@/lib/constants';

export function Home() {
  const quickStartCode = `import { Plugin, Result, Ok, Err, isOk } from '${PACKAGE_NAME}';

// Rust-inspired Result type for functional error handling
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err('Division by zero');
  return Ok(a / b);
}

const result = divide(10, 2);
if (isOk(result)) {
  console.log(result.value); // 5
}

// Type-safe plugin system
const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(kernel) {
    kernel.on('init', () => console.log('Ready!'));
  },
};`;

  const installCommand = `npm install ${PACKAGE_NAME}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent dark:from-blue-600/20 dark:via-purple-600/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container relative max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            {/* Version Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-4 py-1.5 text-sm mb-8 shadow-sm">
              <span className="text-blue-500 font-semibold">v{VERSION}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Now Available</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
              Zero-Dependency{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                TypeScript
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Foundation
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Type-safe plugin architecture, Rust-inspired Result type, and comprehensive
              error handling. The only type library you'll ever need for building robust applications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link to="/docs">
                <Button size="lg" className="gap-2 px-6 h-12 text-base font-medium">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href={`https://github.com/${GITHUB_REPO}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="gap-2 px-6 h-12 text-base font-medium">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              </a>
            </div>

            {/* Install Command */}
            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm px-5 py-3 shadow-sm">
              <code className="font-mono text-sm text-muted-foreground">{installCommand}</code>
              <CopyButton text={installCommand} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Quick Start</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Start using type-safe Result types and plugins in seconds with our intuitive API.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <CodeBlock
              code={quickStartCode}
              language="typescript"
              filename="app.ts"
              showLineNumbers
              showCopyButton
            />
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 lg:py-28">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why @oxog/types?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built for developers who value simplicity, type safety, and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Zero Dependencies</h3>
              <p className="text-muted-foreground leading-relaxed">
                No runtime dependencies. Everything implemented from scratch for maximum control and minimal bundle size.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Type-Safe</h3>
              <p className="text-muted-foreground leading-relaxed">
                Full TypeScript support with end-to-end type inference. Catch errors at compile time, not runtime.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/5">
              <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 text-green-500">
                <Puzzle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Plugin System</h3>
              <p className="text-muted-foreground leading-relaxed">
                Micro-kernel architecture with a powerful plugin system. Extend functionality with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete toolkit for building type-safe applications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Zap className="w-5 h-5" />}
              title="Result Type"
              description="Rust-inspired Ok/Err for functional error handling"
            />
            <FeatureCard
              icon={<Box className="w-5 h-5" />}
              title="Branded Types"
              description="Type-safe identifiers that prevent accidental mixing"
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              title="Type Guards"
              description="Runtime type checking with full TypeScript support"
            />
            <FeatureCard
              icon={<CheckCircle className="w-5 h-5" />}
              title="100% Coverage"
              description="Thoroughly tested with 192 tests passing"
            />
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatCard value="0" label="Dependencies" />
            <StatCard value="< 3KB" label="Bundle Size" />
            <StatCard value="100%" label="TypeScript" />
            <StatCard value="192" label="Tests" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="relative rounded-3xl border border-border/50 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join the @oxog ecosystem and build type-safe applications with confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/docs">
                  <Button size="lg" className="gap-2 px-8 h-12">
                    Read the Docs
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/examples">
                  <Button variant="outline" size="lg" className="px-8 h-12">
                    View Examples
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30">
      <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-6">
      <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

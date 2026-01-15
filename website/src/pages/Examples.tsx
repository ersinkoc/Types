import { CodeBlock } from '@/components/common/CodeBlock';

export function Examples() {
  const resultExample = `import { Result, Ok, Err, isOk } from '@oxog/types';

// Chaining operations
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err('Division by zero');
  return Ok(a / b);
}

const result = divide(10, 2)
  .map(x => x * 2)
  .map(x => x.toString());

if (isOk(result)) {
  console.log(result.value); // "10"
}`;

  const errorHandlingExample = `import { OxogError, ValidationError } from '@oxog/types';

// Using error classes
try {
  throw new ValidationError('Invalid email format', {
    field: 'email',
    value: 'not-an-email',
  });
} catch (error) {
  if (error instanceof OxogError) {
    console.log(error.code); // "VALIDATION_ERROR"
    console.log(error.context?.field); // "email"
  }
}`;

  const pluginExample = `import { Plugin, Kernel } from '@oxog/types';

const loggerPlugin: Plugin = {
  name: 'logger',
  version: '1.0.0',
  install(kernel: Kernel) {
    kernel.on('error', (payload) => {
      console.error('[ERROR]', payload);
    });

    kernel.on('log', (payload) => {
      console.log('[LOG]', payload);
    });
  },
};

// Use in a kernel
const kernel = new Kernel();
kernel.use(loggerPlugin);`;

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Examples</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Practical examples of using @oxog/types in real-world scenarios.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-4">Result Type - Chaining</h2>
            <p className="text-muted-foreground mb-4">
              Chain Result operations safely:
            </p>
            <CodeBlock code={resultExample} language="typescript" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Error Handling</h2>
            <p className="text-muted-foreground mb-4">
              Using structured error classes:
            </p>
            <CodeBlock code={errorHandlingExample} language="typescript" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Plugin Architecture</h2>
            <p className="text-muted-foreground mb-4">
              Creating a logger plugin:
            </p>
            <CodeBlock code={pluginExample} language="typescript" />
          </section>
        </div>
      </div>
    </div>
  );
}

import { CodeBlock } from '@/components/common/CodeBlock';

export function Docs() {
  const installationCode = `npm install @oxog/types`;

  const resultCode = `import { Result, Ok, Err, isOk } from '@oxog/types';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
}

const result = divide(10, 2);
if (isOk(result)) {
  console.log(result.value); // 5
}`;

  const pluginCode = `import { Plugin, Kernel } from '@oxog/types';

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(kernel: Kernel) {
    kernel.on('user:created', (payload) => {
      console.log('User created:', payload);
    });
  },
};`;

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Learn how to use @oxog/types in your projects.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-4">Installation</h2>
            <p className="text-muted-foreground mb-4">
              Install @oxog/types using your favorite package manager:
            </p>
            <CodeBlock code={installationCode} language="bash" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Result Type</h2>
            <p className="text-muted-foreground mb-4">
              The Result type is inspired by Rust's Result and provides functional error handling:
            </p>
            <CodeBlock code={resultCode} language="typescript" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Plugin Architecture</h2>
            <p className="text-muted-foreground mb-4">
              Create plugins using the standardized Plugin interface:
            </p>
            <CodeBlock code={pluginCode} language="typescript" />
          </section>
        </div>
      </div>
    </div>
  );
}

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  bundle: true,
  metafile: true,
  target: 'es2022',
  platform: 'neutral',
  skipNodeModulesBundle: true,
  entryPoints: ['src/index.ts'],
  outDir: 'dist',
  onSuccess: 'echo "Build completed successfully"',
});

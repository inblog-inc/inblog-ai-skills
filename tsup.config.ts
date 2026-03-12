import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'bin/setup': 'bin/setup.ts' },
  format: ['cjs'],
  target: 'node18',
  banner: { js: '#!/usr/bin/env node' },
  clean: true,
});

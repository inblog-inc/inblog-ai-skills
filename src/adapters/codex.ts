import fs from 'node:fs';
import path from 'node:path';
import type { Adapter } from './types.js';
import { combineContentFiles, mergeWithMarkers } from './shared.js';

export const codexAdapter: Adapter = {
  name: 'Codex',

  async install(projectDir: string, contentDir: string) {
    const targetFile = path.join(projectDir, 'AGENTS.md');
    const combined = combineContentFiles(contentDir);
    const existing = fs.existsSync(targetFile)
      ? fs.readFileSync(targetFile, 'utf-8')
      : '';

    fs.writeFileSync(targetFile, mergeWithMarkers(existing, combined));
  },
};

import fs from 'node:fs';
import path from 'node:path';
import type { Adapter } from './types.js';

export const claudeAdapter: Adapter = {
  name: 'Claude Code',

  async install(projectDir: string, contentDir: string) {
    const targetDir = path.join(projectDir, '.claude', 'commands', 'inblog');
    fs.mkdirSync(targetDir, { recursive: true });

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      fs.copyFileSync(
        path.join(contentDir, file),
        path.join(targetDir, file),
      );
    }
  },
};

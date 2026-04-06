import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Adapter } from './types.js';

function parseFrontmatterName(content: string): string | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  const nameMatch = match[1].match(/^name:\s*(.+)$/m);
  if (!nameMatch) return null;
  return nameMatch[1].trim().replace(/^["']|["']$/g, '');
}

export const coworkAdapter: Adapter = {
  name: 'Claude Cowork',

  async install(_projectDir: string, contentDir: string) {
    const home = os.homedir();
    const agentsSkillsDir = path.join(home, '.agents', 'skills');
    const claudeSkillsDir = path.join(home, '.claude', 'skills');

    fs.mkdirSync(agentsSkillsDir, { recursive: true });
    fs.mkdirSync(claudeSkillsDir, { recursive: true });

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const name = parseFrontmatterName(content);

      if (!name) {
        continue;
      }

      // Create ~/.agents/skills/<name>/ and copy file as SKILL.md
      const skillDir = path.join(agentsSkillsDir, name);
      fs.mkdirSync(skillDir, { recursive: true });
      fs.copyFileSync(filePath, path.join(skillDir, 'SKILL.md'));

      // Create symlink at ~/.claude/skills/<name> -> ~/.agents/skills/<name>/
      const symlinkPath = path.join(claudeSkillsDir, name);
      try {
        const stat = fs.lstatSync(symlinkPath);
        if (stat) {
          fs.rmSync(symlinkPath, { recursive: true });
        }
      } catch {
        // doesn't exist, that's fine
      }
      fs.symlinkSync(skillDir, symlinkPath, 'dir');
    }
  },
};

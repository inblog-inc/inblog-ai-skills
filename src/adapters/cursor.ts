import fs from 'node:fs';
import path from 'node:path';
import type { Adapter } from './types.js';

function parseFrontmatter(content: string): { description: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { description: '', body: content };

  const frontmatter = match[1];
  const descMatch = frontmatter.match(/description:\s*"?([^"\n]+)"?/);
  const description = descMatch ? descMatch[1].trim() : '';
  const body = content.slice(match[0].length);

  return { description, body };
}

function toMdc(content: string): string {
  const { description, body } = parseFrontmatter(content);
  const header = [
    '---',
    `description: "${description}"`,
    'globs: ',
    'alwaysApply: false',
    '---',
    '',
  ].join('\n');
  return header + body;
}

export const cursorAdapter: Adapter = {
  name: 'Cursor',

  async install(projectDir: string, contentDir: string) {
    const targetDir = path.join(projectDir, '.cursor', 'rules');
    fs.mkdirSync(targetDir, { recursive: true });

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const name = path.basename(file, '.md');
      const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
      fs.writeFileSync(
        path.join(targetDir, `inblog-${name}.mdc`),
        toMdc(content),
      );
    }
  },
};

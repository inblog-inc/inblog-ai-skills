import fs from 'node:fs';
import path from 'node:path';

const MARKER_START = '<!-- inblog:start -->';
const MARKER_END = '<!-- inblog:end -->';

export function mergeWithMarkers(existing: string, newBlock: string): string {
  const startIdx = existing.indexOf(MARKER_START);
  const endIdx = existing.indexOf(MARKER_END);

  const block = `${MARKER_START}\n${newBlock}\n${MARKER_END}`;

  if (startIdx !== -1 && endIdx !== -1) {
    return existing.slice(0, startIdx) + block + existing.slice(endIdx + MARKER_END.length);
  }

  const separator = existing.length > 0 && !existing.endsWith('\n') ? '\n\n' : existing.length > 0 ? '\n' : '';
  return existing + separator + block + '\n';
}

export function combineContentFiles(contentDir: string): string {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md')).sort();
  const sections: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    sections.push(content);
  }

  return sections.join('\n\n---\n\n');
}

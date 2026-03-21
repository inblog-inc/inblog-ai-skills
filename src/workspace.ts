import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

export interface ScaffoldResult {
  path: string;
  created: boolean;
}

/**
 * Scaffolds the .inblog/ workspace directory.
 * Idempotent — safe to call multiple times.
 */
export function scaffoldWorkspace(projectDir: string): ScaffoldResult {
  const inblogDir = join(resolve(projectDir), '.inblog');
  const assetsDir = join(inblogDir, 'assets');

  const alreadyExisted = existsSync(inblogDir);

  // Create directories (recursive = idempotent)
  mkdirSync(inblogDir, { recursive: true });
  mkdirSync(assetsDir, { recursive: true });

  // Create .gitkeep in assets/
  const gitkeepPath = join(assetsDir, '.gitkeep');
  if (!existsSync(gitkeepPath)) {
    writeFileSync(gitkeepPath, '');
  }

  // Create .gitignore to protect secrets
  const gitignorePath = join(inblogDir, '.gitignore');
  if (!existsSync(gitignorePath)) {
    writeFileSync(gitignorePath, [
      '# API keys and credentials — never commit',
      'config.json',
      '',
    ].join('\n'), 'utf-8');
  }

  // Create config.json with empty structure
  const configPath = join(inblogDir, 'config.json');
  if (!existsSync(configPath)) {
    writeFileSync(configPath, JSON.stringify({
      dataforseo: { login: '', password: '' },
      gemini: { apiKey: '' },
    }, null, 2) + '\n', 'utf-8');
  }

  // Write README only if it doesn't exist
  const readmePath = join(inblogDir, 'README.md');
  if (!existsSync(readmePath)) {
    const readmeContent = getScaffoldTemplate('README.md');
    writeFileSync(readmePath, readmeContent, 'utf-8');
  }

  return {
    path: inblogDir,
    created: !alreadyExisted,
  };
}

/**
 * Reads a bundled scaffold template file.
 */
function getScaffoldTemplate(filename: string): string {
  const candidates = [
    join(__dirname, '..', 'scaffold', filename),
    join(__dirname, '..', '..', 'scaffold', filename),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readFileSync(candidate, 'utf-8');
    }
  }

  // Fallback: inline minimal README
  if (filename === 'README.md') {
    return [
      '# .inblog/ Workspace',
      '',
      'This directory is managed by @inblog/ai-skills.',
      'It stores persistent context that AI skills use to produce better content.',
      '',
      '## config.json',
      '',
      'Store API keys for external services (DataForSEO, Gemini, etc.).',
      'This file is git-ignored by .inblog/.gitignore.',
      '',
    ].join('\n');
  }

  throw new Error(`Scaffold template not found: ${filename}`);
}

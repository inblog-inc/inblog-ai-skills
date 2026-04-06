import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export interface DetectedTool {
  name: 'claude' | 'cursor' | 'copilot' | 'codex' | 'gemini' | 'cowork';
  label: string;
  detected: boolean;
}

export function detectTools(projectDir: string): DetectedTool[] {
  return [
    {
      name: 'claude',
      label: 'Claude Code',
      detected: fs.existsSync(path.join(projectDir, '.claude')),
    },
    {
      name: 'cursor',
      label: 'Cursor',
      detected: fs.existsSync(path.join(projectDir, '.cursor')),
    },
    {
      name: 'copilot',
      label: 'GitHub Copilot',
      detected: fs.existsSync(path.join(projectDir, '.github')),
    },
    {
      name: 'codex',
      label: 'Codex',
      detected: detectCodex(projectDir),
    },
    {
      name: 'gemini',
      label: 'Gemini CLI',
      detected: fs.existsSync(path.join(projectDir, 'GEMINI.md')),
    },
    {
      name: 'cowork',
      label: 'Claude Cowork',
      detected: fs.existsSync(path.join(os.homedir(), '.agents', 'skills')) || fs.existsSync('/Applications/Claude.app'),
    },
  ];
}

function detectCodex(projectDir: string): boolean {
  if (fs.existsSync(path.join(projectDir, 'AGENTS.md'))) {
    return true;
  }

  try {
    const pkgPath = path.join(projectDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      return '@openai/codex' in allDeps;
    }
  } catch {
    // ignore parse errors
  }

  return false;
}

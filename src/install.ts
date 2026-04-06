import path from 'node:path';
import type { Adapter } from './adapters/types.js';
import { claudeAdapter } from './adapters/claude.js';
import { cursorAdapter } from './adapters/cursor.js';
import { copilotAdapter } from './adapters/copilot.js';
import { codexAdapter } from './adapters/codex.js';
import { geminiAdapter } from './adapters/gemini.js';
import { coworkAdapter } from './adapters/cowork.js';

const adapterMap: Record<string, Adapter> = {
  claude: claudeAdapter,
  cursor: cursorAdapter,
  copilot: copilotAdapter,
  codex: codexAdapter,
  gemini: geminiAdapter,
  cowork: coworkAdapter,
};

export async function installForTools(
  projectDir: string,
  tools: string[],
): Promise<{ tool: string; success: boolean; error?: string }[]> {
  const contentDir = path.resolve(__dirname, '..', '..', 'content');
  const results: { tool: string; success: boolean; error?: string }[] = [];

  for (const tool of tools) {
    const adapter = adapterMap[tool];
    if (!adapter) {
      results.push({ tool, success: false, error: `Unknown tool: ${tool}` });
      continue;
    }

    try {
      await adapter.install(projectDir, contentDir);
      results.push({ tool, success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ tool, success: false, error: message });
    }
  }

  return results;
}

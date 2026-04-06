import { checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import { detectTools } from '../src/detect.js';
import { installForTools } from '../src/install.js';
import { ensureCli } from '../src/cli-install.js';
import { scaffoldWorkspace } from '../src/workspace.js';

const ALL_TOOLS = ['claude', 'cursor', 'copilot', 'codex', 'gemini', 'cowork'] as const;

async function main() {
  const projectDir = process.cwd();
  const args = process.argv.slice(2);

  console.log(chalk.bold('\n@inblog/ai-skills — AI tool setup\n'));

  let selectedTools: string[];

  if (args.includes('--all')) {
    selectedTools = [...ALL_TOOLS];
    console.log(chalk.dim('Installing for all tools...\n'));
  } else if (args.includes('--tools')) {
    const toolsIdx = args.indexOf('--tools');
    const toolsArg = args[toolsIdx + 1];
    if (!toolsArg) {
      console.error(chalk.red('--tools requires a comma-separated list (e.g. --tools claude,cursor)'));
      process.exit(1);
    }
    selectedTools = toolsArg.split(',').map(t => t.trim());
    const invalid = selectedTools.filter(t => !ALL_TOOLS.includes(t as any));
    if (invalid.length > 0) {
      console.error(chalk.red(`Unknown tools: ${invalid.join(', ')}`));
      console.error(chalk.dim(`Available: ${ALL_TOOLS.join(', ')}`));
      process.exit(1);
    }
    console.log(chalk.dim(`Installing for: ${selectedTools.join(', ')}\n`));
  } else {
    const detected = detectTools(projectDir);
    selectedTools = await checkbox({
      message: 'Select AI tools to set up:',
      choices: detected.map(tool => ({
        name: `${tool.label}${tool.detected ? chalk.green(' (detected)') : ''}`,
        value: tool.name,
        checked: tool.detected,
      })),
    });

    if (selectedTools.length === 0) {
      console.log(chalk.yellow('No tools selected. Exiting.'));
      process.exit(0);
    }

    console.log();
  }

  const results = await installForTools(projectDir, selectedTools);

  console.log(chalk.bold('Results:\n'));
  for (const result of results) {
    if (result.success) {
      console.log(chalk.green(`  ✓ ${result.tool}`));
    } else {
      console.log(chalk.red(`  ✗ ${result.tool}: ${result.error}`));
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(chalk.dim(`\n  ${successCount}/${results.length} tools configured.\n`));

  // Scaffold .inblog/ workspace
  console.log(chalk.dim('Setting up .inblog/ workspace...'));
  const workspace = scaffoldWorkspace(projectDir);
  if (workspace.created) {
    console.log(chalk.green('  ✓ .inblog/ workspace created'));
  } else {
    console.log(chalk.dim('  ✓ .inblog/ workspace (already exists)'));
  }
  console.log();

  // CLI install step
  console.log(chalk.dim('Checking @inblog/cli...'));
  const cliResult = await ensureCli();
  if (cliResult.action === 'installed') {
    console.log(chalk.green(`  ✓ @inblog/cli installed (v${cliResult.version})`));
  } else if (cliResult.action === 'updated') {
    console.log(chalk.green(`  ✓ @inblog/cli updated to v${cliResult.version}`));
  } else if (cliResult.action === 'already_installed') {
    console.log(chalk.dim(`  ✓ @inblog/cli v${cliResult.version} (up to date)`));
  } else {
    console.log(chalk.yellow(`  ⚠ Could not install @inblog/cli. Run: npm install -g @inblog/cli`));
  }
}

main().catch(err => {
  console.error(chalk.red(err.message));
  process.exit(1);
});

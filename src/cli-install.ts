import { execSync } from 'node:child_process';

/**
 * Check if @inblog/cli is installed globally and install/update if needed.
 * Returns: { installed: boolean; version: string | null; action: 'already_installed' | 'installed' | 'updated' | 'skipped' }
 */
export async function ensureCli(): Promise<{
  installed: boolean;
  version: string | null;
  action: 'already_installed' | 'installed' | 'updated' | 'skipped';
}> {
  const currentVersion = getInstalledVersion();

  if (currentVersion) {
    const latestVersion = getLatestVersion();
    if (latestVersion && latestVersion !== currentVersion) {
      try {
        execSync('npm install -g @inblog/cli@latest', { stdio: 'pipe' });
        const newVersion = getInstalledVersion();
        return { installed: true, version: newVersion, action: 'updated' };
      } catch {
        return { installed: true, version: currentVersion, action: 'already_installed' };
      }
    }
    return { installed: true, version: currentVersion, action: 'already_installed' };
  }

  // Not installed — install it
  try {
    execSync('npm install -g @inblog/cli@latest', { stdio: 'pipe' });
    const version = getInstalledVersion();
    return { installed: true, version, action: 'installed' };
  } catch {
    return { installed: false, version: null, action: 'skipped' };
  }
}

function getInstalledVersion(): string | null {
  try {
    const output = execSync('inblog --version', { stdio: 'pipe', encoding: 'utf-8' });
    return output.trim();
  } catch {
    return null;
  }
}

function getLatestVersion(): string | null {
  try {
    const output = execSync('npm view @inblog/cli version', { stdio: 'pipe', encoding: 'utf-8' });
    return output.trim();
  } catch {
    return null;
  }
}

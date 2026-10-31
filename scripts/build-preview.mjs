// Keep the draft-preview build identical on Windows and POSIX shells.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const result = spawnSync(process.execPath, [cli, 'build'], {
  env: { ...process.env, SHOW_DRAFTS: 'true' }, stdio: 'inherit',
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);

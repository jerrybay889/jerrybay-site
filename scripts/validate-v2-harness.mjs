import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifestPath = resolve(root, 'v2/content-source-map.json');
const requiredRoutes = [
  '/',
  '/capabilities',
  '/ideas-lab',
  '/work',
  '/collaborate',
  '/about',
  '/contact',
  '/privacy'
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

if (!existsSync(manifestPath)) {
  fail('v2/content-source-map.json is missing.');
} else {
  const manifest = readJson(manifestPath);
  const routes = new Set(manifest.routeContract || []);
  const missingRoutes = requiredRoutes.filter((route) => !routes.has(route));
  if (missingRoutes.length) fail(`Missing route contract: ${missingRoutes.join(', ')}`);
  if ((manifest.sources || []).length < 10) fail('Source map is incomplete.');
  if (!(manifest.sources || []).some((source) => source.authority === 'highest')) {
    fail('Canonical source is not marked as highest authority.');
  }
}

const flagIndex = process.argv.indexOf('--build-pack');
if (flagIndex !== -1) {
  const buildPackPath = resolve(root, process.argv[flagIndex + 1] || '');
  if (!existsSync(buildPackPath)) {
    fail(`Build Pack not found: ${buildPackPath}`);
  } else {
    const pack = readJson(buildPackPath);
    const approval = pack.ownerApproval || {};
    for (const key of ['content', 'claims', 'contactRoute']) {
      if (approval[key] !== true) fail(`Owner approval required for ${key}.`);
    }
    for (const key of ['capabilities', 'stories', 'ideas', 'work', 'collaborationPaths']) {
      if (!Array.isArray(pack[key])) fail(`Build Pack field must be an array: ${key}.`);
    }
    if ((pack.capabilities || []).length < 5) fail('At least five capabilities are required.');
    if ((pack.stories || []).length < 4) fail('At least four capability stories are required.');
    if ((pack.ideas || []).length < 5) fail('At least five ideas are required.');
    if ((pack.work || []).length < 5) fail('At least five work items are required.');
    const allowed = new Set(readJson(manifestPath).allowedStatuses);
    for (const group of ['stories', 'ideas', 'work']) {
      for (const item of pack[group] || []) {
        if (!allowed.has(item.status)) fail(`${group} item has invalid status: ${item.title || '(untitled)'}`);
        if (!item.claimBoundary) fail(`${group} item needs a claimBoundary: ${item.title || '(untitled)'}`);
      }
    }
  }
}

if (!process.exitCode) {
  console.log('PASS: JERRYBAY v2 harness contract is valid.');
}

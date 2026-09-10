import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
const accountScript = readFileSync(join(root, 'panel', 'meowtopia_account.js'), 'utf8');
const style = readFileSync(join(root, 'css', 'style.css'), 'utf8');

assert.match(
  indexHtml,
  /<button[^>]*id="home-tutorial-help"[^>]*class="[^"]*\bhome-tutorial-help\b[^"]*\btutorial-help-button\b[^"]*"[^>]*>\?<\/button>/,
  'home player bar uses the in-level tutorial help button style'
);
assert.doesNotMatch(
  indexHtml,
  /class="[^"]*\btutorial-home-help\b[^"]*"[\s\S]*href="level-1\.html\?tutorial=1"/,
  'home help does not navigate to level 1'
);
assert.match(
  indexHtml,
  /id="home-tutorial-modal"[\s\S]*class="[^"]*\btutorial-modal\b[^"]*\bhome-tutorial-modal\b/,
  'home page owns its tutorial modal'
);
assert.match(
  indexHtml,
  /homeTutorialHelp\?\.addEventListener\('click'[\s\S]*setHomeTutorialOpen\(true\)/,
  'home help opens the home tutorial modal in place'
);
assert.match(
  indexHtml,
  /homeTutorialOk\?\.addEventListener\('click'[\s\S]*setHomeTutorialOpen\(false\)/,
  'home tutorial OK button closes the modal'
);

assert.match(
  accountScript,
  /<button[^>]*class="[^"]*\baccount-tutorial-help\b[^"]*\btutorial-help-button\b[^"]*"[^>]*>\?<\/button>/,
  'dynamic account card also uses a non-navigating tutorial button'
);
assert.doesNotMatch(
  accountScript,
  /class="[^"]*\baccount-tutorial-help\b[^"]*"[\s\S]*href="level-1\.html\?tutorial=1"/,
  'dynamic account help does not navigate to level 1'
);

assert.match(style, /\.home-tutorial-help\b/, 'home help button has cover-specific placement overrides');
assert.match(style, /\.home-tutorial-help:hover\b[\s\S]*transform:\s*translateY\(-1px\)/, 'home help hover keeps the in-level lift without the level topbar offset');
assert.match(style, /\.account-tutorial-help\.tutorial-help-button\b/, 'account help reuses tutorial-help-button visual rules with placement overrides');

console.log('Home tutorial help checks passed.');

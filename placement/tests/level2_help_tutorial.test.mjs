import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const level2Html = readFileSync(join(root, 'level-2.html'), 'utf8');
const mapModel = readFileSync(join(root, 'panel', 'map_model.js'), 'utf8');

assert.match(
  level2Html,
  /<body[^>]*data-pro-tutorial="true"/,
  'level 2 still registers the pro tutorial for the help button'
);

assert.match(
  mapModel,
  /function startProModeTutorialFromHelp\(\)[\s\S]*setProModeGuideActive\(true\)/,
  'pro tutorial can be started from the help button'
);

assert.match(
  mapModel,
  /tutorialHelpButton\?\.addEventListener\('click'[\s\S]*isLevelTwoProGuideEnabled\(\)[\s\S]*startProModeTutorialFromHelp\(\)/,
  'level 2 help button starts the interaction tutorial'
);

assert.doesNotMatch(
  mapModel,
  /if \(!tutorialModal\) \{\s*if \(isProModeTutorial && !hasCompletedProModeIntro\) \{\s*setProModeGuideActive\(true\);/,
  'level 2 pro tutorial no longer starts automatically on page load'
);

assert.match(
  mapModel,
  /if \(!tutorialModal\) \{\s*startMissionTimer\(\);\s*\}/,
  'levels without an opening modal start normally'
);

console.log('Level 2 help tutorial checks passed.');

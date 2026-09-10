import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const mapModel = readFileSync(join(root, 'panel', 'map_model.js'), 'utf8');
const style = readFileSync(join(root, 'css', 'style.css'), 'utf8');

assert.match(mapModel, /function renderTutorialFishCell/, 'tutorials share a dynamic fish cell renderer');
assert.match(mapModel, /function renderTutorialCatCell/, 'tutorials share a dynamic cat cell renderer');
assert.match(mapModel, /function renderTutorialWallBoard/, 'level 5 wall tutorial renders from current cat and fish skins');
assert.match(mapModel, /function renderTutorialThresholdBoard/, 'level 9 threshold tutorial renders from current cat and fish skins');
assert.match(mapModel, /function renderTutorialRelayBoard/, 'level 13 relay tutorial renders from current cat and fish skins');

assert.doesNotMatch(mapModel, /tutorial-wall-open\.png|tutorial-wall-blocked\.png/, 'level 5 tutorial does not use fixed wall screenshots');
assert.doesNotMatch(mapModel, /\.\/image\/3-[1-4]\.png/, 'level 9 tutorial does not use fixed color lesson screenshots');
assert.doesNotMatch(mapModel, /tutorial-relay-(disconnected|connected)\.png/, 'level 13 tutorial does not use fixed relay screenshots');

assert.match(mapModel, /function renderTutorialFishCell[\s\S]*fishSkin\.(idle|eaten)/, 'dynamic fish cells read the active fish skin');
assert.match(mapModel, /function renderTutorialCatCell[\s\S]*catSkin\.map/, 'dynamic cat cells read the active cat skin');
assert.match(mapModel, /renderTutorialWallBoard\(\{ withWall: false \}\)/, 'wall lesson uses dynamic no-wall board');
assert.match(mapModel, /renderTutorialWallBoard\(\{ withWall: true \}\)/, 'wall lesson uses dynamic with-wall board');
assert.match(mapModel, /renderTutorialThresholdBoard\('hard'\)/, 'threshold lesson uses dynamic hard-target board');
assert.match(mapModel, /renderTutorialThresholdBoard\('far'\)/, 'threshold lesson uses dynamic far-away board');
assert.match(mapModel, /renderTutorialRelayBoard\(\{ linked: false \}\)/, 'relay lesson uses dynamic no-link board');
assert.match(mapModel, /renderTutorialRelayBoard\(\{ linked: true \}\)/, 'relay lesson uses dynamic linked board');

assert.match(style, /\.tutorial-dynamic-board\b/, 'dynamic tutorial boards have shared styles');
assert.match(style, /\.tutorial-link-line\b/, 'relay tutorial draws its link without a static image');
assert.match(style, /\.tutorial-mini-cell\.tier-red\b/, 'threshold tutorial has a red harder-target cell style');

console.log('Dynamic tutorial skin checks passed.');

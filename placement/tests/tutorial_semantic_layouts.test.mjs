import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const mapModel = readFileSync(join(root, 'panel', 'map_model.js'), 'utf8');
const style = readFileSync(join(root, 'css', 'style.css'), 'utf8');

function extractConst(name) {
  const match = mapModel.match(new RegExp(`const ${name} = ([\\s\\S]*?);\\n`));
  assert.ok(match, `${name} is defined as tutorial source data`);
  return vm.runInNewContext(`(${match[1]})`);
}

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

const wallOpenBlockedPositions = Array.from(extractConst('tutorialWallOpenBlockedPositions'));
assert.deepEqual(
  wallOpenBlockedPositions,
  [4, 24],
  'level 5 no-wall lesson keeps only the two far corner targets unsatisfied'
);

const thresholdLayouts = toPlainValue(extractConst('tutorialThresholdLayouts'));
assert.deepEqual(thresholdLayouts.hard, [
  ['yellow', 'yellow', 'yellow', 'yellow', 'yellow'],
  ['yellow', 'orange', 'orange', 'orange', 'yellow'],
  ['yellow', 'orange', 'red', 'orange', 'yellow'],
  ['yellow', 'orange', 'orange', 'orange', 'yellow'],
  ['yellow', 'yellow', 'yellow', 'yellow', 'yellow']
], 'level 9 first board matches the original red-threshold color map');

assert.deepEqual(thresholdLayouts.far, [
  ['green', 'green', 'yellow', 'yellow', 'yellow'],
  ['green', 'green', 'orange', 'orange', 'yellow'],
  ['cat', 'green', 'red', 'orange', 'yellow'],
  ['green', 'green', 'orange', 'orange', 'yellow'],
  ['green', 'green', 'yellow', 'yellow', 'yellow']
], 'level 9 too-far board keeps the sensor and unsatisfied colors in their original cells');

assert.deepEqual(thresholdLayouts.close, [
  ['green', 'green', 'green', 'green', 'yellow'],
  ['green', 'green', 'green', 'green', 'green'],
  ['green', 'cat', 'green', 'orange', 'yellow'],
  ['green', 'green', 'green', 'green', 'green'],
  ['green', 'green', 'green', 'green', 'yellow']
], 'level 9 move-closer board keeps the sensor and remaining unsatisfied colors in their original cells');

assert.deepEqual(thresholdLayouts.more, [
  ['green', 'green', 'green', 'green', 'green'],
  ['green', 'green', 'green', 'green', 'green'],
  ['cat', 'green', 'green', 'green', 'cat'],
  ['green', 'green', 'green', 'green', 'green'],
  ['green', 'green', 'green', 'green', 'green']
], 'level 9 add-more board keeps both sensors in the original cells');

const relayLayouts = toPlainValue(extractConst('tutorialRelayLayouts'));
assert.deepEqual(relayLayouts.disconnected, {
  catIndex: 0,
  hubIndex: 20,
  linked: false
}, 'level 13 no-link board keeps the inactive sensor at the top-left and hub at the bottom-left');
assert.deepEqual(relayLayouts.connected, {
  catIndex: 12,
  hubIndex: 20,
  linked: true
}, 'level 13 linked board keeps the active sensor in the center and hub at the bottom-left');

const legacyWallImageOverrideIndex = style.indexOf('.tutorial-wall-board .tutorial-mini-cell:has(img[src*="fish.png"])');
const dynamicWallCoveredOverrideIndex = style.indexOf('.tutorial-wall-board.tutorial-dynamic-board .tutorial-mini-cell.is-covered');
const dynamicWallBlockedOverrideIndex = style.indexOf('.tutorial-wall-board.tutorial-dynamic-board .tutorial-mini-cell.is-blocked');
assert.ok(legacyWallImageOverrideIndex >= 0, 'legacy wall image color rule still exists');
assert.ok(
  dynamicWallCoveredOverrideIndex > legacyWallImageOverrideIndex,
  'dynamic wall tutorial covered cells keep the original green satisfaction color'
);
assert.ok(
  dynamicWallBlockedOverrideIndex > legacyWallImageOverrideIndex,
  'dynamic wall tutorial blocked cells keep the original pink unsatisfied color'
);

console.log('Tutorial semantic layout checks passed.');

import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
const skinPicker = readFileSync(join(root, 'panel', 'skin_picker.js'), 'utf8');
const accountScript = readFileSync(join(root, 'panel', 'meowtopia_account.js'), 'utf8');
const mapModel = readFileSync(join(root, 'panel', 'map_model.js'), 'utf8');
const style = [
  readFileSync(join(root, 'css', 'style.css'), 'utf8'),
  readFileSync(join(root, 'panel', 'map_model_style.css'), 'utf8')
].join('\n');
const sourceFiles = [skinPicker, mapModel].join('\n');

assert.match(indexHtml, /id="home-tutorial-help"[\s\S]*class="[^"]*\bhome-tutorial-help\b[^"]*\btutorial-help-button\b/, 'home fallback player bar exposes an in-place tutorial help button');
assert.doesNotMatch(indexHtml, /class="[^"]*\btutorial-home-help\b[^"]*"[\s\S]*href="level-1\.html\?tutorial=1"/, 'home tutorial help no longer navigates to level 1');
assert.match(accountScript, /class="[^"]*\baccount-tutorial-help\b[^"]*\btutorial-help-button\b/, 'dynamic account profile card exposes an in-place tutorial help button');
assert.doesNotMatch(accountScript, /class="[^"]*\baccount-tutorial-help\b[^"]*"[\s\S]*href="level-1\.html\?tutorial=1"/, 'dynamic account tutorial help no longer navigates to level 1');
assert.match(style, /\.account-tutorial-help\.tutorial-help-button\b/, 'stylesheet contains account tutorial help placement overrides');

assert.match(skinPicker, /id:\s*'pikachu'[\s\S]*Electric Energy/, 'skin picker exposes an electric target option');
assert.doesNotMatch(skinPicker, /Pikachu Fish/, 'Pikachu target option is not still presented as a fish');
assert.match(skinPicker, /id:\s*'pikachu'[\s\S]*Pikachu/, 'skin picker exposes a Pikachu cat option');
assert.match(skinPicker, /sessionStorage\.getItem\(storageKey\)/, 'home skin picker reads skin choices from session storage');
assert.match(skinPicker, /sessionStorage\.setItem\(storageKey/, 'home skin picker saves skin choices only for the current session');
assert.doesNotMatch(skinPicker, /localStorage\.(getItem|setItem)\(storageKey/, 'home skin picker does not persist Pikachu as the next launch default');
assert.match(mapModel, /pikachu:\s*{[\s\S]*name:\s*'Pikachu'/, 'map model registers Pikachu skin assets');
assert.match(mapModel, /prey:\s*'Electric Energy'/, 'Pikachu theme uses electric energy instead of fish language');
assert.match(mapModel, /sessionStorage\.getItem\(skinStorageKey\)/, 'level pages read skin choices from session storage');
assert.doesNotMatch(mapModel, /localStorage\.getItem\(skinStorageKey\)/, 'level pages do not load stale Pikachu choices from local storage');
assert.match(mapModel, /completeTitle:\s*'Pika Pika! Full Charge!'/, 'Pikachu completion title uses shorter themed wording');
assert.match(mapModel, /completeMessage:\s*'Every spark is charged and ready!'/, 'Pikachu completion message uses themed wording');
assert.match(mapModel, /sound:\s*'electric'/, 'Pikachu electric energy uses an electric sound');
assert.match(mapModel, /lightningBurstFrames/, 'Pikachu electric energy has lightning burst frames');
assert.match(mapModel, /runElectricChargeAnimation/, 'Pikachu electric energy uses a dedicated lightning animation');
assert.doesNotMatch(mapModel, /electric-burst-edge-(left|right|top|bottom)/, 'Pikachu lightning does not shift bursts away from their target cells');
assert.match(mapModel, /electric-bursting/, 'Pikachu lightning raises the animated cell above neighboring cells');
assert.match(mapModel, /translateY\(var\(--connection-line-center-offset,\s*0\)\)/, 'connection lines can be vertically centered when skins make them thicker');
assert.match(mapModel, /buildPikachuLightningPath/, 'Pikachu connections build a real segmented lightning path');
assert.match(mapModel, /pikachu-lightning-segment/, 'Pikachu connections render visible zigzag lightning segments');
assert.match(mapModel, /pikachu-lightning-branch/, 'Pikachu connections add small branch arcs so short links read as thunder');
assert.match(mapModel, /--pikachu-segment-rotate/, 'Pikachu lightning segments use their own angles instead of one straight clipped line');
assert.doesNotMatch(mapModel, /electric-burst-active/, 'Pikachu lightning does not trigger a board-level flash');
assert.match(mapModel, /playElectricSequence/, 'Pikachu electric energy plays a lightning sound sequence');
assert.match(mapModel, /clipDurationMs\s*=\s*Math\.min\(3400/, 'Pikachu lightning sound keeps the full thunder tail instead of cutting off early');
assert.match(mapModel, /document\.body\.classList\.toggle\('pikachu-theme'/, 'map model toggles Pikachu theme');
assert.match(style, /\.pikachu-theme\b/, 'stylesheet contains Pikachu theme rules');
assert.match(style, /\.completion-card h2[\s\S]*white-space:\s*normal/, 'completion title can wrap inside the modal');
assert.match(style, /\.completion-card h2[\s\S]*overflow-wrap:\s*anywhere/, 'completion title avoids overflowing its frame');
assert.match(style, /\.pikachu-theme \.completion-card h2[\s\S]*font-size:\s*clamp\(1\.35rem,\s*4vw,\s*2\.05rem\)/, 'Pikachu completion title gets a compact themed scale');
assert.match(style, /\.pikachu-theme \.skin-picker-open img[\s\S]*width:\s*64px[\s\S]*height:\s*64px/, 'Pikachu picker button image is constrained inside its frame');
assert.match(style, /\.skin-picker-open[\s\S]*overflow:\s*hidden/, 'skin picker button clips any image edge inside the frame');
assert.match(style, /\.electric-burst-layer\b/, 'stylesheet contains electric burst effect rules');
assert.match(style, /\.grid-cell\.electric-bursting\b[\s\S]*z-index:\s*12/, 'animated electric cells stack above neighboring cells');
assert.match(style, /\.electric-burst-layer\b[\s\S]*left:\s*50%[\s\S]*top:\s*50%/, 'electric burst layer is anchored to the center of its target cell');
assert.match(style, /translate\(-50%,\s*-50%\)\s*scale/, 'electric burst animation keeps the burst centered while scaling');
assert.doesNotMatch(style, /--electric-burst-shift-[xy]/, 'electric burst styling does not offset edge cells away from center');
assert.doesNotMatch(style, /\.clickable-box\.electric-burst-active::after\b/, 'stylesheet does not keep board-level electric flash rules');
assert.match(style, /mix-blend-mode:\s*normal/, 'electric burst stays high-contrast on yellow backgrounds');
assert.match(style, /contrast\(1\.55\)/, 'electric burst receives extra contrast for yellow Pikachu backgrounds');
assert.match(style, /255,\s*216,\s*0/, 'electric burst styling keeps a yellow lightning base');
assert.match(style, /255,\s*126,\s*0/, 'electric burst styling adds warm orange separation for yellow lightning');
assert.match(style, /width:\s*230%[\s\S]*height:\s*230%/, 'electric burst remains large enough to read clearly around the target');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.connection-line\.game-connection-line\b[\s\S]*clip-path:\s*polygon/, 'Pikachu active connections use a jagged lightning silhouette');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.connection-line\.inactive-connection-line\b[\s\S]*clip-path:\s*polygon/, 'Pikachu inactive connections still use a jagged lightning silhouette');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.connection-line\.pikachu-lightning-path\b[\s\S]*background:\s*transparent/, 'Pikachu connection container becomes transparent around the segmented lightning');
assert.match(style, /\.pikachu-lightning-segment\b[\s\S]*background:\s*#2f2425/, 'Pikachu lightning segments have a strong dark outline');
assert.match(style, /\.pikachu-lightning-segment::before\b[\s\S]*linear-gradient\(90deg,\s*#fffde8[\s\S]*#ffd12f[\s\S]*#ffb300/, 'Pikachu lightning segments use a yellow thunder core');
assert.match(style, /\.pikachu-lightning-branch\b[\s\S]*height:\s*max\(7px[\s\S]*#ffd12f/, 'Pikachu lightning branches are visible yellow arcs');
assert.match(style, /\.pikachu-lightning-spark\b[\s\S]*box-shadow:[\s\S]*255,\s*209,\s*47/, 'Pikachu lightning path adds bright golden spark nodes');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.connection-line\.game-connection-line,[\s\S]*\.pikachu-theme\.cat-game-mode \.connection-line\.inactive-connection-line\s*{[\s\S]*z-index:\s*14/, 'Pikachu lightning connections render above electric energy tiles and burst effects');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.connection-line\.game-connection-line,[\s\S]*height:\s*max\(28px/, 'Pikachu lightning connections are thick enough to stand out over the board');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.connection-line\.game-connection-line,[\s\S]*--connection-line-center-offset:\s*-50%/, 'Pikachu lightning connections stay centered on the sensor-to-sensor path');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.grid-cell\.sensor\b[\s\S]*z-index:\s*16/, 'Pikachu sensor tiles stay above the lightning connection endpoints');
assert.match(style, /6%\s+4%[\s\S]*24%\s+0[\s\S]*42%\s+5%/, 'Pikachu active connections use sharper lightning-bolt points');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.connection-line\.game-connection-line::before\b[\s\S]*background:[\s\S]*#fff36d[\s\S]*#ffd12f[\s\S]*#ffb300/, 'Pikachu active connections have a strongly yellow lightning core');
assert.match(style, /\.pikachu-theme\.cat-game-mode \.connection-line\.game-connection-line\b[\s\S]*drop-shadow\(0 0 0/, 'Pikachu active connections keep a dark outline around the bolt');
assert.match(style, /drop-shadow\(0 0 32px rgba\(255,\s*209,\s*47,\s*1\)\)/, 'Pikachu active connections add a dominant golden glow');
assert.doesNotMatch(style, /drop-shadow\(0 0 18px rgba\(201,\s*245,\s*255,\s*0\.98\)\)/, 'Pikachu active connections no longer make blue-white the main glow');
assert.match(style, /@keyframes pikachu-lightning-flow/, 'Pikachu active connections animate like pulsing electricity');
assert.doesNotMatch(sourceFiles, /pikachu-[a-z0-9-]+\.svg/, 'Pikachu theme does not reference SVG assets');

[
  'image/pikachu-cat.png',
  'image/full-pikachu-cat.png',
  'image/pikachu-energy1.png',
  'image/pikachu-energy2.png',
  'image/pikachu-energy3.png',
  'image/pikachu-energy4.png',
  'image/pikachu-energy5.png',
  'image/pikachu-burst1.png',
  'image/pikachu-burst2.png',
  'image/pikachu-burst3.png',
  'image/pikachu-burst4.png',
  'image/pikachu-burst5.png',
  'image/pikachu-hub.png',
  'audio/lightning-strike.wav'
].forEach(path => {
  assert.ok(existsSync(join(root, path)), `${path} exists`);
  assert.ok(statSync(join(root, path)).size > 1000, `${path} is a real raster asset`);
});

[
  'image/pikachu-burst1.png',
  'image/pikachu-burst2.png',
  'image/pikachu-burst3.png',
  'image/pikachu-burst4.png',
  'image/pikachu-burst5.png'
].forEach(path => {
  assert.ok(statSync(join(root, path)).size > 150000, `${path} has enough bitmap detail for a visible lightning burst`);
});

assert.ok(statSync(join(root, 'audio/lightning-strike.wav')).size > 300000, 'lightning sound is long enough to include thunder rumble');

[
  'image/pikachu-cat.svg',
  'image/full-pikachu-cat.svg',
  'image/pikachu-energy1.svg',
  'image/pikachu-energy2.svg',
  'image/pikachu-energy3.svg',
  'image/pikachu-energy4.svg',
  'image/pikachu-energy5.svg',
  'image/pikachu-hub.svg'
].forEach(path => {
  assert.ok(!existsSync(join(root, path)), `${path} is not kept as a Pikachu asset`);
});

console.log('Pikachu skin/theme checks passed.');

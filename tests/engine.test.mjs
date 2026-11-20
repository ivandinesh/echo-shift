import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const rulesOnly = source.slice(0, source.indexOf('const defaultSave='));
assert.ok(rulesOnly.includes('const LEVELS='), 'Game rules must remain independently testable');
const game = vm.runInNewContext(rulesOnly + ';({LEVELS,DIRS,stepPos,same,posKey})', {});
const { LEVELS, stepPos, same, posKey } = game;

function replay(level, inputs) {
  let p = [...level.startP], e = [...level.startE];
  const queue = [];
  const walls = new Set(level.walls.map(posKey));
  const timeline = [];
  for (const dir of inputs) {
    p = stepPos(p, dir, walls);
    const delayed = queue.length >= 2 ? queue[queue.length - 2] : null;
    if (delayed) e = stepPos(e, delayed, walls);
    queue.push(dir);
    timeline.push({ p: [...p], e: [...e], delayed });
  }
  return { p, e, timeline };
}

test('30 generated levels with valid in-bounds entrances and exits', () => {
  assert.equal(LEVELS.length, 30);
  for (const [i, level] of LEVELS.entries()) {
    assert.equal(level.id, i + 1);
    for (const p of [level.startP, level.startE, level.exitP, level.exitE]) {
      assert.ok(p.every(n => Number.isInteger(n) && n >= 0 && n < 5), 'Out-of-bounds cell');
      assert.ok(!level.walls.some(w => same(w, p)), 'Spawn/exit inside wall');
    }
  }
});

test('each shipped level solution reaches both matching exits without wall collisions', () => {
  for (const level of LEVELS) {
    const result = replay(level, level.solution);
    assert.ok(same(result.p, level.exitP), `Player cannot solve level ${level.id}`);
    assert.ok(same(result.e, level.exitE), `Echo cannot solve level ${level.id}`);
    assert.equal(result.timeline.length, level.par);
    assert.ok(result.timeline.every(t => !level.walls.some(w => same(w,t.p) || same(w,t.e))));
  }
});

test('echo waits two turns and executes the input from exactly two turns ago', () => {
  const level = LEVELS[0];
  const input = ['R', 'D', 'L', 'U', 'R'];
  const out = replay(level, input);
  assert.equal(out.timeline[0].delayed, null);
  assert.equal(out.timeline[1].delayed, null);
  assert.equal(out.timeline[2].delayed, 'R');
  assert.equal(out.timeline[3].delayed, 'D');
  assert.equal(out.timeline[4].delayed, 'L');
  assert.ok(same(out.timeline[0].e, level.startE));
  assert.ok(same(out.timeline[1].e, level.startE));
});

test('wall and boundary blocked moves are safe and still consume a turn', () => {
  const blocked=stepPos([0,0],'U',new Set());
  assert.ok(same(blocked,[0,0]));
  const w=new Set(['0,1']);
  assert.ok(same(stepPos([0,0],'R',w),[0,0]));
  const level=LEVELS[0], seq=['U','U','D'];
  const out=replay(level,seq);
  assert.equal(out.timeline.length,3);
  assert.equal(out.timeline[2].delayed,'U');
});

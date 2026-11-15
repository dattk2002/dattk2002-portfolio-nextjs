import assert from "node:assert/strict";
import test from "node:test";

const { getGazeOffset, getPupilOffsets } = await import("../lib/hero-gaze.ts");

test("a cursor at the illustration center keeps both gaze axes neutral", () => {
  assert.deepEqual(getGazeOffset(200, 100, 200, 100), { x: 0, y: 0 });
});

test("nearby cursor positions produce proportionate gaze in the matching direction", () => {
  assert.deepEqual(getGazeOffset(280, 140, 200, 100), { x: 0.5, y: 0.25 });
  assert.deepEqual(getGazeOffset(120, 60, 200, 100), { x: -0.5, y: -0.25 });
});

test("far-away cursor positions cannot move a pupil outside its eye", () => {
  assert.deepEqual(getGazeOffset(2000, 100, 200, 100), { x: 1, y: 0 });
  assert.deepEqual(getGazeOffset(200, -2000, 200, 100), { x: 0, y: -1 });
  const diagonal = getGazeOffset(1800, 1700, 200, 100);
  assert.ok(Math.abs(diagonal.x - Math.SQRT1_2) < 1e-10);
  assert.ok(Math.abs(diagonal.y - Math.SQRT1_2) < 1e-10);
  assert.ok(Math.hypot(diagonal.x, diagonal.y) <= 1 + 1e-10);
});

test("both eyes share a neutral gaze when the cursor is at their common origin", () => {
  assert.deepEqual(getPupilOffsets(200, 100, 200, 100, [2, 3]), [{ x: 0, y: 0 }, { x: 0, y: 0 }]);
});

test("perspective changes pupil travel without changing the direction of either eye", () => {
  assert.deepEqual(getPupilOffsets(280, 140, 200, 100, [2, 3]), [{ x: 1, y: 0.5 }, { x: 1.5, y: 0.75 }]);
});

test("both pupils remain parallel and bounded in all eight cursor directions", () => {
  for (const [x, y] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const [far, near] = getPupilOffsets(x * 1000, y * 1000, 0, 0, [2, 3]);
    assert.ok(Math.hypot(far.x, far.y) <= 2 + 1e-10);
    assert.ok(Math.hypot(near.x, near.y) <= 3 + 1e-10);
    assert.ok(Math.abs(far.x / 2 - near.x / 3) < 1e-10);
    assert.ok(Math.abs(far.y / 2 - near.y / 3) < 1e-10);
    assert.ok(far.x * x >= 0 && near.x * x >= 0);
    assert.ok(far.y * y >= 0 && near.y * y >= 0);
  }
});

test("the same screen-space pointer movement has the same gaze after scaling the artwork", () => {
  const normal = getPupilOffsets(232, 116, 200, 100, [2, 3], 160);
  const scaled = getPupilOffsets(216, 108, 200, 100, [2, 3], 80);
  assert.deepEqual(scaled, normal);
});

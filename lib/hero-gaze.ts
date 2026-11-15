/** A unit-circle gaze keeps pupils within their eye whites at any cursor distance. */
export function getGazeOffset(cursorX: number, cursorY: number, centerX: number, centerY: number, responseDistance = 160) {
  const x = (cursorX - centerX) / responseDistance;
  const y = (cursorY - centerY) / responseDistance;
  const distance = Math.max(1, Math.hypot(x, y));
  return { x: x / distance, y: y / distance };
}

/** One artwork-space direction for both eyes; perspective affects distance only. */
export function getPupilOffsets(cursorX: number, cursorY: number, centerX: number, centerY: number, travel: readonly number[], responseDistance = 160) {
  const gaze = getGazeOffset(cursorX, cursorY, centerX, centerY, responseDistance);
  return travel.map((distance) => ({ x: gaze.x * distance, y: gaze.y * distance }));
}

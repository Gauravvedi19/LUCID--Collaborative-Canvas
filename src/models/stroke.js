export function createStroke({ userId, color, width, tool }) {
  return {
    id: crypto.randomUUID(),
    userId,
    color,
    width,
    tool,
    points: [],
  };
}

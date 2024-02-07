export type Offset = { x: number; y: number } | [number, number];

export function convertOffsetToTuple(offset: Offset): [number, number] {
  if (Array.isArray(offset)) {
    return offset;
  }
  return [offset.x, offset.y];
}

export function convertOffsetToObject(offset: Offset): { x: number; y: number } {
  if (Array.isArray(offset)) {
    return { x: offset[0], y: offset[1] };
  }
  return offset;
}
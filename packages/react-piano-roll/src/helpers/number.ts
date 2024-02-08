export function ceilToNearestPowerOf(base: number, number: number) {
  let power = 1;
  while (power < number) {
    power *= base;
  }
  return power;
}

export function floorToNearestPowerOf(base: number, number: number): number {
  let power = 1;
  while (power * base <= number) {
    power *= base;
  }
  return power;
}

export function ceilToNearestPowerOfTwo(number: number) {
  return ceilToNearestPowerOf(2, number);
}

export function floorToNearestPowerOfTwo(number: number) {
  return floorToNearestPowerOf(2, number);
}

export function clampTo7BitRange(number: number) {
  return Math.min(127, Math.max(0, number));
}

export function clampTo7BitRangeWithMinOne(number: number) {
  return Math.min(127, Math.max(1, number));
}

export function clampNoteNumber(noteNumber: number) {
  return clampTo7BitRange(noteNumber);
}

export function clampVelocity(velocity: number) {
  return Math.floor(clampTo7BitRangeWithMinOne(velocity));
}

export function clampTick(tick: number) {
  return Math.ceil(tick);
}

export function clampDuration(duration: number) {
  return Math.floor(Math.max(1, duration));
}

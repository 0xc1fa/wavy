export function ceilToNearestPower(base: number, number: number) {
  let power = 1;
  while (power < number) {
    power *= base;
  }
  return power;
}

export function floorToNearestPower(base: number, number: number): number {
  let power = 1;
  while (power * base <= number) {
    power *= base;
  }
  return power;
}

export function ceilToNearestPowerOfTwo(number: number) {
  return ceilToNearestPower(2, number);
}

export function floorToNearestPowerOfTwo(number: number) {
  return floorToNearestPower(2, number);
}

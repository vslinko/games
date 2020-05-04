export function assertNotNull<T>(x: T | null | undefined): asserts x is T {
  if (x == null) {
    throw new Error('Unexpected null');
  }
}

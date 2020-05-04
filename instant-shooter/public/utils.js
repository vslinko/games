export function assertNotNull(x) {
    if (x == null) {
        throw new Error('Unexpected null');
    }
}

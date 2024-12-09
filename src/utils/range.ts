export function range(end: number): number[];
export function range(start: number, end: number): number[];
export function range(startOrEnd: number, end?: number): number[] {
    if (end === undefined) {
        end = startOrEnd;
        startOrEnd = 0;
    }
    return Array.from({ length: end - startOrEnd }, (_, index) => startOrEnd + index);
}

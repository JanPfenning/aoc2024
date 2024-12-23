export const modifiedComparator =
    <T, U>(modifier: (value: T) => U, comparator: (a: U, b: U) => number) =>
    (a: T, b: T): number =>
        comparator(modifier(a), modifier(b));

export const lexicographical = (a: string, b: string): number => a.localeCompare(b);
export const min = (a: number, b: number) => a - b;
export const max = (a: number, b: number) => b - a;

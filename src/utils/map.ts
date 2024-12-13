type NestedArray<T> = (T | NestedArray<T>)[];
export const toNumberNested = <T extends string | NestedArray<string>>(item: T): number | NestedArray<number> => {
    if (typeof item === 'string') {
        return Number(item);
    }
    return item.map(toNumberNested);
};

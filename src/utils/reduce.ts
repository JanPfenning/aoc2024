export const sum = (acc: number, iter: number): number => {
    return acc + iter;
};

export const product = (acc: number, iter: number): number => {
    return acc * iter;
};

export const complexGroup = <T>(equalityFn: (a: T, b: T) => boolean) => {
    return (acc: Record<string, number>, curr: T): Record<string, number> => {
        const key = Object.keys(acc).find((k) => equalityFn(JSON.parse(k), curr)) || JSON.stringify(curr);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    };
};

export const group = complexGroup((a, b) => a === b);

export const batch = <T>(batchSize: number) => {
    return (batches: T[][], item: T, index: number): T[][] => {
        const batchIndex = Math.floor(index / batchSize);
        if (!batches[batchIndex]) {
            batches[batchIndex] = [];
        }
        batches[batchIndex].push(item);
        return batches;
    };
};

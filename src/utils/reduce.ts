export const sum = (acc: number, iter: number): number => {
    return acc + iter;
};

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

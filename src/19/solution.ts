type Design = string;
type Towel = string;
export type PuzzleInput = { towels: Towel[]; designs: Design[] };

export const parseRawData = (input: string): PuzzleInput => {
    const [towels, designs] = input.split(/\n\n/g);
    return { towels: towels.split(/, /g), designs: designs.split(/\n/g) };
};

export const dfs = (accumulator: string, targetDesign: string, towels: PuzzleInput['towels']): boolean => {
    if (accumulator === targetDesign) return true;
    const potentialNewAccumulators = towels.map((towelPattern) => accumulator + towelPattern);
    const validNewAccumulators = potentialNewAccumulators.filter(
        (newAcc) => targetDesign.slice(0, newAcc.length) === newAcc
    );
    return validNewAccumulators.some((validNewAccumulator) => dfs(validNewAccumulator, targetDesign, towels));
};

export const solution = (input: PuzzleInput): string[] => {
    return input.designs.filter((design) => dfs('', design, input.towels));
};

type Arrangement = string;
export const dfsAll = (
    accumulator: Arrangement,
    targetDesign: string,
    towels: PuzzleInput['towels'],
    cache: Record<string, number>
): number => {
    if (accumulator === targetDesign) return 1;
    if (accumulator in cache) return cache[accumulator];

    let count = 0;
    for (const towel of towels) {
        const newAcc = accumulator + towel;
        if (targetDesign.startsWith(newAcc)) {
            count += dfsAll(newAcc, targetDesign, towels, cache);
        }
    }

    cache[accumulator] = count;
    return count;
};

export const solution2 = (input: PuzzleInput): Record<Design, number> => {
    const entries = input.designs.map((design) => [design, dfsAll('', design, input.towels, {})]);
    return Object.fromEntries(entries);
};

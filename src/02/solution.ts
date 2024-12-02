type PuzzleInput = number[][];

export const parseRawData = (data: string): PuzzleInput => {
    const lines = data.split(/\n/);
    const parsed: PuzzleInput = lines.map((line) => line.split(/\s+/).map((char) => +char));
    return parsed;
};

export const isSafe = (line: number[]): boolean => {
    return line.reduce(
        ({ prevDigit, isDecreasing, bool }, iter) => {
            if (!bool) return { bool: false, prevDigit, isDecreasing };
            if (prevDigit === null) return { prevDigit: iter, bool: true, isDecreasing };
            const willBeIsDecreasing = isDecreasing ?? prevDigit > iter;
            return {
                prevDigit: iter,
                isDecreasing: willBeIsDecreasing,
                bool: willBeIsDecreasing ? isSafeDecrease(prevDigit, iter) : isSafeIncrease(prevDigit, iter),
            };
        },
        { bool: true, prevDigit: null, isDecreasing: null } as {
            prevDigit: number | null;
            isDecreasing: boolean | null;
            bool: boolean;
        }
    ).bool;
};

export const isSafeDecrease = (prev: number, curr: number) => {
    if (curr >= prev) return false;
    if (Math.abs(curr - prev) > 3) return false;
    return true;
};

export const isSafeIncrease = (prev: number, curr: number) => {
    if (curr <= prev) return false;
    if (Math.abs(curr - prev) > 3) return false;
    return true;
};

export const getSafeLines = (input: PuzzleInput) => {
    return input.map((line) => isSafe(line));
};

import { readFile } from 'fs/promises';
import { getSafeLines, isSafe, isSafeDecrease, isSafeIncrease, parseRawData } from './solution';

describe('Day 2', () => {
    const exampleInput = [
        [7, 6, 4, 2, 1],
        [1, 2, 7, 8, 9],
        [9, 7, 6, 2, 1],
        [1, 3, 2, 4, 5],
        [8, 6, 4, 4, 1],
        [1, 3, 6, 7, 9],
    ];

    it('should parse input file', async () => {
        const raw = await readFile('src/02/example_input.txt', 'utf8');
        const parsed = parseRawData(raw);

        expect(parsed).toMatchObject(exampleInput);
    });

    it('should get solution for example', () => {
        expect(getSafeLines(exampleInput)).toMatchObject([true, false, false, false, false, true]);
    });

    describe('isSafe', () => {
        const cases = [
            { list: [1, 2, 3, 4, 5], isSafe: true },
            { list: [5, 6, 7], isSafe: true },
            { list: [4, 6, 7], isSafe: true },
            { list: [3, 6, 7], isSafe: true },
            { list: [2, 6, 7], isSafe: false },
        ];
        it.each(cases)('should be safe', ({ list, isSafe: expectedResult }) => {
            expect(isSafe(list)).toBe(expectedResult);
        });
    });

    describe('isSafeDecrease', () => {
        const unsafeDecreases: { prev: number; cur: number }[] = [
            { prev: 1, cur: 1 },
            { prev: 1, cur: 2 },
            { prev: 4, cur: 0 },
        ];

        it.each(unsafeDecreases)('should return false', ({ prev, cur }) => {
            expect(isSafeDecrease(prev, cur)).toBe(false);
        });

        const safeDecreases = [
            { prev: 2, cur: 1 },
            { prev: 3, cur: 1 },
            { prev: 4, cur: 1 },
        ];

        it.each(safeDecreases)('should return true', ({ prev, cur }) => {
            expect(isSafeDecrease(prev, cur)).toBe(true);
        });
    });

    describe('isSafeIncrease', () => {
        const unsafeIncreases: { prev: number; cur: number }[] = [
            { prev: 1, cur: 1 },
            { prev: 2, cur: 1 },
            { prev: 0, cur: 4 },
        ];

        it.each(unsafeIncreases)('should return false', ({ prev, cur }) => {
            expect(isSafeIncrease(prev, cur)).toBe(false);
        });

        const safeIncreases = [
            { prev: 1, cur: 2 },
            { prev: 1, cur: 3 },
            { prev: 1, cur: 4 },
        ];

        it.each(safeIncreases)('should return true', ({ prev, cur }) => {
            expect(isSafeIncrease(prev, cur)).toBe(true);
        });
    });

    it('get solution part 1', async () => {
        const raw = await readFile('src/02/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(raw);
        const safetyInfoLines = getSafeLines(parsed);
        const result = safetyInfoLines.reduce((acc, iter) => acc + (iter ? 1 : 0), 0);
        expect(result).toBeLessThan(606);
        expect(result).toBe(598);
    });
});

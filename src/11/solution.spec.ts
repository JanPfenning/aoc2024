import { readFile } from 'fs/promises';
import { blink, parseRawData, propagate } from './solution';

describe('Day 11', () => {
    it('should parse example input', async () => {
        const input = await readFile('src/11/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(parsed.length).toBe(2);
    });

    describe('should propagate', () => {
        const cases = [
            { input: 0, expectedOutput: [1] },
            { input: 900009, expectedOutput: [900, 9] },
            { input: 1, expectedOutput: [2024] },
            { input: 10, expectedOutput: [1, 0] },
            { input: 99, expectedOutput: [9, 9] },
            { input: 999, expectedOutput: [2021976] },
            { input: 17, expectedOutput: [1, 7] },
            { input: 7, expectedOutput: [14168] },
            { input: 125, expectedOutput: [253000] },
            { input: 2024, expectedOutput: [20, 24] },
        ];
        it.each(cases)('it', ({ input, expectedOutput }) => {
            expect(propagate(input)).toMatchObject(expectedOutput);
        });
    });

    describe('should have expected result after propagate x times', () => {
        it('once', () => {
            const stones = blink([125], 1);
            expect(stones).toMatchObject([253000]);
        });
        it('twice', () => {
            const stones = blink([125], 2);
            expect(stones).toMatchObject([253, 0]);
        });
        it('six times', () => {
            const stones = blink([125], 6);
            expect(stones).toMatchObject([2097446912, 14168, 4048, 2, 0, 2, 4]);
        });
        it('example', async () => {
            const input = await readFile('src/11/example_input.txt', 'utf8');
            const parsed = parseRawData(input);
            const stones = blink(parsed, 25);
            expect(stones.length).toBe(55312);
        });
        it('puzzle input 25 times', async () => {
            const input = await readFile('src/11/puzzle_input.txt', 'utf8');
            const parsed = parseRawData(input);
            const stones = blink(parsed, 25);
            expect(stones.length).toBe(200446);
        });
    });
});

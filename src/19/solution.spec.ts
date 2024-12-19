import { readFile } from 'fs/promises';
import { parseRawData, solution, solution2 } from './solution';
import { sum } from '../utils/reduce';

describe('Day 19', () => {
    describe('Part 1', () => {
        it('should find solution for example input', async () => {
            const rawData = await readFile('src/19/example_input.txt', 'utf8');
            const parsed = parseRawData(rawData);
            const result = solution(parsed);
            expect(result.length).toBe(6);
        });
        it('should find solution for example input', async () => {
            const rawData = await readFile('src/19/puzzle_input.txt', 'utf8');
            const parsed = parseRawData(rawData);
            const result = solution(parsed);
            expect(result.length).toBe(333);
        });
    });
    describe('Part 2', () => {
        it('should find solution for example input', async () => {
            const rawData = await readFile('src/19/example_input.txt', 'utf8');
            const parsed = parseRawData(rawData);
            const result = solution2(parsed);
            expect(Object.values(result).reduce(sum)).toBe(16);
        });
        describe('design by design', () => {
            const cases = [
                { design: 'brwrr', numbers: 2 },
                { design: 'bggr', numbers: 1 },
                { design: 'gbbr', numbers: 4 },
                { design: 'rrbgbr', numbers: 6 },
                { design: 'bwurrg', numbers: 1 },
                { design: 'brgr', numbers: 2 },
                { design: 'ubwu', numbers: 0 },
                { design: 'bbrgwb', numbers: 0 },
            ];
            it.each(cases)('it %s', async ({ design, numbers }) => {
                const rawData = await readFile('src/19/example_input.txt', 'utf8');
                const parsed = parseRawData(rawData);
                const result = solution2({ ...parsed, designs: [design] });
                expect(Object.values(result).reduce(sum)).toBe(numbers);
            });
        });
        describe('puzzle input', () => {
            it('should find solution for puzzle input', async () => {
                const rawData = await readFile('src/19/puzzle_input.txt', 'utf8');
                const parsed = parseRawData(rawData);
                const result = solution2(parsed);
                expect(Object.values(result).reduce(sum)).toBe(678536865274732);
            });
        });
    });
});

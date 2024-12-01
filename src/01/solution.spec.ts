import { readFile } from 'fs/promises';
import { calcualteSimilarityScore, calculateSumOfDistances, parseRawData } from './solution';

describe('Day 1', () => {
    const exampleInput = { leftList: [3, 4, 2, 1, 3, 3], rightList: [4, 3, 5, 3, 9, 3] };

    it('should parse input file', async () => {
        const raw = await readFile('src/01/example_input.txt', 'utf8');
        const parsed = parseRawData(raw);

        expect(parsed).toMatchObject(exampleInput);
    });

    it('should calculate example solution for part 1', () => {
        const expectedResult = 11;
        const result = calculateSumOfDistances(exampleInput);
        expect(result).toBe(expectedResult);
    });

    it('part 1', async () => {
        const raw = await readFile('src/01/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(raw);
        const result = calculateSumOfDistances(parsed);
        expect(result).toBe(2000468);
    });

    it('should calculate example solution for part 2', () => {
        const expectedResult = 31;
        const result = calcualteSimilarityScore(exampleInput);
        expect(result).toBe(expectedResult);
    });

    it('part 2', async () => {
        const raw = await readFile('src/01/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(raw);
        const result = calcualteSimilarityScore(parsed);
        expect(result).toBe(18567089);
    });
});

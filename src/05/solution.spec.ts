import { readFile } from 'fs/promises';
import {
    calculateSolutionForPart1,
    calculateSolutionForPart2,
    fixPageOrder,
    isPageInCorrectOrder,
    parseRawData,
    PuzzleInput,
} from './solution';

describe('Day 5', () => {
    const exampleInput: PuzzleInput = {
        orderings: {
            29: [13],
            47: [53, 13, 61, 29],
            53: [29, 13],
            61: [13, 53, 29],
            75: [29, 53, 47, 61, 13],
            97: [13, 61, 47, 29, 53, 75],
        },
        pages: [
            [75, 47, 61, 53, 29],
            [97, 61, 53, 29, 13],
            [75, 29, 13],
            [75, 97, 47, 61, 53],
            [61, 13, 29],
            [97, 13, 75, 29, 47],
        ],
    };

    it('should parse example input', async () => {
        const input = await readFile('src/05/example_input.txt', 'utf8');
        const expectedParseResult = exampleInput;
        const { orderings, pages } = parseRawData(input);
        expect(orderings).toMatchObject(expectedParseResult.orderings);
        expect(pages).toMatchObject(expectedParseResult.pages);
    });

    describe('should find that lists are in correct order', () => {
        const cases: { expectedResult: boolean; list: number[] }[] = [
            { expectedResult: true, list: [75, 47, 61, 53, 29] },
            { expectedResult: true, list: [97, 61, 53, 29, 13] },
            { expectedResult: true, list: [75, 29, 13] },
        ];

        it.each(cases)('it', ({ expectedResult, list }) => {
            const result = isPageInCorrectOrder(list, exampleInput.orderings);
            expect(result).toBe(expectedResult);
        });
    });

    it('should calculate solution for example part 1', () => {
        const result = calculateSolutionForPart1(exampleInput);
        expect(result).toBe(143);
    });

    it('should calculate solution for puzzle input part 1', async () => {
        const rawData = await readFile('src/05/puzzle_input.txt', 'utf8');
        const puzzleInput = parseRawData(rawData);
        const result = calculateSolutionForPart1(puzzleInput);
        expect(result).toBe(4872);
    });

    describe('should fix page orders', () => {
        const cases: { correctOrder: number[]; inputOrder: number[] }[] = [
            { correctOrder: [97, 75, 47, 61, 53], inputOrder: [75, 97, 47, 61, 53] },
            { correctOrder: [61, 29, 13], inputOrder: [61, 13, 29] },
            { correctOrder: [97, 75, 47, 29, 13], inputOrder: [97, 13, 75, 29, 47] },
        ];
        it.each(cases)('it', ({ correctOrder, inputOrder }) => {
            expect(fixPageOrder(exampleInput.orderings, inputOrder)).toMatchObject(correctOrder);
        });
    });

    it('should calculate solution for example part 2', () => {
        const result = calculateSolutionForPart2(exampleInput);
        expect(result).toBe(123);
    });

    it('should calculate solution for puzzle input part 2', async () => {
        const rawData = await readFile('src/05/puzzle_input.txt', 'utf8');
        const puzzleInput = parseRawData(rawData);
        const result = calculateSolutionForPart2(puzzleInput);
        expect(result).toBe(5564);
    });
});

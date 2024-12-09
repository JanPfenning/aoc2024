import { readFile } from 'fs/promises';
import {
    keepEquationsWithPossibleSolutionsRecursive,
    getAllPossibleOperatorCombinations,
    isEquationCorrect,
    parseRawData,
    PuzzleInput,
    recursiveSolution,
    sumOfValidEquations,
} from './solution';

describe('Day 7', () => {
    const exampleInput: PuzzleInput = [
        {
            result: 190,
            operants: [10, 19],
        },
        {
            result: 3267,
            operants: [81, 40, 27],
        },
    ];

    it('should parse example input', async () => {
        const input = await readFile('src/07/example_input.txt', 'utf8');
        const expectedParseResult = exampleInput;
        const parsed = parseRawData(input);
        expect(parsed).toMatchObject(expect.objectContaining(expectedParseResult));
        expect(parsed.length).toBe(9);
    });

    it('should get all possible combinations of operators', () => {
        expect(getAllPossibleOperatorCombinations(exampleInput[0], ['+', '*']).map((e) => e.operators)).toMatchObject([
            ['+'],
            ['*'],
        ]);
    });

    it('should get all possible combinations of operators', () => {
        expect(getAllPossibleOperatorCombinations(exampleInput[1], ['+', '*']).map((e) => e.operators)).toMatchObject([
            ['+', '+'],
            ['+', '*'],
            ['*', '+'],
            ['*', '*'],
        ]);
    });

    it('should mark equation as valid', () => {
        expect(isEquationCorrect({ ...exampleInput[1], operators: ['+', '*'] })).toBe(true);
    });

    it('should mark equation as valid', () => {
        expect(isEquationCorrect({ ...exampleInput[1], operators: ['*', '+'] })).toBe(true);
    });

    it('should calcualte result for example input', async () => {
        const input = await readFile('src/07/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(sumOfValidEquations(parsed)).toBe(3749);
    });

    it('should calcualte result for puzzle input', async () => {
        const input = await readFile('src/07/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(sumOfValidEquations(parsed)).toBe(1038838357795);
    });

    it('should calcualte result for example input part 2', async () => {
        const input = await readFile('src/07/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(sumOfValidEquations(parsed, ['*', '+', '||'])).toBe(11387);
    });

    it('should calcualte result for puzzle input part 2', async () => {
        const input = await readFile('src/07/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(sumOfValidEquations(parsed, ['*', '+', '||'])).toBe(254136560217241);
    });

    it('should find equation to have a correct solution', async () => {
        expect(keepEquationsWithPossibleSolutionsRecursive(exampleInput[0], ['*', '+', '||'])).toBe(true);
    });

    it('should calcualte result for example input part 2 rec', async () => {
        const input = await readFile('src/07/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(recursiveSolution(parsed, ['*', '+', '||'])).toBe(11387);
    });

    it('should calcualte result for puzzle input part 2 rec', async () => {
        const input = await readFile('src/07/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(recursiveSolution(parsed, ['*', '+', '||'])).toBe(254136560217241);
    });
});

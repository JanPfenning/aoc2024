import { readFile } from 'fs/promises';
import {
    findMultiplicationTokens,
    findMultiplicationTokensWithDoAndDontInstructions,
    getFactorsOfExpression,
    getSumOfValidMultiplications,
    getSumOfValidMultiplicationsWithDoAndDontInstructions,
} from './solution';

describe('Day 3', () => {
    it('should find multiplications in example', async () => {
        const input = (await readFile('src/03/example_input.txt', 'utf8')).replace(/\n/g, '');
        const expectedTokens = ['mul(2,4)', 'mul(5,5)', 'mul(11,8)', 'mul(8,5)'];
        const tokens = findMultiplicationTokens(input);
        expect(tokens).toMatchObject(expectedTokens);
    });

    describe('getFactorsOfExpression', () => {
        const cases = [
            { expression: 'mul(2,4)', factors: [2, 4] },
            { expression: 'mul(4,3)', factors: [4, 3] },
            { expression: 'mul(422,31)', factors: [422, 31] },
        ];
        it.each(cases)('should find factors of expression', ({ expression, factors }) => {
            expect(getFactorsOfExpression(expression)).toMatchObject(factors);
        });
    });

    it('solution day 1', async () => {
        const input = (await readFile('src/03/puzzle_input.txt', 'utf8')).replace(/\n/g, '');
        const result = getSumOfValidMultiplications(input);
        expect(result).toBe(166905464);
    });

    it('should find part 2 multiplications in example', async () => {
        const input = (await readFile('src/03/example_input_p2.txt', 'utf8')).replace(/\n/g, '');
        const expectedTokens = ['mul(2,4)', 'mul(8,5)'];
        const tokens = findMultiplicationTokensWithDoAndDontInstructions(input);
        expect(tokens).toMatchObject(expectedTokens);
    });

    it('should find the correct mul expressions', () => {
        const input = "xyzmul(0,1)mul(1,1)xdon't()xmul(2,1)xdo()xmul(3,1)xdon't()xmul(4,1)xdo()xmul(5,1)";
        const expectedExpressions = ['mul(0,1)', 'mul(1,1)', 'mul(3,1)', 'mul(5,1)'];
        const result = findMultiplicationTokensWithDoAndDontInstructions(input);
        expect(result).toMatchObject(expectedExpressions);
    });

    it('solution day 2', async () => {
        const input = (await readFile('src/03/puzzle_input.txt', 'utf8')).replace(/\n/g, '');
        const result = getSumOfValidMultiplicationsWithDoAndDontInstructions(input);
        expect(result).toBeLessThan(166_905_464);
        expect(result).toBeLessThan(147_561_716);
        expect(result).toBeGreaterThan(14_428_142);
        expect(result).toBeGreaterThan(70_659_946);
        expect(result).toBe(72_948_684);
    });
});

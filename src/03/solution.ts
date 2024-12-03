import { sum } from '../utils/reduce';

export const findMultiplicationTokens = (input: string): string[] => {
    return input.match(/mul\(\d{1,3},\d{1,3}\)/g)!;
};

export const getFactorsOfExpression = (expression: string): [number, number] => {
    const [x, y] = expression.match(/\d+/g)!;
    return [+x, +y];
};

export const getSumOfValidMultiplications = (input: string): number => {
    const multiplicationExpressions = findMultiplicationTokens(input);
    return multiplicationExpressions
        .map(getFactorsOfExpression)
        .map((factors) => factors[0] * factors[1])
        .reduce(sum, 0);
};

export const findMultiplicationTokensWithDoAndDontInstructions = (input: string): string[] => {
    const validPatterns = /mul\(\d{1,3},\d{1,3}\)|don't\(\)|do\(\)/g;
    const denoisedString = 'do()' + input.match(validPatterns)!.join('');
    const matchPatternIfMostRecentTokenIsDoNotDont = /(?<=(do\(\))(?:(?!do\(\)|don't\(\)).)*)mul\(\d{1,3},\d{1,3}\)/g;
    return denoisedString.match(matchPatternIfMostRecentTokenIsDoNotDont)!;
};

export const getSumOfValidMultiplicationsWithDoAndDontInstructions = (input: string): number => {
    const multiplicationExpressions = findMultiplicationTokensWithDoAndDontInstructions(input);
    return multiplicationExpressions
        .map(getFactorsOfExpression)
        .map((factors) => factors[0] * factors[1])
        .reduce(sum, 0);
};

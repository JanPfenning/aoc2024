import { asManyCharSeperatedLists } from '../utils/parse';
import { sum } from '../utils/reduce';

type Operators = '+' | '*' | '||';
type CalibrationEquation = { result: number; operators?: Operators[]; operants: number[] };
export type PuzzleInput = CalibrationEquation[];

export const parseRawData = (rawData: string): PuzzleInput => {
    const lines = asManyCharSeperatedLists(': ', rawData);
    const input: PuzzleInput = lines.map((line) => ({
        result: +line[0],
        operants: line[1].split(' ').map((x) => +x),
    }));
    return input;
};

export const isEquationCorrect = (equation: CalibrationEquation): boolean => {
    const { operants, operators, result } = equation;

    const calculateResult = (acc: number, iter: number, idx: number) => {
        if (idx === 0) return iter;
        if (idx >= operants.length) return acc;
        const operator = operators![idx - 1];
        return operation(operator)(acc, iter);
    };

    const finalResult = operants.reduce(calculateResult, 0);

    return finalResult === result;
};

export const operation = (operator: Operators): ((a: number, b: number) => number) => {
    return (x, y) => (operator == '+' ? x + y : operator === '*' ? x * y : +`${x}${y}`);
};

export const getAllPossibleOperatorCombinations = (
    equation: CalibrationEquation,
    possibleOperators: Operators[]
): CalibrationEquation[] => {
    const operatorCombinations = generateCombinations(possibleOperators, equation.operants.length - 1);
    return operatorCombinations.map((operators) => ({ ...equation, operators }));
};

function generateCombinations<T extends string | number>(chars: T[], length: number): T[][] {
    if (length === 0) return [[]];

    return chars.flatMap((char) =>
        generateCombinations(chars, length - 1).map((combination) => [char, ...combination])
    );
}

export const sumOfValidEquations = (
    equations: CalibrationEquation[],
    possibleOperators: Operators[] = ['+', '*']
): number => {
    const correctEquations = equations.filter((equation) =>
        getAllPossibleOperatorCombinations(equation, possibleOperators).some((possibleSolution) =>
            isEquationCorrect(possibleSolution)
        )
    );
    return correctEquations.map((x) => x.result).reduce(sum);
};

export const keepEquationsWithPossibleSolutionsRecursive = (
    equation: CalibrationEquation,
    possibleOperators: Operators[] = ['+', '*'],
    idx = 0,
    acc = equation.operants[0]
): boolean => {
    if (acc > equation.result) return false;
    if (idx === equation.operants.length - 1) return acc === equation.result;
    if (idx > equation.operants.length) throw new Error('unexpected state');
    return possibleOperators.some((operator) => {
        const newAcc = operation(operator)(acc, equation.operants[idx + 1]);
        return keepEquationsWithPossibleSolutionsRecursive(equation, possibleOperators, idx + 1, newAcc);
    });
};

export const recursiveSolution = (equation: CalibrationEquation[], possibleOperators: Operators[] = ['+', '*']) => {
    const correctEquations = equation.filter((eq) =>
        keepEquationsWithPossibleSolutionsRecursive(eq, possibleOperators)
    );
    return correctEquations.map((x) => x.result).reduce(sum, 0);
};

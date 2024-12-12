import { asSingleNumberLine } from '../utils/parse';

export type PuzzleInput = number[];

export const parseRawData = (rawData: string): PuzzleInput => {
    return asSingleNumberLine(' ', rawData);
};

export const propagate = (x: number): [number] | [number, number] => {
    if (x === 0) return [1];
    const stringRepOfNumber = '' + x;
    if (stringRepOfNumber.length % 2 === 0) {
        const front = stringRepOfNumber.slice(0, stringRepOfNumber.length / 2);
        const back = stringRepOfNumber.slice(stringRepOfNumber.length / 2);
        return [+front, +back];
    }
    return [x * 2024];
};

export const blink = (input: PuzzleInput, n = 1): number[] => {
    console.log(n, input.length);
    if (n === 0) return input;
    return blink(input.map(propagate).flat(), n - 1);
};

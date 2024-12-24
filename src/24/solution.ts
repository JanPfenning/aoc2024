import { asManyCharSeperatedLists } from '../utils/parse';
import { lexicographical } from '../utils/sort';

type Instruction = [string, 'XOR' | 'AND' | 'OR', string];
type PuzzleInput = {
    knownStates: Record<string, boolean | undefined>;
    gates: Record<string, Instruction>;
};
export const parseRawData = (rawData: string): PuzzleInput => {
    const [initial, gates] = rawData.split(/\n\n/g);
    const initialParsed = asManyCharSeperatedLists(': ', initial).map(([key, val]) => [
        key,
        val === '1' ? true : false,
    ]);
    const gatesParsed = asManyCharSeperatedLists(' -> ', gates).map(([instructions, result]) => [
        result,
        instructions.split(/\s+/g) as Instruction,
    ]) as [string, Instruction][];
    return { knownStates: Object.fromEntries(initialParsed), gates: Object.fromEntries(gatesParsed) };
};

export const and = (a: boolean, b: boolean): boolean => a && b;
export const xor = (a: boolean, b: boolean): boolean => (a || b) && !(a && b);
export const or = (a: boolean, b: boolean): boolean => a || b;

const funcs = { AND: and, XOR: xor, OR: or };

export const getStateOf = (key: string, { knownStates, gates }: PuzzleInput): boolean => {
    if (knownStates[key] !== undefined) return knownStates[key];
    const instruction = gates[key];
    const func = funcs[instruction[1]];
    const res = func(
        getStateOf(instruction[0], { knownStates, gates }),
        getStateOf(instruction[2], { knownStates, gates })
    );
    knownStates[key] = res;
    return res;
};

export const getResult = ({ knownStates, gates }: PuzzleInput): number => {
    const zs = Object.keys(gates)
        .filter((e) => e[0] === 'z')
        .sort(lexicographical);
    const bits = zs.map((z) => getStateOf(z, { knownStates, gates })).map((bool) => (bool ? 1 : 0));
    return parseInt(bits.reverse().join(''), 2);
};

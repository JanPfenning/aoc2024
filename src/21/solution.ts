type PuzzleInput = string[];
export const parseRawData = (rawData: string): PuzzleInput => {
    return rawData.split(/\n/g);
};

export type KEYPAD_BUTTON = '<' | '^' | 'v' | '>' | 'A';
export type NUMPAD_BUTTON = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A';

export const NUMPAD_ADJACENCYLIST: { [key in NUMPAD_BUTTON]: [NUMPAD_BUTTON, KEYPAD_BUTTON][] } = {
    '7': [
        ['8', '>'],
        ['4', 'v'],
    ],
    '8': [
        ['7', '<'],
        ['9', '>'],
        ['5', 'v'],
    ],
    '9': [
        ['8', '<'],
        ['6', 'v'],
    ],
    '4': [
        ['7', '^'],
        ['5', '>'],
        ['1', 'v'],
    ],
    '5': [
        ['8', '^'],
        ['4', '<'],
        ['6', '>'],
        ['2', 'v'],
    ],
    '6': [
        ['9', '^'],
        ['5', '<'],
        ['3', 'v'],
    ],
    '1': [
        ['4', '^'],
        ['2', '>'],
    ],
    '2': [
        ['5', '^'],
        ['1', '<'],
        ['3', '>'],
        ['0', 'v'],
    ],
    '3': [
        ['6', '^'],
        ['2', '<'],
        ['A', 'v'],
    ],
    '0': [
        ['2', '^'],
        ['A', '>'],
    ],
    'A': [
        ['3', '^'],
        ['0', '<'],
    ],
};

export const KEYPAD_ADJACENCYLIST: { [key in KEYPAD_BUTTON]: [KEYPAD_BUTTON, KEYPAD_BUTTON][] } = {
    '<': [['v', '>']],
    'v': [
        ['<', '<'],
        ['>', '>'],
        ['^', '^'],
    ],
    '>': [
        ['A', '^'],
        ['v', '<'],
    ],
    '^': [
        ['v', 'v'],
        ['A', '>'],
    ],
    'A': [
        ['>', 'v'],
        ['^', '<'],
    ],
};

type Sequence = KEYPAD_BUTTON[];
export const findAllInstructionSequencesToGetFromTokenToToken = <T extends KEYPAD_BUTTON | NUMPAD_BUTTON>(
    graph: { [key in T]: [T, KEYPAD_BUTTON][] },
    start: T,
    end: T
): Sequence[] => {
    const queue: [T[], Sequence][] = [[[start], []]];
    const allPaths: Sequence[] = [];

    while (queue.length > 0) {
        const [buttonOrder, path] = queue.shift()!;

        const currentButton = buttonOrder[buttonOrder.length - 1];
        if (currentButton === end) {
            allPaths.push(path);
        } else if (allPaths.length === 0 || buttonOrder.length <= allPaths[0].length) {
            const adjacencts = graph[currentButton];
            for (const [nextButton, direction] of adjacencts) {
                if (!buttonOrder.includes(nextButton)) {
                    queue.push([
                        [...buttonOrder, nextButton],
                        [...path, direction],
                    ]);
                }
            }
        }
    }

    return allPaths;
};

export const runSequence = <T extends KEYPAD_BUTTON | NUMPAD_BUTTON>(
    adjacency: { [key in T]: [T, KEYPAD_BUTTON][] },
    sequence: string
): string => {
    return sequence.split('').reduce(
        (acc, instruction) => {
            if (instruction === 'A') return { ...acc, producingSequence: acc.producingSequence + acc.currentKey };
            const adjacencyOfCurrentKey = adjacency[acc.currentKey];
            const [to, _via] = adjacencyOfCurrentKey.find(([_to, via]) => via === instruction)!;
            return { ...acc, currentKey: to };
        },
        { currentKey: 'A', producingSequence: '' } as { currentKey: T; producingSequence: string }
    ).producingSequence;
};

export const buildSequences = <T extends KEYPAD_BUTTON | NUMPAD_BUTTON>(
    adjacency: { [key in T]: [T, KEYPAD_BUTTON][] },
    expectedResult: string
): Sequence[] => {
    const sequenceParts: Sequence[][] = (expectedResult.split('') as T[]).map((nextThingToPress, idx, arr) =>
        findAllInstructionSequencesToGetFromTokenToToken(
            adjacency,
            idx - 1 >= 0 ? arr[idx - 1] : ('A' as T),
            nextThingToPress
        )
    );
    return <Sequence[]>(
        generateCombinations(sequenceParts).map((sequence) => sequence.map((part) => [...part, 'A']).flat())
    );
};

export const generateCombinations = <T>(choices: T[][]): T[][] => {
    const combine = (current: T[], index: number): T[][] => {
        if (index === choices.length) {
            return [current];
        }

        return choices[index].flatMap((choice) => combine([...current, choice], index + 1));
    };

    return combine([], 0);
};

export const findInputSequences = (toPress: NUMPAD_BUTTON[]): string[] => {
    const radiantSequenceToProduceNumpad = buildSequences(NUMPAD_ADJACENCYLIST, toPress.join(''));
    const bestRadiantSequenceLen = radiantSequenceToProduceNumpad.map((e) => e.length).sort((a, b) => a - b)[0];
    const freezerSequenceToProduceRadiant = radiantSequenceToProduceNumpad
        .filter((e) => e.length === bestRadiantSequenceLen)
        .map((sequence) => buildSequences(KEYPAD_ADJACENCYLIST, sequence.join('')))
        .flat();
    const bestFreezerSequenceLen = freezerSequenceToProduceRadiant.map((e) => e.length).sort((a, b) => a - b)[0];
    const manualSequenceToProduceFreezer = freezerSequenceToProduceRadiant
        .filter((e) => e.length === bestFreezerSequenceLen)
        .map((sequence) => buildSequences(KEYPAD_ADJACENCYLIST, sequence.join('')))
        .flat();
    return manualSequenceToProduceFreezer.map((sequence) => sequence.join(''));
};

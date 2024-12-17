import { range } from '../utils/range';
import { zip } from '../utils/zip';

type Instruction = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type State = {
    registers: [number, number, number];
    program: Instruction[];
    programPointer: number;
    output: number[];
};

export const getComboOperand = (operand: Instruction, state: State) => {
    if (operand === 7) throw new Error('Combo Operand 7 can not exist in a valid program');
    if (operand < 4) return operand;
    return state.registers[operand - 4];
};

export const instructions: Record<Instruction, (state: State) => State> = {
    0: function (state: State): State {
        const newState: State = JSON.parse(JSON.stringify(state));
        const operand = getComboOperand(state.program[state.programPointer + 1], state);

        newState.registers[0] = Math.floor(newState.registers[0] / 2 ** operand);

        newState.programPointer += 2;
        return newState;
    },
    1: function (state: State): State {
        const newState: State = JSON.parse(JSON.stringify(state));
        const operand = state.program[state.programPointer + 1];

        newState.registers[1] ^= operand;

        newState.programPointer += 2;
        return newState;
    },
    2: function (state: State): State {
        const newState: State = JSON.parse(JSON.stringify(state));
        const operand = getComboOperand(state.program[state.programPointer + 1], state);

        newState.registers[1] = operand % 8;

        newState.programPointer += 2;
        return newState;
    },
    3: function (state: State): State {
        const newState: State = JSON.parse(JSON.stringify(state));

        const newInstructionPointerLocation =
            newState.registers[0] === 0 ? state.programPointer + 2 : state.program[state.programPointer + 1];
        newState.programPointer = newInstructionPointerLocation;
        return newState;
    },
    4: function (state: State): State {
        const newState: State = JSON.parse(JSON.stringify(state));

        newState.registers[1] ^= newState.registers[2];

        newState.programPointer += 2;
        return newState;
    },
    5: function (state: State): State {
        const newState: State = JSON.parse(JSON.stringify(state));
        const operand = getComboOperand(state.program[state.programPointer + 1], state);

        newState.output.push(operand % 8);

        newState.programPointer += 2;
        return newState;
    },
    6: function (state: State): State {
        const newState: State = JSON.parse(JSON.stringify(state));
        const operand = getComboOperand(state.program[state.programPointer + 1], state);

        newState.registers[1] = Math.floor(newState.registers[0] / 2 ** operand);

        newState.programPointer += 2;
        return newState;
    },
    7: function (state: State): State {
        const newState: State = JSON.parse(JSON.stringify(state));
        const operand = getComboOperand(state.program[state.programPointer + 1], state);

        newState.registers[2] = Math.floor(newState.registers[0] / 2 ** operand);

        newState.programPointer += 2;
        return newState;
    },
};

export const run = (initialState: State): State => {
    let state = initialState;
    while (true) {
        if (state.programPointer >= state.program.length) return state;
        const opcode = state.program[state.programPointer];
        state = instructions[opcode](state);
    }
};

// [(2, 4), (1, 2), (7, 5), (1, 3), (4, 4), (5, 5), (0, 3), (3, 0)]
export const findA = (program: State['program']): number => {
    const currentBest = { a: 0, mostCorrectOutputPlaces: 0 };

    const runForOneA = (a: number) => {
        let b = 0;
        let c = 0;
        const output: number[] = [];
        const opts = [
            () => (b = a % 8), // (2,4)
            () => (b = b ^ 2), // (1,2)
            () => (c = Math.floor(a / 2 ** b)), // (7, 5)
            () => (b = b ^ 3), // (1,3)
            () => (b = b ^ c), // (4,_4)
            () => output.push(b % 8), // (5,5)
            () => (a = Math.floor(a / 2 ** 3)), // (0, 3)
            () => {}, // (3, 0)
        ];
        // const opts = [
        //     () => (a = Math.floor(a / 2 ** 3)), // (0, 3)
        //     () => output.push(a % 8), // (5,4)
        // ];

        for (const _ of range(0, program.length)) {
            opts.forEach((func) => func());
            const correctDigits = zip([...program].splice(0, output.length), output).filter(([a, b]) => a === b).length;
            if (correctDigits === 6) console.log(a);
            if (currentBest.a !== a && currentBest.mostCorrectOutputPlaces === correctDigits) {
                // console.log('found matching good solution at', a, 'prior was', currentBest.a);
            }
            if (currentBest.mostCorrectOutputPlaces < correctDigits) {
                console.log(
                    'found new best solution with',
                    correctDigits,
                    'correct digits at',
                    a,
                    'prior was',
                    currentBest.a
                );
                currentBest.a = a;
                currentBest.mostCorrectOutputPlaces = correctDigits;
            }
            if (correctDigits !== output.length) return false;
        }
        return true;
    };
    let a = 35_000_000_000_000;
    while (a < 300_000_000_000_000) {
        const x = runForOneA(a);
        if (x) return a;
        a += 1;
    }
    return 0;
};

// Part 2 must be greater than 3_831_986_210

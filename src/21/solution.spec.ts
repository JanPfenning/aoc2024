import {
    buildSequences,
    findAllInstructionSequencesToGetFromTokenToToken,
    findInputSequences,
    KEYPAD_ADJACENCYLIST,
    NUMPAD_ADJACENCYLIST,
    NUMPAD_BUTTON,
    runSequence,
} from './solution';
import { sum } from '../utils/reduce';
import { range } from '../utils/range';

describe('Day 21', () => {
    describe('part 1', () => {
        describe('example input', () => {
            const cases: { input: string; expectedOutput: string }[] = [
                {
                    input: '029A',
                    expectedOutput: '<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A',
                },
                { input: '980A', expectedOutput: '<v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A' },
                {
                    input: '179A',
                    expectedOutput: '<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A',
                },
                { input: '456A', expectedOutput: '<v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A' },
                { input: '379A', expectedOutput: '<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A' },
            ] as const;
            it.each(cases)('should find instructions that will produce input', ({ input, expectedOutput }) => {
                const manualButtonSequences = findInputSequences(input.split('') as NUMPAD_BUTTON[]);
                const minPresses = manualButtonSequences.map((e) => e.length).sort((a, b) => a - b);
                expect(minPresses[0]).toBe(expectedOutput.length);
            });
            it('should produce instructions for numpad input 029A', () => {
                const numpadInstructions = range(2).reduce(
                    (acc, _) => runSequence(KEYPAD_ADJACENCYLIST, acc),
                    '<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A'
                );
                const result = runSequence(NUMPAD_ADJACENCYLIST, numpadInstructions);
                expect(result).toBe('029A');
            });
            it('1 should produce instructions for numpad input 379A', () => {
                const numpadInstructions = range(2).reduce(
                    (acc, _) => runSequence(KEYPAD_ADJACENCYLIST, acc),
                    'v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^AAAvA^<A>A'
                );
                const result = runSequence(NUMPAD_ADJACENCYLIST, numpadInstructions);
                expect(result).toBe('379A');
            });
            it('2 should produce instructions for numpad input 379A', () => {
                const numpadInstructions = range(2).reduce(
                    (acc, _) => runSequence(KEYPAD_ADJACENCYLIST, acc),
                    '<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A'
                );
                const result = runSequence(NUMPAD_ADJACENCYLIST, numpadInstructions);
                expect(result).toBe('379A');
            });
            const shouldBecomeInput = ['<A^A>^^AvvvA', '<A^A^>^AvvvA', '<A^A^^>AvvvA'];
            it.each(shouldBecomeInput)('should run sequence to get numpad presses', (input) => {
                expect(runSequence(NUMPAD_ADJACENCYLIST, input)).toBe('029A');
            });
            it('should find all paths', () => {
                const allPaths = findAllInstructionSequencesToGetFromTokenToToken(NUMPAD_ADJACENCYLIST, '2', '9').map(
                    (e) => e.join('') + 'A'
                );
                expect(allPaths.length).toBe(3);
                expect(allPaths).toMatchObject(expect.arrayContaining(['>^^A', '^>^A', '^^>A']));
            });
            it('should build instructions one step from numpad input', () => {
                const sequences = buildSequences(NUMPAD_ADJACENCYLIST, '029A');
                expect(sequences.map((sequence) => sequence.join(''))).toMatchObject(
                    expect.arrayContaining(['<A^A>^^AvvvA', '<A^A^>^AvvvA', '<A^A^^>AvvvA'])
                );
            });
            it('should build instructions one step from keypad input', () => {
                expect(buildSequences(KEYPAD_ADJACENCYLIST, '<A^A>^^AvvvA').join('')).toBe(
                    'v<<A>>^A<A>AvA^<AA>Av<AAA>^A'
                );
            });
        });
        describe('puzzle input', () => {
            it('should find solution for part 1', () => {
                const inputs = ['965A', '143A', '528A', '670A', '973A'];
                const result = inputs.map(
                    (input) =>
                        findInputSequences(input.split('') as NUMPAD_BUTTON[])
                            .map((e) => e.length)
                            .sort((a, b) => a - b)[0] * +input.slice(0, 3)
                );
                expect(result.reduce(sum)).toBeLessThan(237898);
                expect(result.reduce(sum)).toBe(222670);
            });
        });
    });
});

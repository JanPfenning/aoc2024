import { findA, run } from './solution';

describe('Day 17', () => {
    describe('part 1', () => {
        it('should output expected list of values for example input', () => {
            const finalState = run({
                registers: [729, 0, 0],
                program: [0, 1, 5, 4, 3, 0],
                programPointer: 0,
                output: [],
            });
            expect(finalState.output).toMatchObject([4, 6, 3, 5, 6, 3, 5, 2, 1, 0]);
        });
        it('should output expected list of values for puzzle input', () => {
            const finalState = run({
                registers: [48744869, 0, 0],
                program: [2, 4, 1, 2, 7, 5, 1, 3, 4, 4, 5, 5, 0, 3, 3, 0],
                programPointer: 0,
                output: [],
            });
            expect(finalState.output).not.toMatchObject([7, 1, 5, 2, 4, 0, 7, 6, 1]);
            expect(finalState.output.join(',')).toBe('7,1,5,2,4,0,7,6,1');
        });
    });
    describe('part 2', () => {
        it('should output expected run to output copy of input program for example input', () => {
            const finalState = run({
                registers: [117440, 0, 0],
                program: [0, 3, 5, 4, 3, 0],
                programPointer: 0,
                output: [],
            });
            expect(finalState.output).toMatchObject([0, 3, 5, 4, 3, 0]);
        });
        it('should output expected run to output copy of input program for puzzle input', () => {
            const finalState = run({
                registers: [159330754, 0, 0],
                program: [2, 4, 1, 2, 7, 5, 1, 3, 4, 4, 5, 5, 0, 3, 3, 0],
                programPointer: 0,
                output: [],
            });
            expect(finalState.output).toMatchObject([2, 4, 1, 2, 7, 5, 1, 3, 4, 4, 5, 5, 0, 3, 3, 0]);
        });
        it('x', () => {
            const a = findA([0, 3, 5, 4, 3, 0]);
            expect(a).toBe(117440);
        });
        it('y', () => {
            const a = findA([2, 4, 1, 2, 7, 5, 1, 3, 4, 4, 5, 5, 0, 3, 3, 0]);
            expect(a).not.toBe(0);
            expect(a).toBe(0);
        });
    });
});

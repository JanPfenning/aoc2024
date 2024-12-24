import { readFile } from 'fs/promises';
import { getResult, getStateOf, parseRawData } from './solution';

describe('Day 24', () => {
    describe('part 1', () => {
        describe('example', () => {
            const file = 'src/24/example_input.txt';
            const cases: { inp: string; expectedOutput: boolean }[] = [
                { inp: 'bfw', expectedOutput: true },
                { inp: 'bqk', expectedOutput: true },
                { inp: 'djm', expectedOutput: true },
                { inp: 'ffh', expectedOutput: false },
                { inp: 'fgs', expectedOutput: true },
                { inp: 'frj', expectedOutput: true },
                { inp: 'fst', expectedOutput: true },
                { inp: 'gnj', expectedOutput: true },
                { inp: 'hwm', expectedOutput: true },
                { inp: 'kjc', expectedOutput: false },
                { inp: 'kpj', expectedOutput: true },
                { inp: 'kwq', expectedOutput: false },
                { inp: 'mjb', expectedOutput: true },
                { inp: 'nrd', expectedOutput: true },
                { inp: 'ntg', expectedOutput: false },
                { inp: 'pbm', expectedOutput: true },
                { inp: 'psh', expectedOutput: true },
                { inp: 'qhw', expectedOutput: true },
                { inp: 'rvg', expectedOutput: false },
                { inp: 'tgd', expectedOutput: false },
                { inp: 'tnw', expectedOutput: true },
                { inp: 'vdt', expectedOutput: true },
                { inp: 'wpb', expectedOutput: false },
                { inp: 'z00', expectedOutput: false },
                { inp: 'z01', expectedOutput: false },
                { inp: 'z02', expectedOutput: false },
                { inp: 'z03', expectedOutput: true },
                { inp: 'z04', expectedOutput: false },
                { inp: 'z05', expectedOutput: true },
                { inp: 'z05', expectedOutput: true },
                { inp: 'z06', expectedOutput: true },
                { inp: 'z07', expectedOutput: true },
                { inp: 'z08', expectedOutput: true },
                { inp: 'z09', expectedOutput: true },
                { inp: 'z10', expectedOutput: true },
                { inp: 'z11', expectedOutput: false },
                { inp: 'z12', expectedOutput: false },
            ];
            it.each(cases)('state of z should be calculated %s', async ({ inp, expectedOutput }) => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                expect(getStateOf(inp, parsed)).toBe(expectedOutput);
            });
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                expect(getResult(parsed)).toBe(2024);
            });
        });
        describe('puzzle input', () => {
            const file = 'src/24/puzzle_input.txt';
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                expect(getResult(parsed)).toBe(41324968993486);
            });
        });
    });
    describe('part 2', () => {
        describe('example input', () => {
            const file = 'src/24/example_input.txt';
            it.todo('should calcualte result');
        });
        describe('puzzle input', () => {
            const file = 'src/24/puzzle_input.txt';
            it.todo('should calcualte result');
        });
    });
});

import { readFile } from 'fs/promises';
import { getAllAntinodes, parseRawData, PuzzleInput } from './solution';

describe('Day 8', () => {
    const exampleInput: PuzzleInput = [
        ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', '0', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '0', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '0', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '0', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', 'A', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', 'A', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', '.', 'A', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ];

    it('should calcualte result for example input part 1', async () => {
        const input = await readFile('src/08/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = getAllAntinodes(parsed);
        expect(result.length).toBe(14);
    });

    it('should calcualte result for puzzle input part 1', async () => {
        const input = await readFile('src/08/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = getAllAntinodes(parsed);
        expect(result.length).toBe(341);
    });

    it('should calcualte result for example input part 2', async () => {
        const input = await readFile('src/08/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = getAllAntinodes(parsed, true);
        expect(result.length).toBe(34);
    });

    it('should calcualte result for example input part 2', async () => {
        const input = await readFile('src/08/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = getAllAntinodes(parsed, true);
        expect(result.length).toBe(34);
    });
});

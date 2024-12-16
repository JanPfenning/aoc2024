import { readFile } from 'fs/promises';
import { parseRawData, solution } from './solution';
import { solution as part2 } from './solution_part_2';

describe('Day 16', () => {
    describe('part 1', () => {
        it('should get result for example 1', async () => {
            const input = await readFile('src/16/example_input_1.txt', 'utf8');
            const parsed = parseRawData(input);
            expect(solution(parsed)).toBe(7036);
        });

        it('should get result for example 2', async () => {
            const input = await readFile('src/16/example_input_2.txt', 'utf8');
            const parsed = parseRawData(input);
            expect(solution(parsed)).toBe(11048);
        });
        it('should get result for example 3', async () => {
            const input = await readFile('src/16/example_input_3.txt', 'utf8');
            const parsed = parseRawData(input);
            expect(solution(parsed)).toBe(21148);
        });
        it('should get result for example 4', async () => {
            const input = await readFile('src/16/example_input_4.txt', 'utf8');
            const parsed = parseRawData(input);
            expect(solution(parsed)).toBe(4013);
        });

        it('should get result for puzzle input', async () => {
            const input = await readFile('src/16/puzzle_input.txt', 'utf8');
            const parsed = parseRawData(input);
            expect(solution(parsed)).toBe(89460);
        });
    });

    describe('part 2', () => {
        it('should get result for example 1 part 2', async () => {
            const input = await readFile('src/16/example_input_1.txt', 'utf8');
            const parsed = parseRawData(input);
            expect(part2(parsed)).toBe(45);
        });

        it('should get result for example 2 part 2', async () => {
            const input = await readFile('src/16/example_input_2.txt', 'utf8');
            const parsed = parseRawData(input);
            expect(part2(parsed)).toBe(64);
        });

        it('should get result for puzzle input part 2', async () => {
            const input = await readFile('src/16/puzzle_input.txt', 'utf8');
            const parsed = parseRawData(input);
            expect(part2(parsed)).toBe(-1);
        });
    });
});

import { readFile } from 'fs/promises';
import { parseRawData, getFields, getPerimeter, solution, getSides } from './solution';

describe('Day 12', () => {
    it('should find fields for example', async () => {
        const input = await readFile('src/12/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const fields = getFields(parsed);
        expect(fields.length).toBe(11);
        expect(fields[0].length).toBe(12);
        expect(fields[1].length).toBe(4);
    });

    describe('should calculate perimer', () => {
        it('should get perimeter for square', () => {
            expect(
                getPerimeter([
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [1, 1],
                ])
            ).toBe(8);
        });

        it('should get perimeter for line', () => {
            expect(
                getPerimeter([
                    [0, 0],
                    [0, 1],
                    [0, 2],
                    [0, 3],
                ])
            ).toBe(10);
        });
    });

    it('should get solution for example input', async () => {
        const input = await readFile('src/12/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = solution(parsed);
        expect(result).toBe(1930);
    });

    it('should get solution for puzzle input', async () => {
        const input = await readFile('src/12/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = solution(parsed);
        expect(result).toBe(1573474);
    });

    describe('should calculate sides', () => {
        it('should find 4 sides for square field', () => {
            expect(
                getSides([
                    [0, 0],
                    [0, 1],
                    [1, 0],
                    [1, 1],
                ])
            ).toBe(4);
        });

        it('should find 4 sides for line field', () => {
            expect(
                getSides([
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [0, 2],
                    [0, 3],
                ])
            ).toBe(8);
        });
    });

    it('should get solution for example input part 2', async () => {
        const input = await readFile('src/12/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = solution(parsed, false);
        expect(result).toBe(1206);
    });

    it('should get solution for puzzle input part 2', async () => {
        const input = await readFile('src/12/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = solution(parsed, false);
        expect(result).toBe(966476);
    });
});

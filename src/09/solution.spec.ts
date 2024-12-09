import { readFile } from 'fs/promises';
import { condenseAll, condenseBlocks, getFileBlocks, parseRawData } from './solution';

describe('Day 9', () => {
    it('should parse example input', async () => {
        const input = await readFile('src/09/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(parsed).toMatchObject('2333133121414131402'.split('').map((x) => +x));
    });
    it('should parse puzzle input', async () => {
        const input = await readFile('src/09/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(parsed.length).toBe(19_999);
    });

    it('parse diskmap', () => {
        expect(getFileBlocks([1, 2, 3, 4, 5])).toMatchObject([
            { id: 0, size: 1 },
            { size: 2 },
            { id: 1, size: 3 },
            { size: 4 },
            { id: 2, size: 5 },
        ]);
    });

    it('should calcualte result for example', async () => {
        const input = await readFile('src/09/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const fileBlocks = getFileBlocks(parsed);
        const result = condenseAll(fileBlocks);
        expect(result).toBe(1928);
    });

    it('should calcualte result for puzzle input', async () => {
        const input = await readFile('src/09/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const fileBlocks = getFileBlocks(parsed);
        const result = condenseAll(fileBlocks);
        expect(result).toBeGreaterThan(1120484576298);
        expect(result).toBe(6307275788409);
    });

    it('should calcualte result for example part 2', async () => {
        const input = await readFile('src/09/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const fileBlocks = getFileBlocks(parsed);
        const result = condenseAll(fileBlocks, true);
        expect(result).toBe(2858);
    });

    it('should calcualte result for puzzle input', async () => {
        const input = await readFile('src/09/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const fileBlocks = getFileBlocks(parsed);
        const result = condenseAll(fileBlocks, true);
        expect(result).toBe(6327174563252);
    });
});

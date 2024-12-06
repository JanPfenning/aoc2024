import { readFile } from 'fs/promises';
import {
    createGridVariants,
    getLoopingVariants,
    parseRawData,
    PuzzleInput,
    traverseGridAsGuard,
    uniqueCoordinates,
} from './solution';

describe('Day 6', () => {
    const exampleGrid: PuzzleInput = {
        grid: [
            ['.', '.', '.', '.', '#', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '#', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '#', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '#', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '#', '.'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '#', '.', '.', '.'],
        ],
        guard: { pos: [6, 4], orientation: '^' },
    };

    it('should parse example input', async () => {
        const input = await readFile('src/06/example_input.txt', 'utf8');
        const expectedParseResult = exampleGrid;
        const { grid, guard } = parseRawData(input);
        expect(grid).toMatchObject(expectedParseResult.grid);
        expect(guard).toMatchObject(expectedParseResult.guard);
    });

    it('should get path of example', () => {
        const completePath = traverseGridAsGuard(exampleGrid);
        const uniquePath = uniqueCoordinates(completePath);
        expect(uniquePath.length).toBe(41);
    });

    it('should get path for puzzle input', async () => {
        const input = await readFile('src/06/puzzle_input.txt', 'utf8');
        const parsedInput = parseRawData(input);
        const completePath = traverseGridAsGuard(parsedInput);
        const uniquePath = uniqueCoordinates(completePath);
        expect(uniquePath.length).toBe(5534);
    });

    it('should generate grid variants', () => {
        const variants = createGridVariants([
            ['a', 'b'],
            ['c', 'd'],
        ]);
        expect(variants).toMatchObject([
            [
                ['#', 'b'],
                ['c', 'd'],
            ],
            [
                ['a', '#'],
                ['c', 'd'],
            ],
            [
                ['a', 'b'],
                ['#', 'd'],
            ],
            [
                ['a', 'b'],
                ['c', '#'],
            ],
        ]);
    });

    it('should find looping variants for example', () => {
        const result = getLoopingVariants(exampleGrid);
        expect(result.length).toBe(6);
    });

    it.skip('should get looping alternatives for puzzle input', async () => {
        const input = await readFile('src/06/puzzle_input.txt', 'utf8');
        const parsedInput = parseRawData(input);
        const variants = getLoopingVariants(parsedInput);
        expect(variants.length).toBe(2262);
    });
});

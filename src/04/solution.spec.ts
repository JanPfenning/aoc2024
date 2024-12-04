import { readFile } from 'fs/promises';
import {
    findAllMmasOccurencesInGrid,
    findAllXmasOccurencesInGrid,
    getXmasCoordinatesByStart,
    findPairsOfMas,
    parseRawData,
    PuzzleInput,
} from './solution';

describe('Day 4', () => {
    const exampleInput: PuzzleInput = [
        ['M', 'M', 'M', 'S', 'X', 'X', 'M', 'A', 'S', 'M'],
        ['M', 'S', 'A', 'M', 'X', 'M', 'S', 'M', 'S', 'A'],
        ['A', 'M', 'X', 'S', 'X', 'M', 'A', 'A', 'M', 'M'],
        ['M', 'S', 'A', 'M', 'A', 'S', 'M', 'S', 'M', 'X'],
        ['X', 'M', 'A', 'S', 'A', 'M', 'X', 'A', 'M', 'M'],
        ['X', 'X', 'A', 'M', 'M', 'X', 'X', 'A', 'M', 'A'],
        ['S', 'M', 'S', 'M', 'S', 'A', 'S', 'X', 'S', 'S'],
        ['S', 'A', 'X', 'A', 'M', 'A', 'S', 'A', 'A', 'A'],
        ['M', 'A', 'M', 'M', 'M', 'X', 'M', 'M', 'M', 'M'],
        ['M', 'X', 'M', 'X', 'A', 'X', 'M', 'A', 'S', 'X'],
    ];

    it('should parse example input', async () => {
        const input = await readFile('src/04/example_input.txt', 'utf8');
        const expectedParseResult = exampleInput;
        const parseResult = parseRawData(input);
        expect(parseResult).toMatchObject(expectedParseResult);
    });

    it('should find all xmas coordinates when on X', () => {
        const xmasCoordinates = getXmasCoordinatesByStart(exampleInput, [0, 4]);
        expect(xmasCoordinates).toMatchObject([
            [
                [0, 4],
                [1, 5],
                [2, 6],
                [3, 7],
            ],
        ]);
    });

    it('should find all xmas coordinates of example', () => {
        const coords = findAllXmasOccurencesInGrid(exampleInput);
        expect(coords.length).toBe(18);
    });

    it('should find all xmas coordinates of puzzle input', async () => {
        const input = await readFile('src/04/puzzle_input.txt', 'utf8');
        const parseResult = parseRawData(input);
        const coords = findAllXmasOccurencesInGrid(parseResult);
        expect(coords.length).toBe(2397);
    });

    it('should find all mas patterns of example', () => {
        const pairs = findPairsOfMas(findAllMmasOccurencesInGrid(exampleInput));
        expect(pairs.length / 2).toBe(9);
    });

    it('should find all mas patterns of puzzle input', async () => {
        const input = await readFile('src/04/puzzle_input.txt', 'utf8');
        const parseResult = parseRawData(input);
        const pairs = findPairsOfMas(findAllMmasOccurencesInGrid(parseResult));
        expect(pairs.length / 2).toBe(1824);
    });
});

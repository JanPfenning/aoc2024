import { readFile } from 'fs/promises';
import { getPathOfGuard, parseRawData, getQuadrant, solution } from './solution';
import { Coordinate2D } from '../utils/grid';

describe('Day 14', () => {
    it('should parse input', async () => {
        const input = await readFile('src/14/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(parsed.length).toBe(12);
        expect(parsed[0]).toMatchObject({ startingPosition: [0, 4], velocity: [3, -3] });
    });

    describe('should find fields for example', () => {
        const cases: {
            guard: Parameters<typeof getPathOfGuard>[0];
            dimensions: Parameters<typeof getPathOfGuard>[1];
            expectedPath: ReturnType<typeof getPathOfGuard>;
            partial?: boolean;
        }[] = [
            {
                guard: { startingPosition: [0, 0], velocity: [2, 1] },
                dimensions: { height: 5, width: 2 },
                expectedPath: [
                    [0, 0],
                    [2, 1],
                    [4, 0],
                    [1, 1],
                    [3, 0],
                    [0, 1],
                    [2, 0],
                    [4, 1],
                    [1, 0],
                    [3, 1],
                ],
            },
            {
                guard: { startingPosition: [2, 4], velocity: [2, -3] },
                dimensions: { height: 11, width: 7 },
                expectedPath: [
                    [2, 4],
                    [4, 1],
                    [6, 5],
                ],
                partial: true,
            },
        ];
        it.each(cases)('it', ({ guard, dimensions, expectedPath, partial }) => {
            const path = getPathOfGuard(guard, dimensions);
            expect(path).toMatchObject(partial ? expect.arrayContaining(expectedPath) : expectedPath);
        });
    });

    describe('should get correct quadrant', () => {
        const dimension = { width: 7, height: 11 };
        const cases: { coordinate: Coordinate2D; expectedQuadrant: ReturnType<typeof getQuadrant> }[] = [
            { coordinate: [0, 0], expectedQuadrant: 'NW' },
            { coordinate: [0, 2], expectedQuadrant: 'NW' },
            { coordinate: [4, 0], expectedQuadrant: 'NW' },
            { coordinate: [0, 3], expectedQuadrant: null },
            { coordinate: [0, 7], expectedQuadrant: 'NE' },
            { coordinate: [11, 0], expectedQuadrant: 'SW' },
            { coordinate: [11, 7], expectedQuadrant: 'SE' },
            { coordinate: [5, 0], expectedQuadrant: null },
        ];
        it.each(cases)('it', ({ coordinate, expectedQuadrant }) => {
            expect(getQuadrant(coordinate, dimension)).toBe(expectedQuadrant);
        });
    });

    it('should get locations after n steps for example input', async () => {
        const input = await readFile('src/14/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = solution(parsed);
        expect(result).toBe(12);
    });

    it('should get locations after n steps for puzzle input', async () => {
        const input = await readFile('src/14/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const result = solution(parsed, 100, { height: 101, width: 103 });
        expect(result).toBeGreaterThan(66589600);
        expect(result).toBe(229868730);
    });
});

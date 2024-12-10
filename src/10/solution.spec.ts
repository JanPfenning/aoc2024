import { readFile } from 'fs/promises';
import { getScoreOfTrailhead, getSumOfllScores, parseRawData } from './solution';

describe('Day 10', () => {
    it('should parse example input', async () => {
        const input = await readFile('src/10/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        expect(parsed.length).toBe(8);
        expect(parsed[0].length).toBe(8);
    });

    it('should find all trails for one start', async () => {
        const input = await readFile('src/10/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const score = getScoreOfTrailhead([0, 2], parsed);
        expect(score).toBe(5);
    });

    it('should find all trails and their scores sum for example input', async () => {
        const input = await readFile('src/10/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const score = getSumOfllScores(parsed);
        expect(score).toBe(36);
    });

    it('should find all trails and their scores sum for puzzle input', async () => {
        const input = await readFile('src/10/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const score = getSumOfllScores(parsed);
        expect(score).toBe(674);
    });

    it('should find all trails and their scores sum for part 2 for example input', async () => {
        const input = await readFile('src/10/example_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const score = getSumOfllScores(parsed, false);
        expect(score).toBe(81);
    });

    it('should find all trails and their scores sum for part 2 for puzzle input', async () => {
        const input = await readFile('src/10/puzzle_input.txt', 'utf8');
        const parsed = parseRawData(input);
        const score = getSumOfllScores(parsed, false);
        expect(score).toBe(1372);
    });
});

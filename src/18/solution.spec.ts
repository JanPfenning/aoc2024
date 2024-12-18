import { readFile } from 'fs/promises';
import { binarySearch, parseRawData, solution } from './solution';

describe('Day 18', () => {
    describe('part 1', () => {
        it('example input', async () => {
            const input = await readFile('src/18/example_input.txt', 'utf8');
            const parsed = parseRawData(input);
            const result = solution(parsed.slice(0, 12), { height: 7, width: 7 }).slice(1, undefined);
            expect(result.length).toBe(22);
        });
        it('puzzle input', async () => {
            const input = await readFile('src/18/puzzle_input.txt', 'utf8');
            const parsed = parseRawData(input);
            const result = solution(parsed.slice(0, 1024), { height: 71, width: 71 }).slice(1, undefined);
            expect(result.length).toBeLessThan(299);
            expect(result.length).toBeLessThan(0);
        });
    });

    describe('part 2', () => {
        it('example input', async () => {
            const input = await readFile('src/18/example_input.txt', 'utf8');
            const parsed = parseRawData(input);
            const func = (x: number) => {
                try {
                    solution([...parsed].slice(0, x), { height: 7, width: 7 });
                    return true;
                } catch {
                    return false;
                }
            };
            const result = binarySearch(func, 0, parsed.length);
            expect(parsed[result]).toMatchObject([6, 1]);
        });
        it('puzzle input', async () => {
            const input = await readFile('src/18/puzzle_input.txt', 'utf8');
            const parsed = parseRawData(input);
            const func = (x: number) => {
                try {
                    solution([...parsed].slice(0, x), { height: 71, width: 71 });
                    return true;
                } catch {
                    return false;
                }
            };
            const result = binarySearch(func, 0, parsed.length);
            expect(parsed[result]).toMatchObject([52, 32]);
        });
    });
});

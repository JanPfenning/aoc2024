import { readFile } from 'fs/promises';
import { findAllImprovingCheats, findPathWithoutCheating, parseRawData } from './solution';
import { sum } from '../utils/reduce';

describe('Day 20', () => {
    describe('part 1', () => {
        describe('example input', () => {
            const file = 'src/20/example_input.txt';
            it('should find path without cheating', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                const path = findPathWithoutCheating(parsed);
                const steps = path.length - 1;
                expect(steps).toBe(84);
            });
            it('should find all improving cheats', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                const cheats = findAllImprovingCheats(parsed);
                expect(cheats).toMatchObject({
                    '2': 14,
                    '4': 14,
                    '6': 2,
                    '8': 4,
                    '10': 2,
                    '12': 3,
                    '20': 1,
                    '36': 1,
                    '38': 1,
                    '40': 1,
                    '64': 1,
                });
            });
        });
        describe('puzzle input', () => {
            const file = 'src/20/puzzle_input.txt';
            it('should find path without cheating', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                const path = findPathWithoutCheating(parsed);
                const steps = path.length - 1;
                expect(steps).toBe(9336);
            });
            it('should find all improving cheats', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                const cheats = findAllImprovingCheats(parsed);
                const result = Object.entries(cheats)
                    .filter(([improvements, _amount]) => +improvements >= 100)
                    .map(([_improvements, amount]) => amount)
                    .reduce(sum);
                expect(result).toBeGreaterThan(1349);
                expect(result).toBe(1375);
            });
        });
    });
});

import { readFile } from 'fs/promises';
import { bronKerbosch, findGroupsOfThree, parseRawData } from './solution';
import { lexicographical } from '../utils/sort';

describe('Day 23', () => {
    describe('part 1', () => {
        describe('example', () => {
            const file = 'src/23/example_input.txt';
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                expect(findGroupsOfThree(parsed).length).toBe(7);
            });
        });
        describe('puzzle input', () => {
            const file = 'src/23/puzzle_input.txt';
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                expect(findGroupsOfThree(parsed).length).toBe(1302);
            });
        });
    });
    describe('part 2', () => {
        describe('example input', () => {
            const file = 'src/23/example_input.txt';
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                const subgraphs = bronKerbosch(parsed.adjacencyMatrix);
                const result = subgraphs.sort((a, b) => b.length - a.length)[0];
                expect(result.length).toBe(4);
                expect(
                    result
                        .map((idx) => parsed.legend[idx])
                        .sort(lexicographical)
                        .join(',')
                ).toBe('co,de,ka,ta');
            });
        });
        describe('puzzle input', () => {
            const file = 'src/23/puzzle_input.txt';
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                const subgraphs = bronKerbosch(parsed.adjacencyMatrix);
                const result = subgraphs.sort((a, b) => b.length - a.length)[0];
                expect(
                    result
                        .map((idx) => parsed.legend[idx])
                        .sort(lexicographical)
                        .join(',')
                ).toBe('cb,df,fo,ho,kk,nw,ox,pq,rt,sf,tq,wi,xz');
            });
        });
    });
});

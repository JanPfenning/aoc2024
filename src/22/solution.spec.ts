import { readFile } from 'fs/promises';
import {
    calculateEarnings,
    findNthNumberOf,
    findSequenceWithHighestEarningsAcrossMonkeys,
    getNumBananasForDays,
    getSumOfSecretsAfterN,
    mapEarningsPotentialToSequenceForOneMonkey,
    parseRawData,
    toMap,
} from './solution';

describe('Day 22', () => {
    describe('part 1', () => {
        describe('example', () => {
            const file = 'src/22/example_input.txt';
            const cases: { secretStartNumber: number; result: number; afterSteps: number }[] = [
                { secretStartNumber: 123, result: 15887950, afterSteps: 1 },
                { secretStartNumber: 123, result: 16495136, afterSteps: 2 },
                { secretStartNumber: 123, result: 527345, afterSteps: 3 },
                { secretStartNumber: 123, result: 704524, afterSteps: 4 },
                { secretStartNumber: 123, result: 1553684, afterSteps: 5 },
                { secretStartNumber: 123, result: 12683156, afterSteps: 6 },
                { secretStartNumber: 123, result: 11100544, afterSteps: 7 },
                { secretStartNumber: 123, result: 12249484, afterSteps: 8 },
                { secretStartNumber: 123, result: 7753432, afterSteps: 9 },
                { secretStartNumber: 123, result: 5908254, afterSteps: 10 },
                { secretStartNumber: 1, result: 8685429, afterSteps: 2000 },
                { secretStartNumber: 10, result: 4700978, afterSteps: 2000 },
                { secretStartNumber: 100, result: 15273692, afterSteps: 2000 },
                { secretStartNumber: 2024, result: 8667524, afterSteps: 2000 },
            ];
            it.each(cases)(
                'should find nth secret numbers for start number',
                ({ secretStartNumber: start, result: secretNumber, afterSteps }) => {
                    expect(findNthNumberOf(start, afterSteps)).toBe(secretNumber);
                }
            );
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                expect(getSumOfSecretsAfterN(parsed, 2000)).toBe(37327623);
            });
        });
        describe('puzzle input', () => {
            const file = 'src/22/puzzle_input.txt';
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const parsed = parseRawData(input);
                expect(getSumOfSecretsAfterN(parsed, 2000)).toBe(15303617151);
            });
        });
    });
    describe('part 2', () => {
        describe('example input', () => {
            it('should get all sequence of fours to earn the most bananas', () => {
                const bananasPerDay = getNumBananasForDays(123, 20);
                const res = mapEarningsPotentialToSequenceForOneMonkey(bananasPerDay);
                expect(res.find((e) => e.bananas === 6)!.changes).toMatchObject([-1, -1, 0, 2]);
            });
            it('should find calculate result given the sequence to look for and monkey trades', () => {
                const bananasPerDayPerMonkey = [1, 2, 3, 2024].map((start) => getNumBananasForDays(start, 2000));
                const arrayMap = bananasPerDayPerMonkey.map((monkeysBananasPerDay) =>
                    mapEarningsPotentialToSequenceForOneMonkey(monkeysBananasPerDay)
                );
                const result = calculateEarnings([-2, 1, -1, 3], toMap(arrayMap));
                expect(result).toBe(23);
            });
            it('should find seq of four to earn the most bananas', () => {
                const bananasPerDayPerMonkey = [1, 2, 3, 2024].map((start) => getNumBananasForDays(start, 2000));
                const map = bananasPerDayPerMonkey.map((monkeysBananasPerDay) =>
                    mapEarningsPotentialToSequenceForOneMonkey(monkeysBananasPerDay)
                );
                const res = findSequenceWithHighestEarningsAcrossMonkeys(map);
                expect(res).toMatchObject([-2, 1, -1, 3]);
            });
        });
        describe('puzzle input', () => {
            const file = 'src/22/puzzle_input.txt';
            it('should calcualte result', async () => {
                const input = await readFile(file, 'utf8');
                const monkeyStartSecrets = parseRawData(input);
                const numBananasPerDayPerMonkey = monkeyStartSecrets.map((start) => getNumBananasForDays(start, 2000));
                const map = numBananasPerDayPerMonkey.map((e) => mapEarningsPotentialToSequenceForOneMonkey(e));
                expect(map.length).toBe(1798);
                expect(map[0].length).toBe(2000 - 4);
            });
            it('should find calculate result given the sequence to look for and monkey trades', async () => {
                const input = await readFile(file, 'utf8');
                const monkeyStartSecrets = parseRawData(input);
                const bananasPerDayPerMonkey = monkeyStartSecrets.map((start) => getNumBananasForDays(start, 2000));
                const arrayMap = bananasPerDayPerMonkey.map((monkeysBananasPerDay) =>
                    mapEarningsPotentialToSequenceForOneMonkey(monkeysBananasPerDay)
                );
                const bestSequence = findSequenceWithHighestEarningsAcrossMonkeys(arrayMap);
                const result = calculateEarnings(bestSequence, toMap(arrayMap));
                expect(result).toBe(1727);
            });
        });
    });
});

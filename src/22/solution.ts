import { range } from '../utils/range';
import { sum } from '../utils/reduce';

export type PuzzleInput = number[];

export const parseRawData = (rawData: string): PuzzleInput => {
    return rawData.split(/\n/g).map((line) => +line);
};

const PRUNE_MODUL = 16777216;

export const P1 = (secretNumber: number): number => {
    const mul = secretNumber * 64;
    secretNumber = (mul ^ secretNumber) >>> 0;
    secretNumber = secretNumber % PRUNE_MODUL;
    return secretNumber;
};

export const P2 = (secretNumber: number): number => {
    const div = Math.floor(secretNumber / 32);
    secretNumber = (div ^ secretNumber) >>> 0;
    secretNumber = secretNumber % PRUNE_MODUL;
    return secretNumber;
};

export const P3 = (secretNumber: number): number => {
    const mul2 = secretNumber * 2048;
    secretNumber = (mul2 ^ secretNumber) >>> 0;
    secretNumber = secretNumber % PRUNE_MODUL;
    return secretNumber;
};

export function findNthNumberOf(start: number, n: number): number {
    return range(n).reduce((currentSecretNumber, _) => {
        let secretNumber = currentSecretNumber;
        secretNumber = P1(secretNumber);
        secretNumber = P2(secretNumber);
        secretNumber = P3(secretNumber);
        return secretNumber;
    }, start);
}

export const getSumOfSecretsAfterN = (initialSecrets: number[], n: number): number => {
    return initialSecrets.map((initialSecret) => findNthNumberOf(initialSecret, n)).reduce(sum);
};

/**
 *
 * PART 2
 *
 */

export function findAllNthNumberOf(start: number, n: number): number[] {
    return range(n).reduce((results, _) => {
        let secretNumber = results[results.length - 1] || start;
        secretNumber = P1(secretNumber);
        secretNumber = P2(secretNumber);
        secretNumber = P3(secretNumber);
        results.push(secretNumber);
        return results;
    }, [] as number[]);
}

export const getDiffs = (arr: number[]): number[] => arr.slice(1).map((num, index) => num - arr[index]);

export const getNumBananasForDays = (initialSecrets: number, n: number): number[] => {
    return findAllNthNumberOf(initialSecrets, n).map((num) => num % 10);
};

export const mapEarningsPotentialToSequenceForOneMonkey = (
    bananasPerDay: number[]
): {
    bananas: number;
    changes: number[];
}[] => {
    const diffs = getDiffs(bananasPerDay);
    return [...bananasPerDay].slice(4).map((bananas, day) => {
        return { bananas, changes: [diffs[day], diffs[day + 1], diffs[day + 2], diffs[day + 3]] };
    });
};

export const findSequenceWithHighestEarningsAcrossMonkeys = (
    earningPotentialForSequencePerMonkey: {
        bananas: number;
        changes: number[];
    }[][],
    bruteForceAlg = true
): [number, number, number, number] => {
    return (bruteForceAlg ? bruteForce : smart)(earningPotentialForSequencePerMonkey);
};

const smart = (
    earningPotentialForSequencePerMonkey: {
        bananas: number;
        changes: number[];
    }[][]
): [number, number, number, number] => {
    earningPotentialForSequencePerMonkey.map((monkey) => monkey.map((day) => day.bananas));
    throw new Error('not implemented');
    /**
     * 
     * i have an array of monkeys (corresponding to the name). Each monkey in this array is an array itself representing how many bananas (thing in the cell which sum we want to optimize) are given for a sequence (corresponding to the incremental number earlier). not all monkeys have all sequences, the bananas for these are thought of as 0. 

        how to make this a highly performant matrix with the monkeys as rows and the sequences as columns (all sequences, padding missing ones as 0)?

        so i can then find the column which produces the maximum column sum. 

        write ts code for this
     */
};

const bruteForce = (
    earningPotentialForSequencePerMonkey: {
        bananas: number;
        changes: number[];
    }[][]
): [number, number, number, number] => {
    const allPossibleSequences = new Set<string>(
        earningPotentialForSequencePerMonkey
            .map((earningsPerSequenceOfOneMonkey) =>
                earningsPerSequenceOfOneMonkey.map((obj) => JSON.stringify(obj.changes))
            )
            .flat()
    );
    console.log('found', allPossibleSequences.size, 'possible sequences to stop');
    const map = toMap(earningPotentialForSequencePerMonkey);
    console.log('calculated map for faster access');
    const startTime = new Date().getTime();
    const stringRepOfBestSeq = [...allPossibleSequences.values()]
        .map((e, idx) => {
            if (idx % 100 === 0 || idx === 5) {
                const remainingCount = allPossibleSequences.size - idx;
                const elapsedMillis = new Date().getTime() - startTime;
                const estimatedTimePerItem = elapsedMillis / idx;
                const estimatedRemainingTime = (estimatedTimePerItem * remainingCount) / 60000;
                console.log(
                    idx,
                    '/',
                    allPossibleSequences.size,
                    '(',
                    ((idx / allPossibleSequences.size) * 100).toFixed(2),
                    '%)',
                    '[in',
                    elapsedMillis,
                    'millis, expected time remaining: ',
                    estimatedRemainingTime.toFixed(2),
                    'minutes]'
                );
            }
            return {
                sequence: e,
                sumOfBananas: calculateEarnings(JSON.parse(e) as [number, number, number, number], map),
            };
        })
        .sort((a, b) => b.sumOfBananas - a.sumOfBananas)[0].sequence;
    return JSON.parse(stringRepOfBestSeq);
};

type SequenceAsString = string; // [number, number, number, number]
export const toMap = (
    earningPotentialForSequencePerMonkey: {
        bananas: number;
        changes: number[];
    }[][]
): Record<SequenceAsString, number>[] => {
    const startTime = new Date().getTime();

    const earningsPerMonkey: Record<SequenceAsString, number>[] = earningPotentialForSequencePerMonkey.map(
        (daysPotentialOfMonkey, idx) => {
            if (idx % 50 === 0) {
                const remainingCount = earningPotentialForSequencePerMonkey.length - idx;
                const elapsedMillis = new Date().getTime() - startTime;
                const estimatedTimePerItem = elapsedMillis / idx;
                const estimatedRemainingTime = (estimatedTimePerItem * remainingCount) / 60000;
                console.log(
                    idx,
                    '/',
                    earningPotentialForSequencePerMonkey.length,
                    '(',
                    ((idx / earningPotentialForSequencePerMonkey.length) * 100).toFixed(2),
                    '%)',
                    '[in',
                    elapsedMillis,
                    'millis, expected time remaining: ',
                    estimatedRemainingTime.toFixed(2),
                    'minutes]'
                );
            }
            return daysPotentialOfMonkey.reduce(
                (acc, iter) => {
                    const key = JSON.stringify(iter.changes);
                    if (acc[key] !== undefined) return acc;
                    return { ...acc, [key]: iter.bananas };
                },
                {} as Record<SequenceAsString, number>
            );
        }
    );
    return earningsPerMonkey;
};

export const calculateEarnings = (
    sequenceToSell: [number, number, number, number],
    earningPotentialForSequencePerMonkey: Record<SequenceAsString, number>[]
) => {
    const earningsPerMonkey = earningPotentialForSequencePerMonkey.map(
        (daysPotentialOfMonkey) => daysPotentialOfMonkey[JSON.stringify(sequenceToSell)] ?? 0
    );
    return earningsPerMonkey.reduce(sum);
};

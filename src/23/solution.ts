import { zip } from './../utils/zip';
import { asManyCharSeperatedLists } from '../utils/parse';
import { lexicographical, min } from '../utils/sort';
import { range } from '../utils/range';

type PuzzleInput = { legend: string[]; adjacencyMatrix: boolean[][] };
export const parseRawData = (rawData: string): PuzzleInput => {
    const twoNodeLinks = asManyCharSeperatedLists('-', rawData);
    const computers = new Set(twoNodeLinks.flat());
    const sortedComputers = [...computers.values()].sort(lexicographical);
    const adjacencyMatrix = sortedComputers.map((computer) =>
        sortedComputers.map(
            (x) => !!twoNodeLinks.find(([a, b]) => (a === computer && b === x) || (a === x && b === computer))
        )
    );
    return { legend: sortedComputers, adjacencyMatrix };
};

export const findGroupsOfThree = ({ legend, adjacencyMatrix }: PuzzleInput): [number, number, number][] => {
    const tIndices = legend
        .map((name, index) => [name, index] as [string, number])
        .filter(([name, _index]) => name[0] === 't');
    const combinations: [number, number, number][] = tIndices
        .map(([_tName, tIndex]) => {
            const bs: number[] = (zip(adjacencyMatrix[tIndex]!, range(legend.length)) as [boolean, number][])
                .filter(([connected]) => connected)
                .map(([_, connection]) => connection);
            return bs
                .map((bIndex) => {
                    const cs: number[] = (zip(adjacencyMatrix[bIndex]!, range(legend.length)) as [boolean, number][])
                        .filter(([connected]) => connected)
                        .map(([_, connection]) => connection);
                    return cs
                        .filter((cIndex) => adjacencyMatrix[tIndex][cIndex] === true)
                        .map((c) => [tIndex, bIndex, c] as [number, number, number]);
                })
                .flat();
        })
        .flat();
    const res = combinations.map((x) => JSON.stringify(x.sort(min)));
    return [...new Set(res).values()].map((x) => JSON.parse(x));
};

/**
 * PART 2
 *
 */

export const bronKerbosch = (adjacencyMatrix: boolean[][]): number[][] => {
    const n = adjacencyMatrix.length;
    const allVertices = new Set(Array.from({ length: n }, (_, i) => i));

    const getNeighbors = (v: number): Set<number> => {
        return new Set(
            adjacencyMatrix[v].reduce((acc, connected, i) => {
                if (connected && i !== v) acc.push(i);
                return acc;
            }, [] as number[])
        );
    };

    const bronKerboschRecursive = (R: Set<number>, P: Set<number>, X: Set<number>, result: number[][]): void => {
        if (P.size === 0 && X.size === 0) {
            result.push(Array.from(R));
            return;
        }

        const pivotNeighbors = getNeighbors(Array.from(P.size ? P : X)[0]);
        const PminusNeighbors = new Set([...P].filter((v) => !pivotNeighbors.has(v)));

        for (const v of PminusNeighbors) {
            const neighbors = getNeighbors(v);
            bronKerboschRecursive(
                new Set([...R, v]),
                new Set([...P].filter((p) => neighbors.has(p))),
                new Set([...X].filter((x) => neighbors.has(x))),
                result
            );
            P.delete(v);
            X.add(v);
        }
    };

    const result: number[][] = [];
    bronKerboschRecursive(new Set(), allVertices, new Set(), result);
    return result;
};

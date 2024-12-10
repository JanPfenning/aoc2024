import { isUniqueTuple } from '../utils/filter';
import { asCharMatrix } from '../utils/parse';
import { range } from '../utils/range';

export type PuzzleInput = string[][];

export const parseRawData = (rawData: string): PuzzleInput => {
    return asCharMatrix(rawData);
};
type Vector = [number, number];
export const getVectorBetween = (source: Vector, target: Vector): Vector => {
    return [-source[0] + target[0], -source[1] + target[1]];
};

type Antenna = { vector: Vector; symbol: string };
export const getAllAntennas = (grid: PuzzleInput): Antenna[] => {
    const antennas: Antenna[] = [];
    grid.forEach((line, y) =>
        line.forEach((col, x) => {
            if (col !== '.') antennas.push({ vector: [x, y], symbol: col });
        })
    );
    return antennas;
};

export const getAntinodeLocation = (antennaA: Vector, antennaB: Vector, n: number = 1): Vector => {
    const vectorFromAToB = getVectorBetween(antennaA, antennaB);
    return [antennaB[0] + n * vectorFromAToB[0], antennaB[1] + n * vectorFromAToB[1]];
};

type Antinode = { vector: Vector; parents: [Vector, Vector] };
export const getAntinodesOfAntennaPair = (a: Vector, b: Vector, gridSize = 2): Antinode[] => {
    return range(1, gridSize).map((x) => ({ vector: getAntinodeLocation(a, b, x), parents: [a, b] }));
};

export const getAntennaGroups = (grid: PuzzleInput): Record<string, Antenna[]> => {
    const allAntennas = getAllAntennas(grid);
    return allAntennas.reduce(
        (acc, iter) => {
            return { ...acc, [iter.symbol]: acc[iter.symbol] ? [...acc[iter.symbol], iter] : [iter] };
        },
        {} as Record<string, Antenna[]>
    );
};

export const getCombinationOfAntennas = (antennas: Antenna[]): [Antenna, Antenna][] => {
    const combinations: [Antenna, Antenna][] = [];

    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            combinations.push([antennas[i], antennas[j]]);
            combinations.push([antennas[j], antennas[i]]);
        }
    }

    return combinations;
};

export const getAllAntennaPairs = (grid: PuzzleInput): Record<string, [Antenna, Antenna][]> => {
    const antennaGroups: Record<string, Antenna[]> = getAntennaGroups(grid);
    return Object.fromEntries(
        Object.entries(antennaGroups).map(([key, value]) => [key, getCombinationOfAntennas(value)])
    );
};

export const filterBadAntinodes = (grid: PuzzleInput, antinodesLoc: Vector[]): Vector[] => {
    return antinodesLoc.filter((antinodeLoc) => coordinateWithinRectangularGrid(grid, antinodeLoc));
};

export const coordinateWithinRectangularGrid = (grid: unknown[][], coordinate: Vector): boolean => {
    if (coordinate[0] < 0) return false;
    if (coordinate[1] < 0) return false;
    if (coordinate[0] > grid.length - 1) return false;
    if (coordinate[1] > grid[0].length - 1) return false;
    return true;
};

export const getAllAntinodes = (grid: PuzzleInput, multiSteps: boolean = false): Vector[] => {
    const allAntennaPairs = getAllAntennaPairs(grid);
    const antennaPairsResultingInAntinodes = Object.values(allAntennaPairs)
        .flat()
        .map(([a, b]) => [a.vector, b.vector]);
    const antinodesLocations = antennaPairsResultingInAntinodes
        .map(([a, b]) => getAntinodesOfAntennaPair(a, b, multiSteps ? grid.length : undefined))
        .flat()
        .map((antinode) => antinode.vector);
    if (multiSteps) {
        const originalAntennasToAdd: Vector[] = Object.values(allAntennaPairs)
            .flat()
            .map((pair) => pair[0].vector);
        antinodesLocations.push(...originalAntennasToAdd);
    }
    const validAntinodeLocations = filterBadAntinodes(grid, antinodesLocations).filter(isUniqueTuple);
    drawAntinodes(grid, validAntinodeLocations, false);
    return validAntinodeLocations;
};

const drawAntinodes = (grid: PuzzleInput, antinodeLocations: Vector[], overrideAntennas: boolean = true): void => {
    console.log(
        grid
            .map((line, y) =>
                line
                    .map((char, x) =>
                        !overrideAntennas && char !== '.'
                            ? char
                            : antinodeLocations.some(([a, b]) => b === y && a === x)
                              ? '#'
                              : char
                    )
                    .join('')
            )
            .join('\n')
    );
};

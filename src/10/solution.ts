import { asDigitMatrix } from '../utils/parse';
import { sum } from '../utils/reduce';
import { isUniqueTuple } from '../utils/filter';

export type PuzzleInput = number[][];

export const parseRawData = (rawData: string): PuzzleInput => {
    return asDigitMatrix(rawData);
};

type Coordinate = [number, number]; // row, col
export const getTrailheads = (grid: PuzzleInput): Coordinate[] => {
    const trailheads: Coordinate[] = [];
    grid.forEach((line, row) =>
        line.forEach((char, col) => {
            if (char === 0) trailheads.push([row, col]);
        })
    );
    return trailheads;
};

export const getTrailPosition = (
    unsafeCoordinate: Coordinate,
    grid: PuzzleInput
): { height: number; row: number; col: number } | null => {
    if (unsafeCoordinate[0] < 0) return null;
    if (unsafeCoordinate[1] < 0) return null;
    if (unsafeCoordinate[0] >= grid.length) return null;
    if (unsafeCoordinate[1] >= grid[0].length) return null;
    return {
        height: grid[unsafeCoordinate[0]][unsafeCoordinate[1]],
        row: unsafeCoordinate[0],
        col: unsafeCoordinate[1],
    };
};

export type Trail = Coordinate[];
export const findTrailsFromHead = (currentTrail: Trail, grid: PuzzleInput): Trail[] => {
    const currentTrailPosition = getTrailPosition(currentTrail[currentTrail.length - 1], grid)!;
    if (currentTrailPosition.height === 9) return [currentTrail];
    const north = getTrailPosition([currentTrailPosition.row - 1, currentTrailPosition.col], grid);
    const south = getTrailPosition([currentTrailPosition.row + 1, currentTrailPosition.col], grid);
    const west = getTrailPosition([currentTrailPosition.row, currentTrailPosition.col - 1], grid);
    const east = getTrailPosition([currentTrailPosition.row, currentTrailPosition.col + 1], grid);
    const next = [north, south, west, east]
        .map((nextPos) => {
            const nexPosIsValid = nextPos?.height === currentTrailPosition.height + 1;
            return nexPosIsValid ? findTrailsFromHead([...currentTrail, [nextPos.row, nextPos.col]], grid) : undefined;
        })
        .filter((e) => e !== undefined)
        .flat();
    return next;
};

export const getScoreOfTrailhead = (trailhead: Coordinate, grid: PuzzleInput, filterUnique = true): number => {
    const trailsFromTrailhead = findTrailsFromHead([trailhead], grid);
    return trailsFromTrailhead.map((trail) => trail[9]).filter(filterUnique ? isUniqueTuple : () => true).length;
};

export const getSumOfllScores = (grid: PuzzleInput, filterUnique = true): number => {
    const trailheads = getTrailheads(grid);
    return trailheads.map((trailhead) => getScoreOfTrailhead(trailhead, grid, filterUnique)).reduce(sum);
};

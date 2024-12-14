import { Coordinate2D } from '../utils/grid';
import { asManyCharSeperatedLists } from '../utils/parse';
import { group, product } from '../utils/reduce';

type GuardDefinition = { startingPosition: Coordinate2D; velocity: Coordinate2D };
export type PuzzleInput = GuardDefinition[];

export const parseRawData = (rawData: string): PuzzleInput => {
    const lines = asManyCharSeperatedLists(' ', rawData) as [string, string][];
    return lines.map(([p, v]) => ({
        startingPosition: p.match(/-?\d+/g)!.map((x) => +x) as [number, number],
        velocity: v.match(/-?\d+/g)!.map((x) => +x) as [number, number],
    }));
};

export const getPathOfGuard = (
    { startingPosition, velocity }: GuardDefinition,
    { width, height }: { width: number; height: number }
): Coordinate2D[] => {
    const path: Coordinate2D[] = [];
    let curPos = startingPosition;
    const matchingCoordinate = (toFind: Coordinate2D) => (p: Coordinate2D) => p[0] === toFind[0] && p[1] === toFind[1];
    while (!path.find(matchingCoordinate(curPos))) {
        path.push(curPos);
        curPos = moveGuard(curPos, velocity, { width, height });
    }
    return path;
};

export const moveGuard = (
    currentPos: Coordinate2D,
    velocity: GuardDefinition['velocity'],
    { width, height }: { width: number; height: number }
): Coordinate2D => {
    return [(currentPos[0] + velocity[0] + height) % height, (currentPos[1] + velocity[1] + width) % width];
};

export const getQuadrant = (
    location: Coordinate2D, // [x, y]
    dimension: { width: number; height: number }
): 'NW' | 'NE' | 'SE' | 'SW' | null => {
    if (location[1] === Math.ceil(dimension.width / 2) - 1) return null;
    if (location[0] === Math.ceil(dimension.height / 2) - 1) return null;
    return `${location[0] < dimension.height / 2 ? 'N' : 'S'}${location[1] < dimension.width / 2 ? 'W' : 'E'}`;
};

export const getLocationAfterN = (
    n: number,
    guard: GuardDefinition,
    dimension: { width: number; height: number }
): Coordinate2D => {
    const path = getPathOfGuard(guard, dimension);
    return path[n % path.length];
};

export const solution = (
    input: PuzzleInput,
    steps: number = 100,
    dimension: { height: number; width: number } = { height: 11, width: 7 }
) => {
    const endLocations = input.map((g) => getLocationAfterN(steps, g, dimension));
    const quadrants = endLocations.map((l) => getQuadrant(l, dimension));
    const quadrantCountMap: Record<string, number> = quadrants.filter((q) => q !== null).reduce(group, {});
    return Object.values(quadrantCountMap).reduce(product);
};

import { asCharMatrix } from '../utils/parse';

type Orientation = '^' | '>' | '<' | 'v';
type Coordinate = [number, number];
type Guard = { pos: Coordinate; orientation: Orientation };
export type PuzzleInput = { grid: string[][]; guard: Guard };

export const parseRawData = (rawData: string): PuzzleInput => {
    const matrix = asCharMatrix(rawData);
    const guardPos = getGuardPos(matrix);
    const guardSymbol = matrix[guardPos[0]][guardPos[1]] as Orientation;
    matrix[guardPos[0]][guardPos[1]] = '.';
    return { grid: matrix, guard: { pos: guardPos, orientation: guardSymbol } };
};

export const getGuardPos = (grid: PuzzleInput['grid']): Coordinate => {
    const rowIndex = grid.findIndex(
        (row) => row.includes('^') || row.includes('>') || row.includes('<') || row.includes('v')
    );
    const colIndex = grid[rowIndex].findIndex((cell) => cell === '^' || cell === '>' || cell === '<' || cell === 'v');
    return [rowIndex, colIndex];
};

export const uniqueCoordinates = (coords: Coordinate[]): Coordinate[] => {
    return [...new Set(coords.map((coord) => JSON.stringify(coord))).values()].map(
        (strCoord) => JSON.parse(strCoord) as [number, number]
    );
};

export const traverseGridAsGuard = (
    { grid, guard }: PuzzleInput,
    visited: Coordinate[] = [guard.pos]
): Coordinate[] => {
    // drawGrid({ grid, guard });
    const nextPos = getNextGuardPosition(grid, guard);
    if (!nextPos) return visited;
    return traverseGridAsGuard({ grid, guard: nextPos }, [...visited, nextPos.pos]);
};

export const getNextGuardPosition = (
    grid: PuzzleInput['grid'],
    { pos: guardPos, orientation }: PuzzleInput['guard']
): Guard | null => {
    const nextPos: Coordinate =
        orientation === '^'
            ? [guardPos[0] - 1, guardPos[1]]
            : orientation === 'v'
              ? [guardPos[0] + 1, guardPos[1]]
              : orientation === '>'
                ? [guardPos[0], guardPos[1] + 1]
                : [guardPos[0], guardPos[1] - 1];
    if (nextPos[0] < 0 || nextPos[1] < 0 || nextPos[0] >= grid.length || nextPos[1] >= grid[0].length) return null;
    // if nextPos has stone rotate and return oldPos => next iteration will have different result for this position as guard is now facing differntly
    if (grid[nextPos[0]][nextPos[1]] === '#') return { pos: guardPos, orientation: rotationMap[orientation] };
    return { pos: nextPos, orientation };
};

const rotationMap = {
    '^': '>',
    '>': 'v',
    'v': '<',
    '<': '^',
} as const;

export const createGridVariants = (grid: PuzzleInput['grid'], coordinates?: Coordinate[]): PuzzleInput['grid'][] => {
    const variants: string[][][] = [];
    const rows = grid.length;
    const cols = grid[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!coordinates || coordinates.find((e) => e[0] === i && e[1] === j)) {
                const variant = JSON.parse(JSON.stringify(grid)) as string[][];
                if (
                    variant[i][j] !== '#' &&
                    variant[i][j] !== '^' &&
                    variant[i][j] !== '>' &&
                    variant[i][j] !== '<' &&
                    variant[i][j] !== 'v'
                ) {
                    variant[i][j] = '#';
                    variants.push(variant);
                }
            }
        }
    }

    return variants;
};

export const traverseGridAsGuardWithLoops = (
    { grid, guard }: PuzzleInput,
    visited: PuzzleInput['guard'][] = [guard]
): { path: PuzzleInput['guard'][]; loop: boolean } => {
    const nextPos = getNextGuardPosition(grid, guard);
    if (!nextPos) return { path: visited, loop: false };
    const wasVisitedWithOrientation = !!visited.find(
        (e) => e.orientation === nextPos.orientation && e.pos[0] === nextPos.pos[0] && e.pos[1] === nextPos.pos[1]
    );
    if (wasVisitedWithOrientation) return { path: visited, loop: true };
    return traverseGridAsGuardWithLoops({ grid, guard: nextPos }, [...visited, nextPos]);
};

export const getLoopingVariants = (input: PuzzleInput) => {
    const completePath = traverseGridAsGuard(input);
    const uniquePath = uniqueCoordinates(completePath);
    const grids = createGridVariants(input.grid, uniquePath);
    let start = new Date();
    return grids.filter((grid, idx) => {
        if (idx % 25 === 0) {
            const took: number = new Date().getTime() - start.getTime();
            console.log(idx, took);
            start = new Date();
        }
        return traverseGridAsGuardWithLoops({ grid, guard: input.guard }).loop;
    });
};

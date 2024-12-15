import { Coordinate2D, findAllOccurencesOfElement, rotate, rotateCoordinate } from './../utils/grid';
import { Grid } from '../utils/grid';
import { asCharMatrix } from '../utils/parse';
import { range } from '../utils/range';
import { sum } from '../utils/reduce';

export type Instruction = '<' | '>' | 'v' | '^';
export type GridSymbol = '#' | '.' | 'O' | '@';
export type PuzzleInput = { grid: Grid<GridSymbol>; instructions: Instruction[] };

export const parseRawData = (rawData: string): PuzzleInput => {
    const [rawGrid, rawInstructions] = rawData.split('\n\n');
    return {
        grid: asCharMatrix(rawGrid) as PuzzleInput['grid'],
        instructions: rawInstructions.replace(/\n/g, '').split('') as Instruction[],
    };
};

const deltaMap: Record<Instruction, [number, number]> = {
    '<': [0, -1],
    '>': [0, 1],
    '^': [-1, 0],
    'v': [1, 0],
};
export const getSymbolInDirection = (
    direction: Instruction,
    current: Coordinate2D,
    grid: PuzzleInput['grid']
): GridSymbol => {
    const destination = [current[0] + deltaMap[direction][0], current[1] + deltaMap[direction][1]];
    return grid[destination[0]][destination[1]];
};

export const canMoveInDirection = (
    direction: Instruction,
    current: Coordinate2D,
    grid: PuzzleInput['grid']
): boolean => {
    let next = current;
    while (true) {
        const symbolInDirection = getSymbolInDirection(direction, next, grid);
        if (symbolInDirection === '#') return false;
        if (symbolInDirection === '.') return true;
        next = [next[0] + deltaMap[direction][0], next[1] + deltaMap[direction][1]];
    }
};

export const push = (
    direction: Instruction,
    grid: PuzzleInput['grid'],
    current: Coordinate2D = findAllOccurencesOfElement('@', grid)[0]
): PuzzleInput['grid'] => {
    if (!canMoveInDirection(direction, current, grid)) return grid;

    const rotation = direction === '<' ? 0 : direction === 'v' ? 1 : direction === '>' ? 2 : 3;
    grid = rotate(grid, rotation);
    current = rotateCoordinate(grid, current, rotation);

    const index = grid[current[0]].findLastIndex((e, idx) => idx < current[1] && e === '.');

    const updates: [Coordinate2D, GridSymbol][] = range(index, current[1] + 1).map((idx) => [[current[0], idx], 'O']);
    updates[updates.length - 2][1] = '@';
    updates[updates.length - 1][1] = '.';
    grid = grid.map((line, row) =>
        line.map((char, col) => {
            const update = updates.find((update) => update[0][0] === row && update[0][1] === col);
            if (!update) return char;
            return update[1];
        })
    );

    grid = rotate(grid, 4 - rotation);
    return grid;
};

export const run = ({ grid: initialGrid, instructions }: PuzzleInput) => {
    let grid = JSON.parse(JSON.stringify(initialGrid));
    instructions.forEach((instruction) => (grid = push(instruction, grid)));
    const boxLocations = findAllOccurencesOfElement('O', grid);
    return boxLocations.map(([row, col], _index) => row * 100 + col).reduce(sum);
};

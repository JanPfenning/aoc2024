import { transformToMaze } from './../utils/maze';
import { Coordinate2D, drawGrid, Grid, rotate } from '../utils/grid';
import { dijkstra, Maze } from '../utils/maze';
import { asManyCharSeperatedNumberLists } from '../utils/parse';

export type PuzzleInput = Coordinate2D[];
export const parseRawData = (input: string): PuzzleInput => {
    return asManyCharSeperatedNumberLists(',', input).map((x) => [x[0], x[1]]);
};

export const generateGrid = (
    dimensions: { height: number; width: number },
    defaultSymbol: string,
    marks: Record<string | symbol, Coordinate2D[]>
): Grid<typeof defaultSymbol | keyof typeof marks> => {
    const { height, width } = dimensions;
    const grid: string[][] = [];

    for (let y = 0; y < height; y++) {
        grid[y] = new Array(width).fill(defaultSymbol);
    }

    for (const [symbol, coordinates] of Object.entries(marks)) {
        for (const [x, y] of coordinates) {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                grid[y][x] = symbol;
            }
        }
    }

    return grid as Grid<typeof defaultSymbol | keyof typeof marks>;
};

export const solution = (walls: Coordinate2D[], dimensions: { height: number; width: number }): Coordinate2D[] => {
    const WALL_SYMBOL = '#';
    const FLOOR_SYMBOL = '.';
    const grid: Grid<typeof WALL_SYMBOL | typeof FLOOR_SYMBOL> = generateGrid(dimensions, '.', {
        '#': walls,
    }) as Grid<typeof WALL_SYMBOL | typeof FLOOR_SYMBOL>;
    drawGrid(grid);
    const maze: Maze = transformToMaze(grid, '#');
    const path = dijkstra(maze, [0, 0], [dimensions.height - 1, dimensions.width - 1]);
    drawGrid(grid, { coordinates: path.map((c) => [c[1], c[0]]), symbol: 'O' });
    return path;
};

export const binarySearch = (func: (x: number) => boolean, lower_bound: number, upper_bound: number): number => {
    const newIdx = Math.floor((upper_bound + lower_bound) / 2);
    const res = func(newIdx);
    if (newIdx === lower_bound) return newIdx;
    return res ? binarySearch(func, newIdx, upper_bound) : binarySearch(func, lower_bound, newIdx);
};

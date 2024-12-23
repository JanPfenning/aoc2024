import { cloneGrid, Coordinate2D, findAllOccurencesOfElement, getAdjacentcyInformation, Grid } from '../utils/grid';
import { dijkstra, transformToMaze } from '../utils/maze';
import { asCharMatrix } from '../utils/parse';
import { group } from '../utils/reduce';

type GridSymbol = '#' | '.' | 'S' | 'E';
export type PuzzleInput = Grid<GridSymbol>;

const trimGrid = (grid: Grid<GridSymbol>): Grid<GridSymbol> => {
    return grid.slice(1, -1).map((row) => row.slice(1, -1));
};

export const parseRawData = (rawData: string): PuzzleInput => {
    return trimGrid(asCharMatrix(rawData) as Grid<GridSymbol>);
};

type Cheat = Coordinate2D;

export const findPathWithoutCheating = (input: PuzzleInput) => {
    const maze = transformToMaze(input, '#');
    const start = findAllOccurencesOfElement('S', input)[0];
    const end: Coordinate2D = findAllOccurencesOfElement('E', input)[0];
    const path = dijkstra(maze, start, end);
    return path;
};

export const findPathWithCheat = (input: PuzzleInput, cheat: Cheat): Coordinate2D[] => {
    const grid = cloneGrid(input);
    if (grid[cheat[0]][cheat[1]] === '#') grid[cheat[0]][cheat[1]] = '.';
    return findPathWithoutCheating(grid);
};

export const calculateSkips = (grid: PuzzleInput): Cheat[] => {
    const potentialSkipStarts: Cheat[] = findElementsAdjacentTo(grid, '#', '.');
    const skips: Cheat[] = potentialSkipStarts.filter((firstStep) => {
        const potentialSecondSteps = getAdjacentcyInformation(firstStep, grid);
        const willBeDeadEnd = Object.values(potentialSecondSteps).filter((e) => e?.element === '.' || 'E');
        return willBeDeadEnd;
    });
    return skips;
};

export const findElementsAdjacentTo = (
    grid: Grid<GridSymbol>,
    symbolA: GridSymbol,
    symbolB: GridSymbol
): Coordinate2D[] => {
    const allSymbolALocations = findAllOccurencesOfElement(symbolA, grid);
    return allSymbolALocations.filter((coord) =>
        Object.values(getAdjacentcyInformation(coord, grid)).some((value) => value?.element === symbolB)
    );
};

export const findAllImprovingCheats = (input: PuzzleInput): Record<string, number> => {
    const skips = calculateSkips(input);
    console.log('found', skips.length, 'potential skips');
    const path = findPathWithoutCheating(input);
    const originalSteps = path.length - 1;
    const startTime = new Date().getTime();
    const cheatedPathsImprovements = skips.map((skip, idx) => {
        const res = findPathWithCheat(input, skip);
        if (idx % 500 === 0)
            console.log('took', new Date().getTime() - startTime, 'millis for 1 through', idx + 1, 'of', skips.length);
        return originalSteps - (res.length - 1);
    });
    const mapImprovementToNumberOfCheatsWithThisImprovement = cheatedPathsImprovements
        // map to improvements
        .reduce(group, {});
    return mapImprovementToNumberOfCheatsWithThisImprovement;
};

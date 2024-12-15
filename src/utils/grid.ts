export type GridContent = string | number | symbol;
export type Grid<T extends GridContent> = T[][];

export type Coordinate2D = [number, number];

export const getAdjacentcyInformation = <T extends GridContent>(
    base: Coordinate2D,
    grid: Grid<T>
): {
    n: { location: Coordinate2D; element: T } | null;
    s: { location: Coordinate2D; element: T } | null;
    w: { location: Coordinate2D; element: T } | null;
    e: { location: Coordinate2D; element: T } | null;
} => {
    const unsafeCoordN: Coordinate2D = [base[0] - 1, base[1]];
    const nElement = getGridElement(unsafeCoordN, grid);
    const unsafeCoordS: Coordinate2D = [base[0] + 1, base[1]];
    const sElement = getGridElement(unsafeCoordS, grid);
    const unsafeCoordW: Coordinate2D = [base[0], base[1] - 1];
    const wElement = getGridElement(unsafeCoordW, grid);
    const unsafeCoordE: Coordinate2D = [base[0], base[1] + 1];
    const eElement = getGridElement(unsafeCoordE, grid);
    return {
        n: nElement ? { location: unsafeCoordN, element: nElement } : null,
        s: sElement ? { location: unsafeCoordS, element: sElement } : null,
        w: wElement ? { location: unsafeCoordW, element: wElement } : null,
        e: eElement ? { location: unsafeCoordE, element: eElement } : null,
    };
};

export const getGridElement = <T extends GridContent>(coordinate: Coordinate2D, grid: Grid<T>): T | null => {
    const row = coordinate[0];
    const col = coordinate[1];
    if (row < 0 || col < 0) return null;
    if (row > grid.length - 1) return null;
    if (col > grid[0].length - 1) return null;
    return grid[row][col];
};

export const findAllOccurencesOfElement = <T extends GridContent>(element: T, grid: Grid<T>) => {
    const elements: Coordinate2D[] = [];
    grid.forEach((line, row) =>
        line.forEach((char, col) => {
            if (char === element) elements.push([row, col]);
        })
    );
    return elements;
};

export const drawGrid = <T extends GridContent>(
    grid: Grid<T>,
    highlight: { coordinates: Coordinate2D[]; symbol: string } = { coordinates: [], symbol: '#' }
): void => {
    console.log(
        grid
            .map((line, y) =>
                line
                    .map((originalChar, x) =>
                        highlight.coordinates.some(([a, b]) => b === y && a === x) ? highlight.symbol : originalChar
                    )
                    .join('')
            )
            .join('\n')
    );
};

export const floodfill = <T extends GridContent>(
    current: Coordinate2D,
    grid: Grid<T>,
    accumulator: Coordinate2D[] = []
): Coordinate2D[] => {
    const startElement = getGridElement(current, grid);
    if (startElement === null) return accumulator;
    const wasCurrentVisited = accumulator.find((visited) => visited[0] === current[0] && visited[1] === current[1]);
    if (wasCurrentVisited) return accumulator;
    const neighbours = getAdjacentcyInformation(current, grid);
    const validNeighbours = Object.entries(neighbours).filter(([_key, value], _idx) => {
        const wasVisited = accumulator.find(
            (visited) => visited[0] === value?.location[0] && visited[1] === value?.location[1]
        );
        return value?.element === startElement && !wasVisited;
    });
    accumulator.push(current);
    validNeighbours.forEach(([_key, neighbour]) => floodfill(neighbour!.location, grid, accumulator));
    return accumulator;
};

export const findUniqueElements = <T extends GridContent>(grid: Grid<T>): Set<T> => {
    return new Set(grid.flat(2) as T[]);
};

export const addVectors = (vecA: Coordinate2D, vecB: Coordinate2D): Coordinate2D => {
    return [vecA[0] + vecB[0], vecA[1] + vecB[1]];
};

export const rotate = <T extends GridContent>(grid: Grid<T>, n: number = 1): Grid<T> => {
    if (grid.length === 0 || grid[0].length === 0) return [];

    n = ((n % 4) + 4) % 4;
    if (n === 0) return grid;

    const rows = grid.length;
    const cols = grid[0].length;

    const rotate90Degrees = () => {
        const rotated = Array(cols)
            .fill(null)
            .map(() => Array(rows).fill(''));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = grid[i][j];
            }
        }
        return rotated;
    };

    let result = grid;
    for (let i = 0; i < n; i++) {
        result = rotate90Degrees();
        grid = result;
    }

    return result;
};

export const rotateCoordinate = <T extends GridContent>(
    grid: Grid<T>,
    coordinate: [number, number],
    n: number = 1
): [number, number] => {
    if (grid.length === 0 || grid[0].length === 0) {
        throw new Error('Grid is empty');
    }

    n = ((n % 4) + 4) % 4;
    if (n === 0) return coordinate;

    let rows = grid.length;
    let cols = grid[0].length;
    let [row, col] = coordinate;

    for (let i = 0; i < n; i++) {
        [row, col] = [col, rows - 1 - row];
        [rows, cols] = [cols, rows];
    }

    return [row, col];
};

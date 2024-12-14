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

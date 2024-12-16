import { Coordinate2D, Grid, StringOfCoordinate } from './grid';

export type Maze = Record<StringOfCoordinate, Coordinate2D[]>;

export const getStringRepresentationOfCoordinate = ([row, col]: Coordinate2D): StringOfCoordinate => `[${row},${col}]`;

export const transformToMaze = (grid: Grid<string>, wallSymbol: string): Maze => {
    const maze: Maze = {};
    const rows = grid.length;
    const cols = grid[0].length;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] !== wallSymbol) {
                const currentCoord: Coordinate2D = [row, col];
                const stringCoord = getStringRepresentationOfCoordinate(currentCoord);
                maze[stringCoord] = [];

                const directions: Coordinate2D[] = [
                    [-1, 0],
                    [0, 1],
                    [1, 0],
                    [0, -1],
                ];

                for (const [dRow, dCol] of directions) {
                    const newRow = row + dRow;
                    const newCol = col + dCol;

                    if (
                        newRow >= 0 &&
                        newRow < rows &&
                        newCol >= 0 &&
                        newCol < cols &&
                        grid[newRow][newCol] !== wallSymbol
                    ) {
                        maze[stringCoord].push([newRow, newCol]);
                    }
                }
            }
        }
    }

    return maze;
};

export class PriorityQueue<T> {
    private queue: [number, T][] = [];

    enqueue(priority: number, item: T) {
        this.queue.push([priority, item]);
        this.queue.sort((a, b) => a[0] - b[0]);
    }

    dequeue(): T | undefined {
        return this.queue.shift()?.[1];
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}

export const dijkstra = (maze: Maze, start: Coordinate2D, end: Coordinate2D): Coordinate2D[] => {
    const distances: Record<StringOfCoordinate, number> = {};
    const previous: Record<StringOfCoordinate, StringOfCoordinate | null> = {};
    const pq = new PriorityQueue<Coordinate2D>();

    for (const key in maze) {
        distances[key as StringOfCoordinate] = Infinity;
        previous[key as StringOfCoordinate] = null;
    }

    const startKey = JSON.stringify(start) as StringOfCoordinate;
    distances[startKey] = 0;
    pq.enqueue(0, start);

    while (!pq.isEmpty()) {
        const current = pq.dequeue()!;
        const currentKey = JSON.stringify(current) as StringOfCoordinate;

        if (current[0] === end[0] && current[1] === end[1]) {
            const path: Coordinate2D[] = [];
            let u: StringOfCoordinate | null = currentKey;
            while (u) {
                path.unshift(JSON.parse(u));
                u = previous[u];
            }
            return path;
        }

        for (const neighbor of maze[currentKey]) {
            const neighborKey = JSON.stringify(neighbor) as StringOfCoordinate;
            const alt = distances[currentKey] + 1;
            if (alt < distances[neighborKey]) {
                distances[neighborKey] = alt;
                previous[neighborKey] = currentKey;
                pq.enqueue(alt, neighbor);
            }
        }
    }

    throw new Error('no path found');
};

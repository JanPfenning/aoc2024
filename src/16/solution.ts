import { Coordinate2D, drawGrid, findAllOccurencesOfElement, Grid, StringOfCoordinate } from '../utils/grid';
import { Maze, PriorityQueue, transformToMaze } from '../utils/maze';
import { asCharMatrix } from '../utils/parse';

type GridSymbol = '#' | '.' | 'S' | 'E';
export type PuzzleInput = Grid<GridSymbol>;

export const parseRawData = (rawData: string): PuzzleInput => {
    return asCharMatrix(rawData) as Grid<GridSymbol>;
};

type Direction = [number, number];

interface NodeState {
    coordinate: Coordinate2D;
    direction: Direction;
}

export const dijkstra = (maze: Maze, start: Coordinate2D, end: Coordinate2D): Coordinate2D[] => {
    const distances: Record<string, number> = {};
    const previous: Record<string, NodeState | null> = {};
    const pq = new PriorityQueue<NodeState>();

    const initialDirections: Direction[] = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    for (const key in maze) {
        for (const dir of initialDirections) {
            const stateKey = getStateKey(JSON.parse(key), dir);
            distances[stateKey] = Infinity;
            previous[stateKey] = null;
        }
    }

    for (const dir of initialDirections) {
        const startState: NodeState = { coordinate: start, direction: dir };
        const startStateKey = getStateKey(start, dir);
        distances[startStateKey] = 0;
        pq.enqueue(0, startState);
    }

    while (!pq.isEmpty()) {
        const current = pq.dequeue()!;
        const { coordinate: currentCoord, direction: currentDir } = current;
        const currentStateKey = getStateKey(currentCoord, currentDir);

        if (currentCoord[0] === end[0] && currentCoord[1] === end[1]) {
            return reconstructPath(previous, currentStateKey);
        }

        for (const neighbor of maze[JSON.stringify(currentCoord) as StringOfCoordinate]) {
            const newDirection: Direction = [neighbor[0] - currentCoord[0], neighbor[1] - currentCoord[1]];
            const neighborState: NodeState = { coordinate: neighbor, direction: newDirection };
            const neighborStateKey = getStateKey(neighbor, newDirection);

            const isTurn = currentDir[0] !== newDirection[0] || currentDir[1] !== newDirection[1];
            const moveCost = isTurn ? 1001 : 1;

            const alt = distances[currentStateKey] + moveCost;
            if (alt < (distances[neighborStateKey] ?? Infinity)) {
                distances[neighborStateKey] = alt;
                previous[neighborStateKey] = current;
                pq.enqueue(alt, neighborState);
            }
        }
    }

    throw new Error('no path found');
};

function getStateKey(coordinate: Coordinate2D, direction: Direction): string {
    return `${JSON.stringify(coordinate)},${JSON.stringify(direction)}`;
}

function reconstructPath(previous: Record<string, NodeState | null>, endStateKey: string): Coordinate2D[] {
    const path: Coordinate2D[] = [];
    let currentStateKey = endStateKey;
    while (currentStateKey) {
        const state = previous[currentStateKey];
        if (!state) break;
        path.unshift(state.coordinate);
        currentStateKey = getStateKey(state.coordinate, state.direction);
    }
    return path;
}

export const solution = (input: PuzzleInput) => {
    const maze = transformToMaze(input, '#');
    const start = findAllOccurencesOfElement('S', input)[0];
    const end: Coordinate2D = findAllOccurencesOfElement('E', input)[0];
    const path = dijkstra(maze, start, end);
    drawGrid(input);
    drawGrid(input, { coordinates: path.map((e) => [e[1], e[0]]), symbol: 'O' });
    const corners = findCorners(path);
    return corners.length * 1000 + path.length;
};

const findCorners = (coordinates: Coordinate2D[]): Coordinate2D[] => {
    return coordinates.filter((coord, index, array) => {
        if (index === array.length - 1) return false;
        const [x, y]: Coordinate2D = coord;
        const prev: Coordinate2D = index === 0 ? [x, y - 1] : array[index - 1];
        const next: Coordinate2D = index === array.length - 1 ? coord : array[index + 1];

        const isHorizontalMove = (a: Coordinate2D, b: Coordinate2D) => a[1] === b[1];

        const prevMove = isHorizontalMove([x, y], prev) ? 'horizontal' : 'vertical';
        const nextMove = isHorizontalMove([x, y], next) ? 'horizontal' : 'vertical';

        return prevMove !== nextMove;
    });
};

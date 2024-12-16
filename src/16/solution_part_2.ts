import { Coordinate2D, findAllOccurencesOfElement, Grid, StringOfCoordinate } from '../utils/grid';
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

export const dijkstra = (maze: Maze, start: Coordinate2D, end: Coordinate2D): Coordinate2D[][] => {
    const distances: Record<string, number> = {};
    const previous: Record<string, Set<NodeState>> = {};
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
            previous[stateKey] = new Set();
        }
    }

    for (const dir of initialDirections) {
        const startState: NodeState = { coordinate: start, direction: dir };
        const startStateKey = getStateKey(start, dir);
        distances[startStateKey] = 0;
        pq.enqueue(0, startState);
    }

    let optimalDistance = Infinity;
    const endStates: NodeState[] = [];

    while (!pq.isEmpty()) {
        const current = pq.dequeue()!;
        const { coordinate: currentCoord, direction: currentDir } = current;
        const currentStateKey = getStateKey(currentCoord, currentDir);

        if (currentCoord[0] === end[0] && currentCoord[1] === end[1]) {
            if (distances[currentStateKey] <= optimalDistance) {
                optimalDistance = distances[currentStateKey];
                endStates.push(current);
            }
            continue;
        }

        if (distances[currentStateKey] > optimalDistance) continue;

        for (const neighbor of maze[JSON.stringify(currentCoord) as StringOfCoordinate]) {
            const newDirection: Direction = [neighbor[0] - currentCoord[0], neighbor[1] - currentCoord[1]];
            const neighborState: NodeState = { coordinate: neighbor, direction: newDirection };
            const neighborStateKey = getStateKey(neighbor, newDirection);

            const isTurn = currentDir[0] !== newDirection[0] || currentDir[1] !== newDirection[1];
            const moveCost = isTurn ? 1001 : 1;

            const alt = distances[currentStateKey] + moveCost;
            if (alt <= distances[neighborStateKey]) {
                if (alt < distances[neighborStateKey]) {
                    distances[neighborStateKey] = alt;
                    previous[neighborStateKey].clear();
                    pq.enqueue(alt, neighborState);
                }
                previous[neighborStateKey].add(current);
            }
        }
    }

    if (endStates.length === 0) {
        throw new Error('no path found');
    }

    return reconstructAllPaths(previous, endStates);
};

function getStateKey(coordinate: Coordinate2D, direction: Direction): string {
    return `${JSON.stringify(coordinate)},${JSON.stringify(direction)}`;
}

function reconstructAllPaths(previous: Record<string, Set<NodeState>>, endStates: NodeState[]): Coordinate2D[][] {
    const allPaths: Coordinate2D[][] = [];

    function backtrack(state: NodeState, currentPath: Coordinate2D[]) {
        currentPath.unshift(state.coordinate);
        const stateKey = getStateKey(state.coordinate, state.direction);
        const prevStates = previous[stateKey];

        if (prevStates.size === 0) {
            allPaths.push([...currentPath]);
        } else {
            for (const prevState of prevStates) {
                backtrack(prevState, currentPath);
            }
        }
        currentPath.shift();
    }

    for (const endState of endStates) {
        backtrack(endState, []);
    }

    return allPaths;
}

export const solution = (input: PuzzleInput): number => {
    const maze = transformToMaze(input, '#');
    const start = findAllOccurencesOfElement('S', input)[0];
    const end: Coordinate2D = findAllOccurencesOfElement('E', input)[0];
    const paths = dijkstra(maze, start, end);
    return [...new Set(paths.flat().map((x) => `[${x[0]},${x[1]}]`)).values()].length;
};

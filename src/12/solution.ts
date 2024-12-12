import { Coordinate2D, floodfill, Grid } from '../utils/grid';
import { asCharMatrix } from '../utils/parse';
import { sum } from '../utils/reduce';

type UppercaseLetter =
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z';

export type PuzzleInput = Grid<UppercaseLetter>;

export const parseRawData = (rawData: string): PuzzleInput => {
    return asCharMatrix(rawData) as Grid<UppercaseLetter>;
};

export const getFields = (grid: PuzzleInput): Coordinate2D[][] => {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = new Set<string>();
    const fields: Coordinate2D[][] = [];

    function getCoordinateString(coord: Coordinate2D): string {
        return `${coord[0]},${coord[1]}`;
    }

    function findUnvisitedCoordinate(): Coordinate2D | undefined {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (!visited.has(getCoordinateString([row, col]))) {
                    return [row, col];
                }
            }
        }
        return undefined;
    }

    let unvisitedCoordinate: Coordinate2D | undefined;
    do {
        unvisitedCoordinate = findUnvisitedCoordinate();

        if (unvisitedCoordinate) {
            const field = floodfill(unvisitedCoordinate, grid);
            field.forEach((c) => visited.add(getCoordinateString(c)));
            fields.push(field);
        }
    } while (unvisitedCoordinate);

    return fields;
};

export const getPerimeter = (field: Coordinate2D[]): number => {
    const coordToString = ([x, y]: Coordinate2D): string => `${x},${y}`;
    const fieldSet = new Set(field.map(coordToString));
    const directions: Coordinate2D[] = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    return field
        .map((coord) => {
            const adjacentCount = directions.filter(([dx, dy]) => {
                const neighborCoord: Coordinate2D = [coord[0] + dx, coord[1] + dy];
                return fieldSet.has(coordToString(neighborCoord));
            }).length;
            return 4 - adjacentCount;
        })
        .reduce(sum);
};

export const getSides = (field: Coordinate2D[]): number => {
    // number of sides is equivalent to the number of corners
    // outward facing corners can be counted by finding all occurences where:
    //      a coordiante has two non-opposing sides where no valid neighbour lives
    // inward facing corners can be counted by finding all occurences where:
    //      a coordinate has two non-opposing sides where valid neighbours live and on the diagonal between those there is no valid neighbour
    // a single coordinate might have multiple of these occurences
    // e.g. a single square has 4, top-right has no valid neighbour, as bottom-right, bottom-left and top-left
    const coordToString = ([x, y]: Coordinate2D): string => `${x},${y}`;
    const fieldSet = new Set(field.map(coordToString));
    const cornerCombinations: Coordinate2D[][] = [
        [
            [1, 0],
            [0, 1],
        ],
        [
            [1, 0],
            [0, -1],
        ],
        [
            [-1, 0],
            [0, 1],
        ],
        [
            [-1, 0],
            [0, -1],
        ],
    ];
    const getNumberOfOutwardFacingCornerIndicationsForCoordinate = ([x, y]: Coordinate2D): number => {
        return cornerCombinations.filter(([directionA, directionB]) => {
            return (
                !fieldSet.has(coordToString([x + directionA[0], y + directionA[1]])) &&
                !fieldSet.has(coordToString([x + directionB[0], y + directionB[1]]))
            );
        }).length;
    };
    const getNumberOfInwardFacingCornerIndicationsForCoordinate = ([x, y]: Coordinate2D): number => {
        return cornerCombinations.filter(([directionA, directionB]) => {
            return (
                fieldSet.has(coordToString([x + directionA[0], y + directionA[1]])) &&
                fieldSet.has(coordToString([x + directionB[0], y + directionB[1]])) &&
                !fieldSet.has(coordToString([x + directionA[0] + directionB[0], y + directionB[1] + directionB[0]]))
            );
        }).length;
    };

    return (
        field.map(getNumberOfOutwardFacingCornerIndicationsForCoordinate).reduce(sum) +
        field.map(getNumberOfInwardFacingCornerIndicationsForCoordinate).reduce(sum)
    );
};

export const solution = (grid: PuzzleInput, costFactorPerimiter = true): number => {
    const fields = getFields(grid);
    const individualFieldPrices = fields.map(
        (field) => (costFactorPerimiter ? getPerimeter(field) : getSides(field)) * field.length
    );
    return individualFieldPrices.reduce(sum);
};

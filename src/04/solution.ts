import { asCharMatrix } from '../utils/parse';

export type PuzzleInput = ('X' | 'M' | 'A' | 'S')[][];
export const parseRawData = (rawData: string): PuzzleInput => {
    return asCharMatrix(rawData) as PuzzleInput;
};

type Coordinate = [number, number];
/* [0] = X, [1] = M, [2] = A, [3] = S */
type XmasCoordinates = [Coordinate, Coordinate, Coordinate, Coordinate];
export const getXmasCoordinatesByStart = (grid: PuzzleInput, pos: Coordinate): null | XmasCoordinates[] => {
    const charAtPos = getCharAtPos(grid, pos);
    if (charAtPos !== 'X') return null;
    const coordinatesOfMs = getAdjacentCoordinates(pos).filter(
        (neightbourPos) => getCharAtPos(grid, neightbourPos) === 'M'
    );
    const potentialResults: XmasCoordinates[] = coordinatesOfMs.map((coordinateOfM) => {
        const directionFunction = (coordinate: Coordinate): Coordinate => {
            const [dx, dy] = [coordinateOfM[0] - pos[0], coordinateOfM[1] - pos[1]];
            return [coordinate[0] + dx, coordinate[1] + dy];
        };
        return [
            pos,
            coordinateOfM,
            directionFunction(coordinateOfM),
            directionFunction(directionFunction(coordinateOfM)),
        ];
    });
    return potentialResults.filter((potentialResult) => isResultValid(grid, potentialResult));
};

const isResultValid = (grid: PuzzleInput, potentialResult: XmasCoordinates): boolean => {
    return (
        getCharAtPos(grid, potentialResult[0]) === 'X' &&
        getCharAtPos(grid, potentialResult[1]) === 'M' &&
        getCharAtPos(grid, potentialResult[2]) === 'A' &&
        getCharAtPos(grid, potentialResult[3]) === 'S'
    );
};

const getCharAtPos = (grid: PuzzleInput, pos: Coordinate) => {
    if (pos[0] < 0 || pos[1] < 0) return null;
    if (grid.length <= pos[0]) return null;
    if (grid[0].length <= pos[1]) return null;
    return grid[pos[0]][pos[1]];
};

const getAdjacentCoordinates = ([x, y]: Coordinate): Coordinate[] => {
    const offsets: Coordinate[] = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
    ];

    return offsets.map(([dx, dy]): Coordinate => [x + dx, y + dy]);
};

export const findAllXmasOccurencesInGrid = (grid: PuzzleInput): XmasCoordinates[] => {
    const results: XmasCoordinates[] = [];
    grid.forEach((line, idxX) => {
        line.forEach((col, idxY) => {
            const interimResult = getXmasCoordinatesByStart(grid, [idxX, idxY]);
            if (interimResult) {
                results.push(...interimResult);
            }
        });
    });
    return results;
};

/*
Part 2
*/

const getDiagonalAdjacentCoordinates = ([x, y]: Coordinate): Coordinate[] => {
    const offsets: Coordinate[] = [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
    ];

    return offsets.map(([dx, dy]): Coordinate => [x + dx, y + dy]);
};

type MasCoordinates = [Coordinate, Coordinate, Coordinate];
export const getMasCoordinatesByStart = (grid: PuzzleInput, pos: Coordinate): null | MasCoordinates[] => {
    const charAtPos = getCharAtPos(grid, pos);
    if (charAtPos !== 'M') return null;
    const coordinatesOfAs = getDiagonalAdjacentCoordinates(pos).filter(
        (neightbourPos) => getCharAtPos(grid, neightbourPos) === 'A'
    );
    const results: (MasCoordinates | undefined)[] = coordinatesOfAs.map((coordinateOfA) => {
        const directionFunction = (coordinate: Coordinate): Coordinate => {
            const [dx, dy] = [coordinateOfA[0] - pos[0], coordinateOfA[1] - pos[1]];
            return [coordinate[0] + dx, coordinate[1] + dy];
        };
        const coordinateOfS = directionFunction(coordinateOfA);
        if (getCharAtPos(grid, coordinateOfS) !== 'S') return undefined;
        return [pos, coordinateOfA, coordinateOfS];
    });
    return results.filter((r) => !!r);
};

export const findAllMmasOccurencesInGrid = (grid: PuzzleInput): MasCoordinates[] => {
    const results: MasCoordinates[] = [];
    grid.forEach((line, idxX) => {
        line.forEach((col, idxY) => {
            const interimResult = getMasCoordinatesByStart(grid, [idxX, idxY]);
            if (interimResult) {
                results.push(...interimResult);
            }
        });
    });
    return results;
};

export const findPairsOfMas = (manyMasCoordinates: MasCoordinates[]): [MasCoordinates, MasCoordinates][] => {
    const pairs: [MasCoordinates, MasCoordinates][] = [];
    manyMasCoordinates.forEach((masCandidate) =>
        manyMasCoordinates.forEach((potentialPartner) => {
            const candidateSharesACoordinateWithPartner =
                masCandidate[1][0] === potentialPartner[1][0] && masCandidate[1][1] === potentialPartner[1][1];
            if (!candidateSharesACoordinateWithPartner) return;
            const candidateCoordianteOfM: Coordinate = masCandidate[0];
            const potentialPartnerCoordinateOfM: Coordinate = potentialPartner[0];
            const relativeCoordinate = [
                Math.abs(candidateCoordianteOfM[0] - potentialPartnerCoordinateOfM[0]),
                Math.abs(candidateCoordianteOfM[1] - potentialPartnerCoordinateOfM[1]),
            ];
            if (
                (relativeCoordinate[0] === 2 && relativeCoordinate[1] === 0) ||
                (relativeCoordinate[0] === 0 && relativeCoordinate[1] === 2)
            )
                pairs.push([masCandidate, potentialPartner]);
        })
    );
    return pairs;
};

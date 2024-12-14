import { readFile } from 'fs/promises';
import fs from 'fs';
import { getPathOfGuard, parseRawData, PuzzleInput } from './solution';
import { Coordinate2D } from '../utils/grid';
import { range } from '../utils/range';

const calculateMeanAndVariance = (data: Coordinate2D[]): { mean: Coordinate2D; variance: number } => {
    const sum = data.reduce(
        (acc, [x, y]) => {
            acc[0] += x;
            acc[1] += y;
            return acc;
        },
        [0, 0]
    );

    const mean: Coordinate2D = [sum[0] / data.length, sum[1] / data.length];

    const variance =
        data.reduce((acc, [x, y]) => {
            acc += Math.pow(x - mean[0], 2) + Math.pow(y - mean[1], 2);
            return acc;
        }, 0) /
        (data.length * 2);

    return { mean, variance };
};

const calculateIterations = (
    input: PuzzleInput,
    iterations: number,
    dimension: { height: number; width: number } = { height: 11, width: 7 }
) => {
    const guardsPaths: Coordinate2D[][] = input.map((g) => getPathOfGuard(g, dimension));
    const json = range(iterations).map((idx) =>
        guardsPaths.map((singleGuardPath) => singleGuardPath[idx % singleGuardPath.length])
    );
    const b = json.map((iteration, idx) => ({
        guardPositions: iteration,
        iteration: idx,
        correlation: calculateMeanAndVariance(iteration).variance,
    }));
    fs.writeFileSync('iterations.data.json', JSON.stringify(b.map((x) => x.guardPositions)));
    b.sort((a, b) => a.correlation - b.correlation);
    console.log(b.slice(0, 10).map((x) => `correlation: ${x.correlation}, index: ${x.iteration}`));
    console.log('probably the christmas tree is visible at iteration', b[0].iteration);
};

const main = async () => {
    const input = await readFile('src/14/puzzle_input.txt', 'utf8');
    const parsed = parseRawData(input);
    calculateIterations(parsed, 10_000, { height: 101, width: 103 });
};

main();

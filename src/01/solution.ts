import { zip } from '../utils/zip';

type PuzzleInput = { leftList: number[]; rightList: number[] };

export const parseRawData = (data: string): PuzzleInput => {
    const words = data.split(/\s+/); // Split the data by any whitespace
    return words.reduce(
        ({ leftList, rightList }, currentValue, currentIndex) =>
            currentIndex % 2 === 0
                ? { leftList: [...leftList, +currentValue], rightList }
                : { leftList, rightList: [...rightList, +currentValue] },
        { leftList: [], rightList: [] } as PuzzleInput
    );
};

export const calculateSumOfDistances = ({ leftList, rightList }: PuzzleInput): number => {
    return zip(
        leftList.sort((a, b) => b - a),
        rightList.sort((a, b) => b - a)
    ).reduce((accumulator, iter) => accumulator + Math.abs(iter[0]! - iter[1]!), 0);
};

const getFrequencyMapOfList = (numberList: number[]): Record<number, number | undefined> => {
    return numberList.reduce((acc, iter) => ({ ...acc, [iter]: (acc[iter] ?? 0) + 1 }), {} as Record<number, number>);
};

export const calcualteSimilarityScore = ({ leftList, rightList }: PuzzleInput): number => {
    const numberFrequencies = getFrequencyMapOfList(rightList);
    return leftList.map((value) => value * (numberFrequencies[value] ?? 0)).reduce((acc, iter) => acc + iter, 0);
};

import { asManyCharSeperatedNumberLists } from '../utils/parse';
import { sum } from '../utils/reduce';

export type PuzzleInput = { orderings: Record<number, number[] | undefined>; pages: number[][] };

export const parseRawData = (rawData: string): PuzzleInput => {
    const [orderingsSection, pageSection] = rawData.split(/\n\n/g);
    return {
        orderings: asManyCharSeperatedNumberLists('|', orderingsSection).reduce(
            (acc, [key, value]) => {
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(value);
                return acc;
            },
            {} as Record<number, number[] | undefined>
        ),
        pages: asManyCharSeperatedNumberLists(',', pageSection),
    };
};

export const splitArrayAtElement = (arr: number[], element: number): [number[], number[]] => {
    const index = arr.indexOf(element);
    return [arr.slice(0, index), arr.slice(index + 1)];
};

export const isNumberInCorrectPosition = (
    orderMap: PuzzleInput['orderings'],
    a: number,
    pageList: PuzzleInput['pages'][0]
): boolean => {
    const [before, after] = splitArrayAtElement(pageList, a);
    return (
        before.every((e) => !orderMap[a]?.find((x) => x === e)) && after.every((e) => orderMap[a]?.find((x) => x === e))
    );
};

export const isPageInCorrectOrder = (page: number[], orderMap: PuzzleInput['orderings']) => {
    return page.every((e) => isNumberInCorrectPosition(orderMap, e, page));
};

export const calculateSolutionForPart1 = ({ orderings, pages }: PuzzleInput): number => {
    const correctlyOrderedPages = pages.filter((page) => isPageInCorrectOrder(page, orderings));
    return correctlyOrderedPages.map((page) => page[Math.floor(page.length / 2)]).reduce(sum);
};

export const fixPageOrder = (
    orderings: PuzzleInput['orderings'],
    page: PuzzleInput['pages'][0]
): PuzzleInput['pages'][0] => {
    return page.sort((a, b) => (orderings[a]?.find((x) => x === b) ? -1 : 1));
};

export const calculateSolutionForPart2 = ({ orderings, pages }: PuzzleInput): number => {
    const wronglyOrderedPages = pages.filter((page) => !isPageInCorrectOrder(page, orderings));
    return wronglyOrderedPages
        .map((page) => fixPageOrder(orderings, page))
        .map((page) => page[Math.floor(page.length / 2)])
        .reduce(sum);
};

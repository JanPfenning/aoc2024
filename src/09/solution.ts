import { asSingleDigitLine } from '../utils/parse';
import { sum } from '../utils/reduce';

export type PuzzleInput = number[];

export const parseRawData = (rawData: string): PuzzleInput => {
    return asSingleDigitLine(rawData);
};

export const getFileBlocks = (diskmap: number[]): { id?: number; size: number }[] => {
    return diskmap.map((size, idx) => ({ id: idx % 2 === 0 ? idx / 2 : undefined, size }));
};

export const condenseFiles = (input: { id?: number; size: number }[]) => {
    // find next element in input which has no id, and size > 0
    const firstFreeSpaceLocation = input.findIndex((element) => element.id === undefined && element.size > 0);
    if (firstFreeSpaceLocation === -1) throw new Error('no more free space');
    const firstFreeSpace = input[firstFreeSpaceLocation];
    // find last element in input where id exists and size > 0
    let lastValidElementLocation;
    for (let i = input.length - 1; i >= 0; i--) {
        if (input[i].id !== undefined && input[i].size > 0) {
            lastValidElementLocation = i;
            break;
        }
    }
    const lastValidElement = input[lastValidElementLocation!];
    if (lastValidElementLocation! < firstFreeSpaceLocation) throw new Error('cannot condense further');
    // reduce first space size by 1
    firstFreeSpace.size--;
    // reduce last elements size by 1
    lastValidElement.size--;
    // then: directly before the non-id element check if the elements id is equal to the last element,
    if (input[firstFreeSpaceLocation - 1].id === lastValidElement.id) {
        // if so increase size by 1
        input[firstFreeSpaceLocation - 1].size++;
    } else {
        // else create a new entry prior to the non-id element with id of the last element and size = 1
        input.splice(firstFreeSpaceLocation, 0, { id: lastValidElement.id!, size: 1 });
    }
};

export const condenseAll = (input: { id?: number; size: number }[], blocks: boolean = false) => {
    const condenseFunc = blocks ? condenseBlocks : condenseFiles;
    while (true) {
        try {
            condenseFunc(input);
        } catch (err) {
            return input
                .map((e) => ({ ...e, id: e.id ?? 0 }))
                .map((obj) => Array.from({ length: obj.size }, () => obj.id!))
                .flat()
                .map((e, i) => e * i)
                .reduce(sum);
        }
    }
};

const removeZeroSizedElements = (arr: { id?: number; size: number }[]) => {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].size === 0) {
            arr.splice(i, 1);
        }
    }
};

export const condenseBlocks = (input: { id?: number; size: number }[], curId = Number.MAX_VALUE): void => {
    // get size of highest id ( first element with id < curId)
    let lastValidElementLocation;
    for (let i = input.length - 1; i >= 0; i--) {
        const element = input[i];
        if (element.id !== undefined && element?.id < curId && element.size > 0) {
            lastValidElementLocation = i;
            break;
        }
    }
    const lastValidElement = input[lastValidElementLocation!];
    // find most early space that fits the entire block
    const firstFreeSpaceLocation = input.findIndex(
        (element) => element.id === undefined && element.size >= lastValidElement.size
    );
    // if space is not found reeat with next smallest id
    if (firstFreeSpaceLocation === -1 || firstFreeSpaceLocation > lastValidElementLocation!)
        return condenseBlocks(input, lastValidElement.id);
    const firstFreeSpace = input[firstFreeSpaceLocation];

    // move block from back to the index right before the space
    const clone = { ...lastValidElement };
    lastValidElement.id = undefined;
    input.splice(firstFreeSpaceLocation, 0, clone);

    // and reduce size of free space by size of block
    firstFreeSpace.size -= clone.size;
    removeZeroSizedElements(input);

    // at some point id 0 is reached - terminate there stop
    if (clone.id === 0) throw new Error('done');

    return condenseBlocks(input, clone.id);
};

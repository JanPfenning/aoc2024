export const asCharMatrix = (rawInput: string): string[][] => {
    return rawInput.split(/\n/g).map((line) => line.split(''));
};

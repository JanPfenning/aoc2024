export const asCharMatrix = (rawInput: string): string[][] => {
    return asManyCharSeperatedLists('', rawInput);
};

export const asManyCharSeperatedLists = (seperator: string, rawInput: string) => {
    return rawInput.split(/\n/g).map((line) => line.split(seperator));
};

export const asManyCharSeperatedNumberLists = (seperator: string, rawInput: string): number[][] => {
    return rawInput.split(/\n/g).map((line) => line.split(seperator).map((val) => +val));
};

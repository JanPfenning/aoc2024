type Seperator = string | RegExp;
export const asCharMatrix = (rawInput: string): string[][] => {
    return asManyCharSeperatedLists('', rawInput);
};

export const asDigitMatrix = (rawInput: string): number[][] => {
    return asManyCharSeperatedNumberLists('', rawInput);
};

export const asManyCharSeperatedLists = (seperator: Seperator, rawInput: string) => {
    return rawInput.split(/\n/g).map((line) => line.split(seperator));
};

export const asManyCharSeperatedNumberLists = (seperator: Seperator, rawInput: string): number[][] => {
    return rawInput.split(/\n/g).map((line) => line.split(seperator).map((val) => +val));
};

export const asSingleDigitLine = (rawInput: string) => asSingleNumberLine('', rawInput);
export const asSingleNumberLine = (seperator: string, rawInput: string) => rawInput.split(seperator).map((val) => +val);

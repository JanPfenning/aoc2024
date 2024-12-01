export const zip = <T, U>(list1: T[], list2: U[]): [T | undefined, U | undefined][] => {
    const maxLength = Math.max(list1.length, list2.length);
    return Array.from({ length: maxLength }, (_, index) => [list1[index], list2[index]]);
};

export const isUniqueTuple = (tuple: [number, number], index: number, self: [number, number][]) =>
    index === self.findIndex((t) => t[0] === tuple[0] && t[1] === tuple[1]);

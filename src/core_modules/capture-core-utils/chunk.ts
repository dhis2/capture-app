function sliceArrayIntoGroups(chunks: number, array: Array<any>, size: number) {
    const groups: Array<any> = [];

    for (let i = 0, j = 0; i < chunks; i += 1, j += size) {
        groups[i] = array.slice(j, j + size);
    }

    return groups;
}

export function chunk(array: Array<any> | null | undefined, size: number) {
    if (!array || array.length === 0) {
        return [];
    }

    if (!size || size < 1) {
        return [array];
    }

    const chunks = Math.ceil(array.length / size);
    return sliceArrayIntoGroups(chunks, array, size);
}

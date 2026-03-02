export const areRelativeRangeValuesSupported = (
    startBuffer: number | null | undefined,
    endBuffer: number | null | undefined,
) => {
    const hasStart = startBuffer !== undefined && startBuffer !== null;
    const hasEnd = endBuffer !== undefined && endBuffer !== null;

    if (!hasStart && !hasEnd) return false;
    if (hasStart && (!Number.isInteger(startBuffer) || (startBuffer as number) > 0)) return false;
    if (hasEnd && (!Number.isInteger(endBuffer) || (endBuffer as number) < 0)) return false;

    return true;
};

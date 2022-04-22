// @flow

export const areRelativeRangeValuesSupported = (startBuffer: ?number, endBuffer: ?number) =>
    startBuffer !== undefined &&
    startBuffer !== null &&
    Number.isInteger(startBuffer) &&
    startBuffer <= 0 &&
    endBuffer !== undefined &&
    endBuffer !== null &&
    Number.isInteger(endBuffer) &&
    endBuffer >= 0;

// @flow

export type AbsoluteDateFilterData = {
    type: 'ABSOLUTE',
    ge?: string,
    le?: string,
};

export type RelativeDateFilterData = {
    type: 'RELATIVE',
    period: string,
};

export type DateFilterData = AbsoluteDateFilterData | RelativeDateFilterData;
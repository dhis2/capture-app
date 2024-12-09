// @flow

export type AbsoluteDateFilterData = {|
    type: 'ABSOLUTE',
    ge?: string,
    le?: string,
|};

export type RelativeDateFilterData = {|
    type: 'RELATIVE',
    period?: string,
    startBuffer?: number,
    endBuffer?: number,
|};

export type DateFilterData = AbsoluteDateFilterData | RelativeDateFilterData;

// @flow
import React from 'react';
import moment from 'moment';

// ----------- DESTRUCTERING AND UNION TYPES -------------
type AbsoluteDateFilterData = {|
    type: 'ABSOLUTE',
    ge?: string,
    le?: string,
|};

type RelativeDateFilterData = {|
    type: 'RELATIVE',
    period: string,
|};

type DateFilterData = AbsoluteDateFilterData | RelativeDateFilterData;

type ApiDataFilterDateAbsoluteContents = {|
    type: 'ABSOLUTE',
    startDate?: ?string,
    endDate?: ?string,
|};

type ApiDataFilterDateRelativeContents = {|
    type: 'RELATIVE',
    period: string,
|};

type ApiDataFilterDate = { dateFilter: ApiDataFilterDateAbsoluteContents | ApiDataFilterDateRelativeContents };

export const apiDateFilterTypes = Object.freeze({
    ABSOLUTE: 'ABSOLUTE',
    RELATIVE: 'RELATIVE',
});

export const getDateFilterFail = ({ dateFilter: { type, period, startDate, endDate } }: ApiDataFilterDate): DateFilterData => {
    if (type === apiDateFilterTypes.RELATIVE) {
        return {
            type,
            period,
        };
    }

    return {
        type,
        ge: startDate ? moment(startDate, 'YYYY-MM-DD').toISOString() : undefined,
        le: endDate ? moment(endDate, 'YYYY-MM-DD').toISOString() : undefined,
    };

};

export const getDateFilterSuccess = ({ dateFilter }: ApiDataFilterDate): DateFilterData => {
    if (dateFilter.type === apiDateFilterTypes.RELATIVE) {
        return {
            type: dateFilter.type,
            period: dateFilter.period,
        };
    }

    return {
        type: dateFilter.type,
        ge: dateFilter.startDate ? moment(dateFilter.startDate, 'YYYY-MM-DD').toISOString() : undefined,
        le: dateFilter.endDate ? moment(dateFilter.endDate, 'YYYY-MM-DD').toISOString() : undefined,
    };
};

// ----------- FILTER -------------

export const Func1 = () => {
    const arr = [{
        a: 'test',
        b: 'test',
    }, {
        b: 'test',
    }];

    const nonUndefinedArray = arr
        .map(e => (e.a ? e : undefined))  // some advanced calculation that for some reason could return undefined / null
        .filter(e => e);

    nonUndefinedArray[0].b;
};

// ----------- PASS ON PROPS -----------

type Props1 = {|
    a: string,
    b: string,
    c: string,
|};

type Props2 = {
    a: string,
    // ...PropsA, I think I'm expecting to much here because adding this works
};

type Props3 = {
    b: string,
    c: string,
};

const Comp3 = ({ b, c }: Props3) => (
    <div>{b}{c}</div>
);

const Comp2 = ({ a, ...passOnProps }: Props2) => (
    <Comp3
        {...passOnProps}
    />
);

export const Comp1 = (props: Props1) => (
    <Comp2
        {...props}
    />
);

// OPTIONAL PARAMS NOT REMOVED FROM REST

type Props5 = {|
    a?: string,
    b: string,
    c: string,
|};

type Props5Output = {|
    d: string,
    ...$Rest<Props5, {| a?: string |}>,
|};

type Props6 = {|
    b: string,
    c: string,
    d: string,
    ...Props5Output,
|};

type Props7 = {||};

const Comp7 = (props: Props7) => (<div {...props} />);

const Comp6 = ({ b, c, d, ...passOnProps }: Props6) => (
    <Comp7
        {...passOnProps}
    />
);

export const Comp5 = ({ a, ...passOnProps }: Props5) => (
    <Comp6
        {...passOnProps}
        d="test"
    />
);

import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type AbsoluteDateFilterData = {
    type: 'ABSOLUTE';
    ge?: string;
    le?: string;
};

export type RelativeDateFilterData = {
    type: 'RELATIVE';
    period?: string;
    startBuffer?: number;
    endBuffer?: number;
};

export type DateValue = {
    value?: string | null;
    error?: string | null;
    isValid?: boolean | null;
};

export type DateFilterData = AbsoluteDateFilterData | RelativeDateFilterData;

export type DateFilter = DateFilterData | EmptyValueFilterData;

export type Value = {
    from?: DateValue;
    to?: DateValue;
    main?: string;
    start?: string;
    end?: string;
} | string | undefined;

export type DateFilterProps = {
    onCommitValue: (value?: Value, isBlur?: boolean) => void;
    value: Value;
    onUpdate?: () => void;
    disableEmptyValueFilter?: boolean;
};

export type DateFilterManagerProps = {
    filter?: DateFilter | null;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: (value?: Value, isBlur?: boolean) => void;
};

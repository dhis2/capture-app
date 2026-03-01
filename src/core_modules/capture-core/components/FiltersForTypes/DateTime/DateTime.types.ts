import type { DateTimeValue } from './types/dateTime.types';

export type Value = {
    from?: DateTimeValue | null;
    to?: DateTimeValue | null;
} | null;

export type DateTimeFilterProps = {
    onCommitValue: (value: Value) => void;
    value: Value;
};

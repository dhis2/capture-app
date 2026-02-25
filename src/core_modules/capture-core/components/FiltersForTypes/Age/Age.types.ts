import type { AbsoluteDateFilterData } from '../Date/types';

export type Value = string | null | undefined;

export type AgeFilterData = AbsoluteDateFilterData;

export type AgeFilterProps = {
    onCommitValue: (value: Value) => void;
    onUpdate: (updatedValue: Value) => void;
    value: Value;
    onFocusUpdateButton?: () => void;
};

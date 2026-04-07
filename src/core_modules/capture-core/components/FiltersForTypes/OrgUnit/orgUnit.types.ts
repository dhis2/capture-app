import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type OrgUnitValue = {
    id: string;
    name: string;
    path: string;
};

export type OrgUnitValueFilterData = {
    value: string;
    name?: string;
};

export type OrgUnitFilterData = OrgUnitValueFilterData | EmptyValueFilterData;
export type Value = OrgUnitValue | string | null | undefined;

export type OrgUnitFilterProps = {
    onCommitValue: (value: Value) => void;
    onUpdate: (updatedValue: Value) => void;
    onClearValue?: () => void;
    value: Value;
    disableEmptyValueFilter?: boolean;
};

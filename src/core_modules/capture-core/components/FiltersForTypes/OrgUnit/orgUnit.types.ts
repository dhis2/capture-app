import type { EmptyValueFilterData } from '../EmptyValue/emptyValue.types';

export type OrgUnitFilterData = {
    value: string;
    name?: string;
};

export type OrgUnitFilter = OrgUnitFilterData | EmptyValueFilterData;

export type Value = {
    id: string;
    name: string;
    path: string;
} | string | null | undefined;

export type OrgUnitFilterProps = {
    onCommitValue: (value: Value) => void;
    onUpdate: (updatedValue: Value) => void;
    onClearValue?: () => void;
    value: Value;
    disableEmptyValueFilter?: boolean;
};

export type OrgUnitFilterManagerProps = {
    filter: OrgUnitFilter | null;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: () => void;
    onUpdate: (updatedValue: Value) => void;
};

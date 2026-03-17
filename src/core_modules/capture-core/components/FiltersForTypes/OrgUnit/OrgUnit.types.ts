import type { OrgUnitValue } from './types';

export type Value = OrgUnitValue | string | null | undefined;

export type OrgUnitFilterProps = {
    onCommitValue: (value: Value) => void;
    onUpdate: (updatedValue: Value) => void;
    onClearValue?: () => void;
    value: Value;
    disableEmptyValueFilter?: boolean;
};

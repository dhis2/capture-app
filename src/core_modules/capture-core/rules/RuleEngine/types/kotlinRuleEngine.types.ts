import { Option } from '@dhis2/rule-engine';

export type KotlinOptionSet = Array<Option>;

export type KotlinOptionSets = {
    [id: string]: KotlinOptionSet;
};

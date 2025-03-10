// @flow
import { Option } from '@dhis2/rule-engine';

export type KotlinOptionSet = Array<typeof Option>;

export type KotlinOptionSets = {|
    [id: string]: KotlinOptionSet,
|};

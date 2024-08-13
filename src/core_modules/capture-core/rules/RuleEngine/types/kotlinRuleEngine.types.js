// @flow

export type KotlinOption = {
    name: string,
    code: string,
};

type KotlinOptionSet = Array<KotlinOption>;

export type KotlinOptionSets = {|
    [id: string]: KotlinOptionSet,
|};

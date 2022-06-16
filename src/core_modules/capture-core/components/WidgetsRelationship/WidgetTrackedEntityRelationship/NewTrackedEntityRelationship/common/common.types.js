// @flow

type Program = $ReadOnly<{|
    id: string,
    name: string,
|}>;

export type GetPrograms = (trackedEntityTypeId: string) => $ReadOnlyArray<Program>;

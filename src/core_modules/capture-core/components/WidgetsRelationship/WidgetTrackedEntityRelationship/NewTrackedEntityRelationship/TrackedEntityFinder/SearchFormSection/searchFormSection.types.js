// @flow

type Field = $ReadOnly<{|
    id: string,
    type: string,
|}>;

type SearchGroup = $ReadOnly<{|
    unique: boolean,
    fields: Array<Field>,
|}>;

export type SearchGroups = $ReadOnlyArray<SearchGroup>;

export type GetSearchGroups = (programId: string | null) => SearchGroups | void;

export type GetSearchGroupsAsync = (programId: string | null) => SearchGroups;

export type Props = $ReadOnly<{|
    programId: string | null,
    getSearchGroups?: GetSearchGroups,
    getSearchGroupsAsync?: GetSearchGroupsAsync,
|}>;

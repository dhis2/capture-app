// @flow
import type { GetPrograms } from '../common';
import type { GetSearchGroups, GetSearchGroupsAsync } from './SearchFormSection';

export type Props = $ReadOnly<{|
    trackedEntityTypeId: string,
    defaultProgramId: ?string,
    getPrograms: GetPrograms,
    getSearchGroups?: GetSearchGroups,
    getSearchGroupsAsync?: GetSearchGroupsAsync,
|}>;

export type PlainProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;

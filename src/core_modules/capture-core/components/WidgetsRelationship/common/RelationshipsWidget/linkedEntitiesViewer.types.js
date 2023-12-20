// @flow
import type { GroupedLinkedEntities, LinkedRecordClick } from './types';

export type Props = $ReadOnly<{|
    groupedLinkedEntities: GroupedLinkedEntities,
    onLinkedRecordClick: LinkedRecordClick,
|}>;

export type StyledProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;

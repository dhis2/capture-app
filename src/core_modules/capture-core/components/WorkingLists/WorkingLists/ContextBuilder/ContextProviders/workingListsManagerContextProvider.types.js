// @flow
import type { WorkingListTemplate, SelectTemplate } from '../../../WorkingLists/workingLists.types';

export type Props = $ReadOnly<{|
    currentTemplate?: WorkingListTemplate,
    onSelectTemplate: SelectTemplate,
    children: React$Node,
|}>;

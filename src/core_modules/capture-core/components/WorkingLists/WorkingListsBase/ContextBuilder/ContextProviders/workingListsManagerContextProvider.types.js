// @flow
import type { WorkingListTemplate, SelectTemplate } from '../../workingListsBase.types';

export type Props = $ReadOnly<{|
    currentTemplate?: WorkingListTemplate,
    onSelectTemplate: SelectTemplate,
    children: React$Node,
|}>;

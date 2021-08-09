// @flow
import type {
    AddTemplate,
    DeleteTemplate,
    UpdateTemplate,
} from '../../../WorkingLists/workingLists.types';

export type Props = $ReadOnly<{|
    currentViewHasTemplateChanges?: boolean,
    onAddTemplate?: AddTemplate,
    onUpdateTemplate?: UpdateTemplate,
    onDeleteTemplate?: DeleteTemplate,
    children: React$Node,
|}>;

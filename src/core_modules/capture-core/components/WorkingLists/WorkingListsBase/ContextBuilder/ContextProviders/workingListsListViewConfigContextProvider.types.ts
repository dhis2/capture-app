import type { ReactNode } from 'react';
import type {
    AddTemplate,
    DeleteTemplate,
    UpdateTemplate,
} from '../../workingListsBase.types';

export type Props = Readonly<{
    currentViewHasTemplateChanges?: boolean;
    onAddTemplate?: AddTemplate;
    onUpdateTemplate?: UpdateTemplate;
    onDeleteTemplate?: DeleteTemplate;
    children: ReactNode;
}>;

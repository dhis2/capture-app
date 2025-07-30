import type { ReactNode } from 'react';
import type { WorkingListTemplate, SelectTemplate } from '../../workingListsBase.types';

export type Props = Readonly<{
    currentTemplate?: WorkingListTemplate;
    onSelectTemplate: SelectTemplate;
    children: ReactNode;
}>;

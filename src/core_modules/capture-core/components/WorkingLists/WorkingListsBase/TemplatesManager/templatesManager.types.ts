import type { ReactNode } from 'react';
import type { WorkingListTemplates, WorkingListTemplate } from '../workingListsBase.types';
import type { TemplatesLoaderOutputProps } from '../TemplatesLoader';

type ExtractedProps = {
    templates?: WorkingListTemplates,
};

type OptionalExtractedProps = {
    templates: WorkingListTemplates,
};

type RestProps = TemplatesLoaderOutputProps & OptionalExtractedProps & ExtractedProps;

export type Props = Readonly<RestProps & ExtractedProps>;

export type TemplatesManagerOutputProps = Readonly<RestProps & {
    currentTemplate: WorkingListTemplate,
    children: (currentListIsModified: boolean) => ReactNode,
}>;

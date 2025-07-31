import type { ReactNode } from 'react';
import type { WorkingListTemplates, WorkingListTemplate } from '../workingListsBase.types';
import type { TemplatesLoaderOutputProps } from '../TemplatesLoader';

type ExtractedProps = {
    templates?: WorkingListTemplates;
};

type OptionalExtractedProps = {
    templates: WorkingListTemplates;
};

type RestProps = Omit<TemplatesLoaderOutputProps & OptionalExtractedProps, keyof (ExtractedProps & OptionalExtractedProps)>;

export type Props = Readonly<RestProps & ExtractedProps>;

export type TemplatesManagerOutputProps = Readonly<RestProps & {
    currentTemplate: WorkingListTemplate;
    children: (currentListIsModified: boolean) => ReactNode;
}>;

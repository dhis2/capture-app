import type { ReactNode } from 'react';
import type { TemplatesManagerOutputProps } from '../TemplatesManager';

type ExtractedProps = {
    children: (currentListIsModified: boolean) => ReactNode;
};

type RestProps = Omit<TemplatesManagerOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps;

export type ListViewConfigOutputProps = RestProps & {
    currentViewHasTemplateChanges: boolean;
};

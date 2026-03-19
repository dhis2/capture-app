import type { ReactElement } from 'react';
import type { ContextBuilderOutputProps } from '../ContextBuilder';

type ExtractedProps = {
    loadTemplatesError?: string,
    onLoadTemplates: (programId: string) => void,
    onCancelLoadTemplates?: () => void,
    programId: string,
    loadedProgramIdForTemplates?: string,
    dirtyTemplates: boolean,
    templatesLoading: boolean,
};

type OptionalExtractedProps = {
    allRowsAreSelected: boolean,
    selectedRows: { [key: string]: boolean },
    loadTemplatesError: string,
    onCancelLoadTemplates: () => void,
    loadedProgramIdForTemplates: string,
    onRowSelect: () => void,
    onSelectAll: () => void,
    bulkActionBarComponent: ReactElement<any>,
};

type RestProps = ContextBuilderOutputProps & OptionalExtractedProps | ExtractedProps;

export type Props = RestProps & ExtractedProps;

export type TemplatesLoaderOutputProps = Readonly<RestProps & {
    programId: string,
}>;

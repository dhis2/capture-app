// @flow
import type { ContextBuilderOutputProps } from '../ContextBuilder';

type ExtractedProps = {|
    loadTemplatesError?: string,
    onLoadTemplates: Function,
    onCancelLoadTemplates?: Function,
    programId: string,
    loadedProgramIdForTemplates?: string,
    dirtyTemplates: boolean,
    templatesLoading: boolean,
|};

type OptionalExtractedProps = {
    allRowsAreSelected: boolean,
    selectedRows: { [key: string]: boolean },
    loadTemplatesError: string,
    onCancelLoadTemplates: Function,
    loadedProgramIdForTemplates: string,
    onRowSelect: Function,
    onSelectAll: Function,
    bulkActionBarComponent: React$Element<any>,
};

type RestProps = $Rest<ContextBuilderOutputProps & OptionalExtractedProps, ExtractedProps & OptionalExtractedProps>;

export type Props = $ReadOnly<{|
    ...RestProps,
    ...ExtractedProps,
|}>;

export type TemplatesLoaderOutputProps = $ReadOnly<{|
    ...RestProps,
    programId: string,
|}>;

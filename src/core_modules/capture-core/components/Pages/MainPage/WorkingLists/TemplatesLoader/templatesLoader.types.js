// @flow
import type { LoadedContext } from '../workingLists.types';
import type { ContextBuilderOutputProps } from '../ContextBuilder';

type ExtractedProps = {
    loadTemplatesError?: string,
    onLoadTemplates: Function,
    onCancelLoadTemplates?: Function,
    programId: string,
    loadedContext: LoadedContext,
    dirtyTemplates: boolean,
    templatesLoading: boolean,
};

type RestProps = $Rest<ContextBuilderOutputProps, ExtractedProps>;

export type Props = $ReadOnly<{|
    ...ContextBuilderOutputProps,
|}>;

export type TemplatesLoaderOutputProps = $ReadOnly<{|
    ...RestProps,
    programId: string,
    loadedContext: LoadedContext,
|}>;

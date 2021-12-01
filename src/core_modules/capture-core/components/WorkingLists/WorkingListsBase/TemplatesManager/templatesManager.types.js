// @flow
import type { TemplatesLoaderOutputProps } from '../TemplatesLoader';
import type { WorkingListTemplates, WorkingListTemplate } from '../workingListsBase.types';

type ExtractedProps = {|
    templates?: WorkingListTemplates,
|};

type OptionalExtractedProps = {|
    templates: WorkingListTemplates,
|};

type RestProps = $Rest<TemplatesLoaderOutputProps & OptionalExtractedProps, ExtractedProps & OptionalExtractedProps>;

export type Props = $ReadOnly<{|
    ...RestProps,
    ...ExtractedProps,
|}>;

export type TemplatesManagerOutputProps = $ReadOnly<{|
    ...RestProps,
    currentTemplate: WorkingListTemplate,
    children: (currentListIsModified: boolean) => React$Node,
|}>;

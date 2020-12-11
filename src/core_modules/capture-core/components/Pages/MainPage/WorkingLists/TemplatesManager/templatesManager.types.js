// @flow
import type { WorkingListTemplates, WorkingListTemplate } from '../workingLists.types';
import type { TemplatesLoaderOutputProps } from '../TemplatesLoader';

type ExtractedProps = {|
  templates?: WorkingListTemplates,
|};

type OptionalExtractedProps = {|
  templates: WorkingListTemplates,
|};

type RestProps = $Rest<
  TemplatesLoaderOutputProps & OptionalExtractedProps,
  ExtractedProps & OptionalExtractedProps,
>;

export type Props = $ReadOnly<{|
  ...RestProps,
  ...ExtractedProps,
|}>;

export type TemplatesManagerOutputProps = $ReadOnly<{|
  ...RestProps,
  currentTemplate: WorkingListTemplate,
  children: (currentListIsModified: boolean) => React$Node,
|}>;

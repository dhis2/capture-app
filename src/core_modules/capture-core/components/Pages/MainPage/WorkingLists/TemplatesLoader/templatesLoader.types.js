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
  loadTemplatesError: string,
  onCancelLoadTemplates: Function,
  loadedProgramIdForTemplates: string,
};

type RestProps = $Rest<
  ContextBuilderOutputProps & OptionalExtractedProps,
  ExtractedProps & OptionalExtractedProps,
>;

export type Props = $ReadOnly<{|
  ...RestProps,
  ...ExtractedProps,
|}>;

export type TemplatesLoaderOutputProps = $ReadOnly<{|
  ...RestProps,
  programId: string,
|}>;

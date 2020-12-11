// @flow
import type { TemplatesManagerOutputProps } from '../TemplatesManager';

type ExtractedProps = {|
  children: (currentListIsModified: boolean) => React$Node,
|};

type RestProps = $Rest<TemplatesManagerOutputProps, ExtractedProps>;

export type Props = {|
  ...RestProps,
  ...ExtractedProps,
|};
export type ListViewConfigOutputProps = {|
  ...RestProps,
  currentViewHasTemplateChanges: boolean,
|};

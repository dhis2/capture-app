// @flow
import type { WorkingListTemplate } from '../workingLists.types';
import type { CustomMenuContents } from '../../../../ListView';
import type { ListViewConfigOutputProps } from '../ListViewConfig';

type ExtractedProps = {|
  currentTemplate: WorkingListTemplate,
  onAddTemplate: Function,
  onUpdateTemplate: Function,
  onDeleteTemplate: Function,
  currentViewHasTemplateChanges: boolean,
  customListViewMenuContents?: CustomMenuContents,
  classes: Object,
|};

type RestProps = $Rest<ListViewConfigOutputProps, ExtractedProps>;

export type Props = {|
  ...RestProps,
  ...ExtractedProps,
|};
export type ListViewConfigMenuContentOutputProps = {|
  ...RestProps,
  currentTemplate: WorkingListTemplate,
  customListViewMenuContents?: CustomMenuContents,
|};

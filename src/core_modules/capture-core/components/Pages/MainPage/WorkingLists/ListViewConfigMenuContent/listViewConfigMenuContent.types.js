// @flow
import type { WorkingListTemplate } from '../workingLists.types';
import type { CustomMenuContents } from '../../../../ListView';
import type { ListViewConfigOutputProps } from '../ListViewConfig';

type ExtractedProps = {|
    currentTemplate: WorkingListTemplate,
    onAddTemplate?: Function,
    onUpdateTemplate?: Function,
    onDeleteTemplate?: Function,
    currentViewHasTemplateChanges: boolean,
    customListViewMenuContents?: CustomMenuContents,
    classes: Object,
|};

type OptionalExtractedProps = {|
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
|};

type RestProps = $Rest<ListViewConfigOutputProps & OptionalExtractedProps, ExtractedProps & OptionalExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};
export type ListViewConfigMenuContentOutputProps = {|
    ...RestProps,
    currentTemplate: WorkingListTemplate,
    customListViewMenuContents?: CustomMenuContents,
|};

import type { ColumnConfigs } from '../workingListsBase.types';
import type { CustomMenuContents, StickyFilters } from '../../../ListView';
import type { ListViewUpdaterOutputProps } from '../ListViewUpdater';

type ExtractedProps = {
    columns: ColumnConfigs,
    customListViewMenuContents?: CustomMenuContents,
    stickyFilters?: StickyFilters,
};

type OptionalExtractedProps = {
    stickyFilters: StickyFilters,
};

type RestProps = ListViewUpdaterOutputProps & OptionalExtractedProps & ExtractedProps & OptionalExtractedProps;

export type Props = RestProps & ExtractedProps;

export type ListViewConfigOutputProps = RestProps & {
    currentViewHasTemplateChanges: boolean;
};

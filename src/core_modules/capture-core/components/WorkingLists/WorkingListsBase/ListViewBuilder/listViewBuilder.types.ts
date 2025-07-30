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

type RestProps = Omit<ListViewUpdaterOutputProps & OptionalExtractedProps,
    keyof (ExtractedProps & OptionalExtractedProps)>;

export type Props = RestProps & ExtractedProps;

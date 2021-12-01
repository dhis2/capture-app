// @flow
import type { CustomMenuContents, StickyFilters } from '../../../ListView';
import type { ListViewUpdaterOutputProps } from '../ListViewUpdater';
import type { ColumnConfigs } from '../workingListsBase.types';

type ExtractedProps = {|
    columns: ColumnConfigs,
    customListViewMenuContents?: CustomMenuContents,
    stickyFilters?: StickyFilters,
|};

type OptionalExtractedProps = {|
    stickyFilters: StickyFilters,
|};

type RestProps = $Rest<ListViewUpdaterOutputProps & OptionalExtractedProps, ExtractedProps & OptionalExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

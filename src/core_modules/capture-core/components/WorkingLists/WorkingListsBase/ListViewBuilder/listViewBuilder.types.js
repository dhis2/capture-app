// @flow
import type { ColumnConfigs } from '../workingListsBase.types';
import type { ListViewUpdaterOutputProps } from '../ListViewUpdater';
import type { CustomMenuContents, StickyFilters } from '../../../ListView';

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

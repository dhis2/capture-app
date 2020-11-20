// @flow
import type { ColumnConfigs } from '../workingLists.types';
import type { CustomMenuContents, StickyFilters } from '../../../../ListView';
import type { ListViewUpdaterOutputProps } from '../ListViewUpdater';

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

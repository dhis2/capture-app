// @flow
import type { ColumnConfigs } from '../workingLists.types';
import type { CustomMenuContents } from '../../../../ListView';
import type { ListViewUpdaterOutputProps } from '../ListViewUpdater';

type ExtractedProps = {|
    columns: ColumnConfigs,
    customListViewMenuContents?: CustomMenuContents,
|};

type RestProps = $Rest<ListViewUpdaterOutputProps, ExtractedProps>;

export type Props = {
    ...RestProps,
    ...ExtractedProps,
};

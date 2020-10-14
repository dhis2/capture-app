// @flow
import type { Categories, UpdateList } from '../workingLists.types';
import type { FiltersData, CustomMenuContents } from '../../../../ListView';
import type { ListViewLoaderOutputProps } from '../ListViewLoader';

type ExtractedProps = {|
    filters: FiltersData,
    sortById: string,
    sortByDirection: string,
    onUpdateList: UpdateList,
    customMenuContents?: CustomMenuContents,
    programId: string,
    orgUnitId: string,
    categories?: Categories,
|};

type RestProps = $Rest<ListViewLoaderOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type ListViewUpdaterOutputProps = {|
    ...RestProps,
|};

// @flow
import type {
    ColumnConfigs,
    Categories,
    UpdateList,
    WorkingListTemplate,
} from '../workingLists.types';
import type { FiltersData } from '../../../../ListView';
import type { ListViewConfigMenuContentOutputProps } from '../ListViewConfigMenuContent';

type ExtractedProps = {|
    currentTemplate: WorkingListTemplate,
    programId: string,
|};

type RestProps = $Rest<ListViewConfigMenuContentOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type ListViewLoaderOutputProps = {|
    ...RestProps,
    sortById: string,
    sortByDirection: string,
    filters: FiltersData,
    columns: ColumnConfigs,
    programId: string,
    orgUnitId: string,
    categories?: Categories,
    onUpdateList: UpdateList,
    viewLoadedOnFirstRun: boolean,
|};

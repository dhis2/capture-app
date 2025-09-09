import type { Categories, UpdateList } from '../workingListsBase.types';
import type { FiltersData } from '../../../ListView';
import type { ListViewLoaderOutputProps } from '../ListViewLoader';

type ExtractedProps = {
    filters: FiltersData,
    sortById: string,
    sortByDirection: string,
    onUpdateList: UpdateList,
    programId: string,
    programStageId: string,
    orgUnitId: string,
    categories?: Categories,
    viewLoadedOnFirstRun: boolean,
};

type OptionalExtractedProps = {
    categories: Categories,
};

type RestProps = ListViewLoaderOutputProps & OptionalExtractedProps | ExtractedProps;

export type Props = RestProps & ExtractedProps;

export type ListViewUpdaterOutputProps = RestProps & {
    filters: FiltersData,
    sortById: string,
    sortByDirection: string,
    currentPage: number,
    rowsPerPage: number,
    rowIdKey: string,
};

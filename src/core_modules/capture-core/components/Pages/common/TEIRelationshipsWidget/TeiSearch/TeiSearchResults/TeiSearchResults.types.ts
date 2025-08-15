import type { SearchGroup } from '../../../../../../metaData';

export type OwnProps = {
    id: string;
    searchGroups: any;
    onChangePage: any;
    onNewSearch: any;
    onEditSearch: any;
    getResultsView: any;
    selectedProgramId?: string | null | undefined;
    selectedTrackedEntityTypeId: string;
    trackedEntityTypeName: string;
};

type PropsFromRedux = {
    resultsLoading: boolean;
    teis: any;
    currentPage: number;
    searchValues: any;
    searchGroup: SearchGroup;
};

export type Props = OwnProps & PropsFromRedux;

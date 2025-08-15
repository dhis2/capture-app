import type { SearchGroup } from '../../../../../../metaData';

export type OwnProps = {
    id: string;
    searchGroups: any;
    onChangePage: (...args: any[]) => any;
    onNewSearch: (...args: any[]) => any;
    onEditSearch: (...args: any[]) => any;
    getResultsView: (...args: any[]) => any;
    selectedProgramId?: string;
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

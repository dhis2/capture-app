import type { SearchGroup } from '../../../metaData';

export type OwnProps = {
    id: string;
    searchGroups: any;
    onChangePage: any;
    onNewSearch: any;
    onEditSearch: any;
    getResultsView: any;
};

type PropsFromRedux = {
    resultsLoading: boolean;
    teis: any;
    currentPage: number;
    searchValues: any;
    selectedProgramId: string;
    selectedTrackedEntityTypeId: string;
    searchGroup: SearchGroup;
};

export type Props = OwnProps & PropsFromRedux;

import * as React from 'react';
import { type SearchGroup } from '../../../../../../metaData';

export type OwnProps = {
    id: string;
    searchGroups: any;
    onChangePage: (pageNumber: number) => void;
    onNewSearch: () => void;
    onEditSearch: () => void;
    getResultsView: (props: any) => React.ReactNode;
    selectedProgramId: string | null;
    selectedTrackedEntityTypeId: string;
    trackedEntityTypeName: string;
}

type PropsFromRedux = {
    resultsLoading: boolean;
    teis: any;
    currentPage: number;
    searchValues: any;
    searchGroup: SearchGroup;
}

export type Props = OwnProps & PropsFromRedux;

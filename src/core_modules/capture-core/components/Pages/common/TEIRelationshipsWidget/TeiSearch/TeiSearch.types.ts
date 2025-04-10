import * as React from 'react';
import { type SearchGroup } from '../../../../../metaData';

type CssClasses = {
    classes: Record<string, any>;
};

type PropsFromRedux = {
    searchGroups: SearchGroup[] | null;
    showResults?: boolean | null;
    openSearchGroupSection: string | null;
    trackedEntityTypeName: string;
    selectedProgramId: string | null;
}

type DispatchersFromRedux = {
    onSearch: (formId: string, searchGroupId: string, searchId: string) => void;
    onSearchValidationFailed: (formId: string, searchGroupId: string, searchId: string) => void;
    onSetOpenSearchGroupSection: (searchId: string, searchGroupId: string | null) => void;
    onSearchResultsChangePage: (searchId: string, pageNumber: number) => void;
    onNewSearch: (searchId: string) => void;
    onEditSearch: (searchId: string) => void;
}

export type OwnProps = {
    id: string;
    getResultsView: (props: any) => React.ReactNode;
    resultsPageSize: number;
    selectedTrackedEntityTypeId: string;
}

export type Props = OwnProps & DispatchersFromRedux & PropsFromRedux & CssClasses;

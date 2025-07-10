import type { WithStyles } from '@material-ui/core';

export type OwnProps = {
    nextPageButtonDisabled: boolean;
    dataEntryId: string;
    selectedScopeId: string;
    onChangePage: (page: number) => void;
};

type DispatchersFromFromRedux = {
    onChangePage: (page: number) => void;
};

type PropsFromRedux = {
    currentPage: number;
};

export type Props = OwnProps & DispatchersFromFromRedux & PropsFromRedux & WithStyles<any>;

import type { WithStyles } from '@material-ui/core';

export type OwnProps = {
    nextPageButtonDisabled: boolean;
    dataEntryId: string;
    selectedScopeId: string;
};

type DispatchersFromFromRedux = {
    onChangePage: (page: number) => void;
};

type PropsFromRedux = {
    currentPage: number;
};

export type Props = OwnProps & DispatchersFromFromRedux & PropsFromRedux & WithStyles<typeof styles>;

// @flow
/*
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { changePage, changeRowsPerPage } from './pagination.actions';
import { ListPaginationComponent } from './ListPagination.component';
import type { DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './ListPagination.types';


const mapStateToProps = (state: ReduxState, ownProps: OwnProps): PropsFromRedux => {
    const rowsPerPage = state.workingListsMeta[ownProps.listId].rowsPerPage;
    return {
        rowsPerPage,
        currentPage: state.workingListsMeta[ownProps.listId].currentPage,
        nextPageButtonDisabled: Boolean(rowsPerPage > ownProps.currentRowsPerPage),
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => ({
    onChangeRowsPerPage: (listId: string, rowsPerPage: number) => {
        dispatch(changeRowsPerPage(listId, rowsPerPage));
    },
    onChangePage: (listId: string, page: number) => {
        dispatch(changePage(listId, page));
    },
});

export const ListPagination: ComponentType<OwnProps> =
  connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(ListPaginationComponent);
*/

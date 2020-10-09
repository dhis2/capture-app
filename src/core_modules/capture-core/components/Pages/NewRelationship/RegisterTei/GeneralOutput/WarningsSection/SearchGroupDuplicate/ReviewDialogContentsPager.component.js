// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../../../Pagination/withDefaultNavigation';

const Pager = withNavigation()(Pagination);

const getStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(600),
    },
});

type Props = {
    currentPage: number,
    nextPageButtonDisabled: boolean,
    onChangePage: Function,
    ...CssClasses
};

const ReviewDialogContentsPager = ({ onChangePage, currentPage, nextPageButtonDisabled, classes }: Props) => (
    <div
        className={classes.container}
    >
        <Pager
            currentPage={currentPage}
            onChangePage={page => onChangePage(page)}
            nextPageButtonDisabled={nextPageButtonDisabled}
        />
    </div>
);

export default withStyles(getStyles)(ReviewDialogContentsPager);

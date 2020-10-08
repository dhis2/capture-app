// @flow
import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../../../Pagination/withDefaultNavigation';
import { ResultsPageSizeContext } from '../../../../../shared-contexts';

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

const ReviewDialogContentsPager = ({ onChangePage, currentPage, nextPageButtonDisabled, classes }: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    return (
        <div
            className={classes.container}
        >
            <Pager
                currentPage={currentPage}
                onChangePage={page => onChangePage(page, resultsPageSize)}
                nextPageButtonDisabled={nextPageButtonDisabled}
            />
        </div>
    );
};

export default withStyles(getStyles)(ReviewDialogContentsPager);

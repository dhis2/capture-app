// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../../../Pagination/withDefaultNavigation';

const Pager = withNavigation()(Pagination);

const getStyles = () => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

type Props = {
    paginationData: Object,
    onChangePage: Function,
    classes: Object,
};

const ReviewDialogContentsPager = (props: Props) => {
    const { onChangePage, paginationData, classes } = props;
    return (
        <div
            className={classes.container}
        >
            <Pager
                onChangePage={onChangePage}
                onGetLabelDisplayedRows={(a, b) => `${a} of ${b}`}
                {...paginationData}
            />
        </div>
    );
};

// $FlowFixMe
export default withStyles(getStyles)(ReviewDialogContentsPager);

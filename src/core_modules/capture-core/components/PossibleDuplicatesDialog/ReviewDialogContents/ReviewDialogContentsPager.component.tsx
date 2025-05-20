import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { Pagination } from 'capture-ui';
import { withNavigation } from '../../Pagination/withDefaultNavigation';
import type { Props } from './ReviewDialogContentsPager.types';
import { useDuplicates } from '../useDuplicates';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: '8px',
        maxWidth: '600px',
    },
};

const Pager = withNavigation()(Pagination);



const ReviewDialogContentsPagerPlain = ({
    currentPage,
    nextPageButtonDisabled,
    selectedScopeId,
    dataEntryId,
    classes,
}: Props) => {
    const { changePageOnReviewDuplicates } = useDuplicates(dataEntryId, selectedScopeId);

    return (
        <div
            className={classes.container}
        >
            <Pager
                currentPage={currentPage}
                onChangePage={changePageOnReviewDuplicates}
                nextPageButtonDisabled={nextPageButtonDisabled}
            />
        </div>
    );
};

export const ReviewDialogContentsPagerComponent = withStyles(styles)(ReviewDialogContentsPagerPlain) as ComponentType<Omit<Props, keyof WithStyles<typeof styles>>>;

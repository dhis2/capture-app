import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { Pagination } from 'capture-ui';
import { withNavigation } from '../../Pagination/withDefaultNavigation';
import type { Props } from './ReviewDialogContentsPager.types';
import { useDuplicates } from '../useDuplicates';

const Pager = withNavigation()(Pagination);

const getStyles = (theme: any) => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(600),
    },
});

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

export const ReviewDialogContentsPagerComponent = withStyles(getStyles)(ReviewDialogContentsPagerPlain) as ComponentType<Omit<Props, keyof WithStyles<typeof getStyles>>>;

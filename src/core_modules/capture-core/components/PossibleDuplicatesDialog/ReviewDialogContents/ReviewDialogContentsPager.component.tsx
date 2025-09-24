import React, { type ComponentType } from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';

import { Pagination } from 'capture-ui';
import { withNavigation } from '../../Pagination/withDefaultNavigation';
import type { Props, OwnProps } from './ReviewDialogContentsPager.types';
import { useDuplicates } from '../useDuplicates';

const getStyles = (theme: any) => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(600),
    },
});

const Pager = withNavigation()(Pagination);

const ReviewDialogContentsPagerPlain = ({
    currentPage,
    nextPageButtonDisabled,
    selectedScopeId,
    dataEntryId,
    classes,
}: Props & WithStyles<typeof getStyles>) => {
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

export const ReviewDialogContentsPagerComponent = withStyles(getStyles)(ReviewDialogContentsPagerPlain) as ComponentType<OwnProps>;

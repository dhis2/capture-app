// @flow
import React, { type ComponentType, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import i18n from '@dhis2/d2-i18n';
import { ResultsPageSizeContext } from '../../Pages/shared-contexts';
import { CardList } from '../../CardList';
import { ReviewDialogContentsPager } from './ReviewDialogContentsPager.container';
import type { Props } from './ReviewDialogContents.types';

const getStyles = (theme: Theme) => ({
    linkButtonContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
    title: {
        margin: 0,
        paddingLeft: theme.typography.pxToRem(10),
    },
});

const ReviewDialogContentsPlain = ({
    classes,
    dataElements,
    teis,
    selectedScopeId,
    dataEntryId,
    renderCardActions,
}: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);
    return (
        <React.Fragment>
            <DialogContent data-test="duplicates-modal">
                <DialogTitle className={classes.title}>
                    {i18n.t('Possible duplicates found')}
                </DialogTitle>
                <CardList
                    noItemsText={i18n.t('No results found')}
                    items={teis}
                    dataElements={dataElements}
                    renderCustomCardActions={renderCardActions}
                />

                <ReviewDialogContentsPager
                    dataEntryId={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    nextPageButtonDisabled={teis.length < resultsPageSize}
                />
            </DialogContent>
        </React.Fragment>
    );
};

export const ReviewDialogContentsComponent: ComponentType<Props> = withStyles(getStyles)(ReviewDialogContentsPlain);

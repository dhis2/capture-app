// @flow
import React, { type ComponentType, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ModalTitle, ModalContent } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { CardList } from '../../CardList';
import { ReviewDialogContentsPager } from './ReviewDialogContentsPager.container';
import { ResultsPageSizeContext } from '../../Pages/shared-contexts';
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
            <ModalContent data-test="duplicates-modal">
                <ModalTitle className={classes.title}>
                    {i18n.t('Possible duplicates found')}
                </ModalTitle>
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
            </ModalContent>
        </React.Fragment>
    );
};

export const ReviewDialogContentsComponent: ComponentType<Props> = withStyles(getStyles)(ReviewDialogContentsPlain);

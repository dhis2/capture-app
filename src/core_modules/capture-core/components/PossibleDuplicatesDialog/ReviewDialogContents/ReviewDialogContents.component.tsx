import React, { useContext, type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { ModalTitle, ModalContent } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { CardList } from '../../CardList';
import { ReviewDialogContentsPager } from './ReviewDialogContentsPager.container';
import { ResultsPageSizeContext } from '../../Pages/shared-contexts';
import type { Props } from './ReviewDialogContents.types';

const getStyles = (theme: any) => ({
    linkButtonContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
    title: {
        margin: 0,
        paddingLeft: theme.typography.pxToRem(10),
    },
});

const ReviewDialogContentsPlain = ({
    dataElements,
    teis,
    selectedScopeId,
    dataEntryId,
    renderCardActions,
}: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext as React.Context<{ resultsPageSize: number }>);
    return (
        <React.Fragment>
            <ModalContent data-test="duplicates-modal">
                <ModalTitle>
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
                    onChangePage={() => { /* Required prop but handled by container */ }}
                />
            </ModalContent>
        </React.Fragment>
    );
};

export const ReviewDialogContentsComponent = withStyles(getStyles)(ReviewDialogContentsPlain) as ComponentType<Props>;

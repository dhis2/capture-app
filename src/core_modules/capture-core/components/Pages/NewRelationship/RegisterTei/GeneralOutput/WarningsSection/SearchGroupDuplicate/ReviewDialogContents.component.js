// @flow
import React, { useContext } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../../../../Buttons';
import { CardList } from '../../../../../../CardList';
import { DataElement } from '../../../../../../../metaData';
import ReviewDialogContentsPager from './ReviewDialogContentsPager.container';
import withLoadingIndicator from '../../../../../../../HOC/withLoadingIndicator';
import { ResultsPageSizeContext } from '../../../../../shared-contexts';

const CardListWithLoadingIndicator = withLoadingIndicator(null, null, props => !props.isUpdating)(CardList);

const getStyles = (theme: Theme) => ({
    linkButtonContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
    title: {
        paddingLeft: theme.typography.pxToRem(10),
    },
});

type Props = {
    currentProgramId: ?string,
    dataElements: Array<DataElement>,
    teis: Array<{id: string, values: Object}>,
    onLink: Function,
    isUpdating: boolean,

    ...CssClasses
};

const ReviewDialogContentsPlain = ({ onLink, classes, dataElements, teis, isUpdating }: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);
    const getLinkButton = (itemProps: Object) => {
        const { id, values } = itemProps.item;
        return (
            <div
                className={classes.linkButtonContainer}
            >
                <Button
                    onClick={() => { onLink(id, values); }}
                >
                    {i18n.t('Link')}
                </Button>
            </div>
        );
    };

    return (
        <React.Fragment>
            <DialogContent>
                <DialogTitle className={classes.title}>
                    {i18n.t('Possible duplicates found')}
                </DialogTitle>
                <CardListWithLoadingIndicator
                    noItemsText={i18n.t('No results found')}
                    isUpdating={isUpdating}
                    items={teis}
                    dataElements={dataElements}
                    getCustomItemBottomElements={getLinkButton}
                />

                <ReviewDialogContentsPager nextPageButtonDisabled={teis.length < resultsPageSize} />
            </DialogContent>
        </React.Fragment>
    );
};

export const ReviewDialogContentsComponent = withStyles(getStyles)(ReviewDialogContentsPlain);

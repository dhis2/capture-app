// @flow
import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import CardList from '../../../../../../CardList/CardList.component';
import { DataElement } from '../../../../../../../metaData';
import ReviewDialogContentsPager from './ReviewDialogContentsPager.container';

const getStyles = (theme: Theme) => ({
    linkButtonCotainer: {
        padding: theme.typography.pxToRem(10),
    },
});

type Props = {
    dataElements: Array<DataElement>,
    teis: Array<{id: string, values: Object}>,
    onLink: Function,
    classes: Object,
};

class ReviewDialogContents extends React.Component<Props> {
    getLinkButton = (itemProps: Object) => {
        const { onLink, classes } = this.props;
        const { id, values } = itemProps.item;
        return (
            <div
                className={classes.linkButtonCotainer}
            >
                <Button
                    onClick={() => { onLink(id, values); }}
                    color="primary"
                >
                    {i18n.t('Link')}
                </Button>
            </div>
        );
    }

    render() {
        const { dataElements, teis } = this.props;

        return (
            <React.Fragment>
                <DialogContent>
                    <DialogTitle>
                        {i18n.t('Possible duplicates found')}
                    </DialogTitle>
                    <CardList
                        items={teis}
                        dataElements={dataElements}
                        getCustomItemBottomElements={this.getLinkButton}
                    />
                </DialogContent>
                <ReviewDialogContentsPager />
            </React.Fragment>
        );
    }
}

export default withStyles(getStyles)(ReviewDialogContents);

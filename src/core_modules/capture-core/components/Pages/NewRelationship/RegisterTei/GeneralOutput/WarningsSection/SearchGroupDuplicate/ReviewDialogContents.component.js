// @flow
import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../../../../Buttons';
import CardList from '../../../../../../CardList/CardList.component';
import { DataElement } from '../../../../../../../metaData';
import ReviewDialogContentsPager from './ReviewDialogContentsPager.container';
import withLoadingIndicator from '../../../../../../../HOC/withLoadingIndicator';

const CardListWithLoadingIndicator = withLoadingIndicator(null, null, props => !props.isUpdating)(CardList);

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
    isUpdating: boolean,
};

class ReviewDialogContents extends React.Component<Props> {
    contentListInstance: any;

    height: ?number;

    componentDidMount() {
        if (!this.props.isUpdating && this.contentListInstance) {
            this.height = this.contentListInstance.clientHeight;
        }
    }

    getLinkButton = (itemProps: Object) => {
        const { onLink, classes } = this.props;
        const { id, values } = itemProps.item;
        return (
            <div
                className={classes.linkButtonCotainer}
            >
                <Button
                    onClick={() => { onLink(id, values); }}
                    primary
                >
                    {i18n.t('Link')}
                </Button>
            </div>
        );
    }

    render() {
        const { dataElements, teis, isUpdating } = this.props;

        const divStyle = this.height ? {
            height: this.height,
        } : null;

        return (
            <>
                <DialogContent>
                    <DialogTitle>
                        {i18n.t('Possible duplicates found')}
                    </DialogTitle>
                    <div
                        ref={(instance) => { this.contentListInstance = instance; }}
                        style={divStyle}
                    >
                        <CardListWithLoadingIndicator
                            isUpdating={isUpdating}
                            items={teis}
                            dataElements={dataElements}
                            getCustomItemBottomElements={this.getLinkButton}
                        />
                    </div>
                </DialogContent>
                <ReviewDialogContentsPager />
            </>
        );
    }
}

export default withStyles(getStyles)(ReviewDialogContents);

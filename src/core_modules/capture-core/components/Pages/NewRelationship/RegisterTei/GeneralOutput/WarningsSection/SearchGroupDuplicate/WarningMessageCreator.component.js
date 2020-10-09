// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import LinkButton from '../../../../../../Buttons/LinkButton.component';

const getStyles = () => ({
    linkButton: {
        fontSize: 'inherit',
        paddingLeft: 0,
        paddingRight: 3,
        backgroundColor: 'inherit',
        textDecoration: 'underline',
        cursor: 'pointer',
        outline: 'none',
    },
});

type Props = {
    onReviewDuplicates: (onOpenReviewDialog: Function) => void,
    onOpenReviewDialog: () => void,
    classes: Object,
};

class WarningMessageCreator extends React.Component<Props> {
    handleDuplicatesClick = () => {
        const { onReviewDuplicates, onOpenReviewDialog } = this.props;
        onReviewDuplicates(onOpenReviewDialog);
    }

    render() {
        const { classes } = this.props;
        return (
            <div data-test="dhis2-capture-possible-duplicates-found-button">
                <LinkButton
                    onClick={this.handleDuplicatesClick}
                    className={classes.linkButton}
                >
                    {i18n.t('Possible duplicates found')}
                </LinkButton>
            </div>
        );
    }
}

export default withStyles(getStyles)(WarningMessageCreator);

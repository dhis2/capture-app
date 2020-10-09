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

const WarningMessageCreatorPlain = ({ classes, onOpenReviewDialog, onReviewDuplicates }: Props) => {
    const handleDuplicatesClick = () => {
        onOpenReviewDialog();
        onReviewDuplicates();
    };

    return (
        <LinkButton
            data-test="dhis2-capture-possible-duplicates-found-button"
            onClick={handleDuplicatesClick}
            className={classes.linkButton}
        >
            {i18n.t('Possible duplicates found')}
        </LinkButton>
    );
};

export const WarningMessageCreatorComponent = withStyles(getStyles)(WarningMessageCreatorPlain);

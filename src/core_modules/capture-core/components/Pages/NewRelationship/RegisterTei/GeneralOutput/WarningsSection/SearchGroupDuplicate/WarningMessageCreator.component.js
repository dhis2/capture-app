// @flow
import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import LinkButton from '../../../../../../Buttons/LinkButton.component';
import { ResultsPageSizeContext } from '../../../../../shared-contexts';

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
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    const handleDuplicatesClick = () => {
        onOpenReviewDialog();
        onReviewDuplicates(resultsPageSize);
    };

    return (
        <div>
            <LinkButton
                onClick={handleDuplicatesClick}
                className={classes.linkButton}
            >
                {i18n.t('Possible duplicates found')}
            </LinkButton>
        </div>
    );
};

export const WarningMessageCreatorComponent = withStyles(getStyles)(WarningMessageCreatorPlain);

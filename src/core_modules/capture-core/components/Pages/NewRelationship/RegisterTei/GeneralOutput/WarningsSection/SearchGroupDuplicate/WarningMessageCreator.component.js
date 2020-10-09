// @flow
import React, { type ComponentType, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import LinkButton from '../../../../../../Buttons/LinkButton.component';
import { ResultsPageSizeContext } from '../../../../../shared-contexts';
import type { Props } from './WarningMessageCreator.container';

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



const WarningMessageCreatorPlain = ({ classes, onOpenReviewDialog, onReviewDuplicates }: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    const handleDuplicatesClick = () => {
        onOpenReviewDialog();
        onReviewDuplicates(resultsPageSize);
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

export const WarningMessageCreatorComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(WarningMessageCreatorPlain);

// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import LinkButton from '../../../Buttons/LinkButton.component';
import type { Props } from './WarningMessageCreator.types';
import { useDuplicates } from '../../../PossibleDuplicatesDialog/useDuplicates';

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

const WarningMessageCreatorPlain = ({ classes, onOpenReviewDialog, dataEntryId, selectedScopeId }: Props) => {
    const { onReviewDuplicates } = useDuplicates(dataEntryId, selectedScopeId);
    const handleDuplicatesClick = () => {
        onOpenReviewDialog();
        onReviewDuplicates();
    };

    return (
        <LinkButton
            data-test="possible-duplicates-found-button"
            onClick={handleDuplicatesClick}
            className={classes.linkButton}
        >
            {i18n.t('Possible duplicates found')}
        </LinkButton>
    );
};

export const WarningMessageCreator: ComponentType<$Diff<Props, CssClasses>> =
  withStyles(getStyles)(WarningMessageCreatorPlain);

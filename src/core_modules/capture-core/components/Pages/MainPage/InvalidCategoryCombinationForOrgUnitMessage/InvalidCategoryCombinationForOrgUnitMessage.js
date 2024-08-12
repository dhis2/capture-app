// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';

const styles = {
    incompleteMessageContainer: {
        marginTop: '10px',
    },
};

export const InvalidCategoryCombinationForOrgUnitMessagePlain = ({ classes }: {| ...CssClasses |}) => (
    <div className={classes.incompleteMessageContainer}>
        <IncompleteSelectionsMessage>
            {i18n.t(
                'The category option is not valid for the selected organisation unit. Please select a valid combination.',
            )}
        </IncompleteSelectionsMessage>
    </div>
);

export const InvalidCategoryCombinationForOrgUnitMessage = withStyles(styles)(
    InvalidCategoryCombinationForOrgUnitMessagePlain,
);

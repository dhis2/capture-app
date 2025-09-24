import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';

const styles: Readonly<any> = {
    incompleteMessageContainer: {
        marginTop: '10px',
    },
};

type Props = WithStyles<typeof styles>;

export const InvalidCategoryCombinationForOrgUnitMessagePlain = ({ classes }: Props) => (
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

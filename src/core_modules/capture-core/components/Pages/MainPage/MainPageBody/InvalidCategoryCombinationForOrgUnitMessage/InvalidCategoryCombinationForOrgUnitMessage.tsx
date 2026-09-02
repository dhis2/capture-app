import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IncompleteSelectionsMessage } from '../../../../IncompleteSelectionsMessage';
import { useTermLabel } from '../../../../../metaData';
import { customTerms } from '../../../../../utils/customTerms';

const styles: Readonly<any> = {
    incompleteMessageContainer: {
        marginTop: '10px',
    },
};

type Props = WithStyles<typeof styles>;

export const InvalidCategoryCombinationForOrgUnitMessagePlain = ({ classes }: Props) => {
    const orgUnitLabel = useTermLabel('orgUnit');
    return (
        <div className={classes.incompleteMessageContainer}>
            <IncompleteSelectionsMessage>
                {customTerms.i18n.t(
                    'The category option is not valid for the selected {{orgUnitLabel}}.',
                    { orgUnitLabel },
                )}
                {' '}
                {i18n.t('Please select a valid combination.')}
            </IncompleteSelectionsMessage>
        </div>
    );
};

export const InvalidCategoryCombinationForOrgUnitMessage = withStyles(styles)(
    InvalidCategoryCombinationForOrgUnitMessagePlain,
);

import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { useProgramLabel } from '../../../../../metaData';
import { IncompleteSelectionsMessage } from '../../../../IncompleteSelectionsMessage';

const styles: Readonly<any> = {
    incompleteMessageContainer: {
        marginTop: '10px',
    },
};

type Props = WithStyles<typeof styles>;

export const InvalidCategoryCombinationForOrgUnitMessagePlain = ({ classes }: Props) => {
    const orgUnit = useProgramLabel('orgUnit') ?? i18n.t('organisation unit');
    return (
        <div className={classes.incompleteMessageContainer}>
            <IncompleteSelectionsMessage>
                {i18n.t('The category option is not valid for the selected {{orgUnit}}.', { orgUnit })}
                {' '}
                {i18n.t('Please select a valid combination.')}
            </IncompleteSelectionsMessage>
        </div>
    );
};

export const InvalidCategoryCombinationForOrgUnitMessage = withStyles(styles)(
    InvalidCategoryCombinationForOrgUnitMessagePlain,
);

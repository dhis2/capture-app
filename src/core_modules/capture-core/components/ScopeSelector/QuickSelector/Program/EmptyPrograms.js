// @flow

import React from 'react';
import { Button, spacers, colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';

type Props = {
    onResetOrgUnit: () => void,
    ...CssClasses,
};

const styles = () => ({
    filterWarning: {
        fontSize: '14px',
        color: `${colors.grey700}`,
        display: 'flex',
        alignItems: 'center',
        gap: `${spacers.dp8}`,
        padding: `${spacers.dp4} ${spacers.dp12}`,
    },
});

const EmptyProgramsPlain = ({ onResetOrgUnit, classes }: Props) => (
    <div className={classes.filterWarning}>
        <span>{i18n.t('No programs available.')}</span>
        <Button small secondary onClick={() => onResetOrgUnit()} dataTest="program-selector-no-programs">
            {i18n.t('Show all')}
        </Button>
    </div>
);


export const EmptyPrograms = withStyles(styles)(EmptyProgramsPlain);

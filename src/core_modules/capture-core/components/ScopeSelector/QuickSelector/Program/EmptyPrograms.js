// @flow

import React, { useEffect } from 'react';
import { Button, spacers, colors } from '@dhis2/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';

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

const EmptyProgramsPlain = ({ onResetOrgUnit, classes }: Props) => {
    const { push } = useHistory();
    const { pathname } = useLocation();
    const { enrollmentId, teiId, orgUnitId } = useLocationQuery();

    useEffect(() => {
        const navigateToEventRegistrationPage = () => {
            push(`${pathname}?${buildUrlQueryString({ enrollmentId, teiId, orgUnitId })}`);
        };

        navigateToEventRegistrationPage();
    }, [push, pathname, enrollmentId, teiId, orgUnitId]);

    return (
        <div className={classes.filterWarning}>
            <span>{i18n.t('No programs available.')}</span>
            <Button small secondary onClick={() => onResetOrgUnit()} dataTest="program-selector-no-programs">
                {i18n.t('Show all')}
            </Button>
        </div>
    );
};

export const EmptyPrograms = withStyles(styles)(EmptyProgramsPlain);

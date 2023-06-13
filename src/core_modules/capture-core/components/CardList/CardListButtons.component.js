// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useDispatch } from 'react-redux';
import { searchScopes } from '../SearchBox';
import { availableCardListButtonState, enrollmentTypes } from './CardList.constants';
import {
    navigateToEnrollmentOverview,
} from '../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';

type Props = {
    currentSearchScopeId?: string,
    currentSearchScopeType?: string,
    id: string,
    orgUnitId: string,
    enrollmentType: string,
    programName?: string,
}

const buttonStyles = (theme: Theme) => ({
    buttonMargin: {
        '&:not(:first-child)': {
            marginLeft: theme.typography.pxToRem(8),
        },
    },
});

const deriveNavigationButtonState = (type): $Keys<typeof availableCardListButtonState> => {
    switch (type) {
    case enrollmentTypes.ACTIVE:
        return availableCardListButtonState.SHOW_VIEW_ACTIVE_ENROLLMENT_BUTTON;
    case enrollmentTypes.CANCELLED:
    case enrollmentTypes.COMPLETED:
        return availableCardListButtonState.SHOW_RE_ENROLLMENT_BUTTON;
    default:
        return availableCardListButtonState.DONT_SHOW_BUTTON;
    }
};

const ActionButtons = withStyles(buttonStyles)(({ buttonProps, classes }) => (
    <>{buttonProps.map(props => (
        !props.hide && <Button
            small
            className={classes.buttonMargin}
            dataTest={props.dataTest}
            onClick={props.onClick}
        >
            {props.label}
        </Button>
    ))}</>
));

const CardListButtons = ({
    currentSearchScopeId,
    currentSearchScopeType,
    id,
    orgUnitId,
    enrollmentType,
    programName,
}: Props) => {
    const dispatch = useDispatch();
    const navigationButtonsState = deriveNavigationButtonState(enrollmentType);
    const onHandleClick = () => {
        switch (currentSearchScopeType) {
        case searchScopes.ALL_PROGRAMS:
        case searchScopes.PROGRAM:
            dispatch(navigateToEnrollmentOverview({
                teiId: id,
                programId: currentSearchScopeId,
                orgUnitId,
            }));
            break;
        case searchScopes.TRACKED_ENTITY_TYPE:
            dispatch(navigateToEnrollmentOverview({
                teiId: id,
                orgUnitId,
            }));
            break;
        default:
            break;
        }
    };

    const buttonLists = [{
        dataTest: 'view-dashboard-button',
        onClick: onHandleClick,
        label: currentSearchScopeType === searchScopes.ALL_PROGRAMS ? i18n.t('View {{programName}} dashboard', {
            programName,
            interpolation: { escapeValue: false },
        })
            : i18n.t('View dashboard'),
    },
    {
        dataTest: 'view-active-enrollment-button',
        onClick: onHandleClick,
        label: i18n.t('View active enrollment'),
        hide: navigationButtonsState !== availableCardListButtonState.SHOW_VIEW_ACTIVE_ENROLLMENT_BUTTON,
    },
    {
        dataTest: 're-enrollment-button',
        onClick: onHandleClick,
        label: `${i18n.t('Re-enroll')} ${programName ? `${i18n.t('in')} ${programName}` : ''}`,
        hide: navigationButtonsState !== availableCardListButtonState.SHOW_RE_ENROLLMENT_BUTTON,
    },
    ];
    return <ActionButtons buttonProps={buttonLists} />;
};

export { CardListButtons };

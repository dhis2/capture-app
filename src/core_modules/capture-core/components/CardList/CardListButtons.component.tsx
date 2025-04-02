import React, { type FC, useCallback } from 'react';
import { withStyles, type Theme, type WithStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, type ButtonEventHandler } from '@dhis2/ui';
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
};

type AvailableCardListButtonState = keyof typeof availableCardListButtonState;

const buttonStyles = (theme: Theme) => ({
    buttonMargin: {
        '&:not(:first-child)': {
            marginLeft: theme.typography.pxToRem(8),
        },
    },
});

const deriveNavigationButtonState = (type: string): AvailableCardListButtonState => {
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

type ButtonProp = {
    dataTest: string;
    onClick: ButtonEventHandler<React.MouseEvent<HTMLButtonElement>>;
    label: string;
    hide?: boolean;
};

type ActionButtonsProps = {
    buttonProps: ButtonProp[];
};

type ActionButtonsInternalProps = ActionButtonsProps & WithStyles<typeof buttonStyles>;

const ActionButtonsInternal: FC<ActionButtonsInternalProps> = ({ buttonProps, classes }) => (
    <>{buttonProps.map((props: ButtonProp) => (
        !props.hide && <Button
            small
            className={classes.buttonMargin}
            dataTest={props.dataTest}
            onClick={props.onClick}
            key={props.dataTest}
        >
            {props.label}
        </Button>
    ))}</>
);

const ActionButtons = withStyles(buttonStyles)(ActionButtonsInternal) as React.ComponentType<ActionButtonsProps>;

const CardListButtons: FC<Props> = ({
    currentSearchScopeId,
    currentSearchScopeType,
    id,
    orgUnitId,
    enrollmentType,
    programName,
}) => {
    const dispatch = useDispatch();
    const navigationButtonsState: AvailableCardListButtonState = deriveNavigationButtonState(enrollmentType);
    const onHandleClick: ButtonEventHandler<React.MouseEvent<HTMLButtonElement>> = useCallback((_, event) => {
        event.stopPropagation();

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
    }, [currentSearchScopeType, dispatch, id, currentSearchScopeId, orgUnitId]);

    const buttonLists: ButtonProp[] = [{
        dataTest: 'view-dashboard-button',
        onClick: onHandleClick,
        label: currentSearchScopeType === searchScopes.ALL_PROGRAMS && programName ? i18n.t('View {{programName}} dashboard', {
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

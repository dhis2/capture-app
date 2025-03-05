// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useDispatch } from 'react-redux';
import { searchScopes } from '../SearchBox';
import { availableCardListButtonState, enrollmentTypes } from './CardList.constants';
import {
    navigateToEnrollmentOverview,
} from '../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { theme } from '../../../../styles/theme';

type Props = {
    currentSearchScopeId?: string,
    currentSearchScopeType?: string,
    id: string,
    orgUnitId: string,
    enrollmentType: string,
    programName?: string,
}

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


const ActionButton = ({ dataTest, onClick, label, hide }) => {
    if (hide) return null;

    return (
        <>
            <Button
                small
                className="buttonMargin"
                dataTest={dataTest}
                onClick={onClick}
            >
                {label}
            </Button>
            <style jsx>{`
                :global(.button-margin:not(:first-child)) {
                    margin-left: ${theme.typography.pxToRem(8)};
                }
            `}</style>
        </>
    );
};

const ActionButtons = ({ buttonProps }: { buttonProps: Array<Object>}) => (
    <>
        {buttonProps.map((props, index) => (
            <ActionButton
                key={props.dataTest || index}
                dataTest={props.dataTest}
                onClick={props.onClick}
                label={props.label}
                hide={props.hide}
            />
        ))}
    </>
);

export const CardListButtons = ({
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


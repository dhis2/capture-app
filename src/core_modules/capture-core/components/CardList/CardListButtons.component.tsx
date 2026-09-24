import React, { type FC, useCallback } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, type ButtonEventHandler } from '@dhis2/ui';
import { useDispatch } from 'react-redux';
import { searchScopes } from '../SearchBox';
import { enrollmentTypes } from './CardList.constants';
import {
    navigateToEnrollmentOverview,
} from '../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { useNavigate, buildUrlQueryString } from '../../utils/routing';
import { getScopeFromScopeId, TrackerProgram } from '../../metaData';

type Props = {
    currentSearchScopeId?: string,
    currentSearchScopeType?: string,
    id: string,
    orgUnitId: string,
    enrollmentType: string,
    programName?: string,
    inactive?: boolean,
};

const buttonStyles = (theme: any) => ({
    buttonMargin: {
        '&:not(:first-child)': {
            marginInlineStart: theme.typography.pxToRem(8),
        },
    },
});

type ButtonProp = {
    dataTest: string;
    onClick: ButtonEventHandler<React.MouseEvent<HTMLButtonElement>>;
    label: string;
};

type ActionButtonsProps = {
    buttonProps: ButtonProp[];
};

type ActionButtonsInternalProps = ActionButtonsProps & WithStyles<typeof buttonStyles>;

const ActionButtonsInternal: FC<ActionButtonsInternalProps> = ({ buttonProps, classes }) => (
    <>{buttonProps.map((props: ButtonProp) => (
        <Button
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

const getViewDashboardLabel = (searchScopeType?: string, programName?: string): string => {
    if (searchScopeType === searchScopes.ALL_PROGRAMS && programName) {
        return i18n.t('View {{programName}} dashboard', {
            programName,
            interpolation: { escapeValue: false },
        });
    }
    return i18n.t('View dashboard');
};

const getReEnrollLabel = (programName: string): string =>
    i18n.t('Re-enroll in {{programName}}', {
        programName,
        interpolation: { escapeValue: false },
    });

const computeButtonVisibility = (
    enrollmentType: string,
    program: TrackerProgram | undefined,
    inactive: boolean | undefined,
) => {
    const hasActiveEnrollment = enrollmentType === enrollmentTypes.ACTIVE;
    const hasPreviousEnrollment =
        enrollmentType === enrollmentTypes.COMPLETED
        || enrollmentType === enrollmentTypes.CANCELLED;

    const canReEnroll = Boolean(
        program
        && !inactive
        && !program.onlyEnrollOnce
        && program.access?.data?.write
        && program.trackedEntityType?.access?.data?.write,
    );

    return {
        showViewActiveEnrollment: hasActiveEnrollment,
        showViewDashboard: !hasActiveEnrollment,
        showReEnroll: hasPreviousEnrollment && canReEnroll,
    };
};

const CardListButtons: FC<Props> = ({
    currentSearchScopeId,
    currentSearchScopeType,
    id,
    orgUnitId,
    enrollmentType,
    programName,
    inactive,
}) => {
    const dispatch = useDispatch();
    const { navigate } = useNavigate();

    const scope = getScopeFromScopeId(currentSearchScopeId);
    const program = scope instanceof TrackerProgram ? scope : undefined;

    const { showViewActiveEnrollment, showViewDashboard, showReEnroll } =
        computeButtonVisibility(enrollmentType, program, inactive);

    const onViewDashboardClick: ButtonEventHandler<React.MouseEvent<HTMLButtonElement>> = useCallback((_, event) => {
        event.stopPropagation();
        const programId = currentSearchScopeType === searchScopes.TRACKED_ENTITY_TYPE
            ? undefined
            : currentSearchScopeId;
        dispatch(navigateToEnrollmentOverview({ teiId: id, programId, orgUnitId }));
    }, [dispatch, id, currentSearchScopeType, currentSearchScopeId, orgUnitId]);

    const onReEnrollClick: ButtonEventHandler<React.MouseEvent<HTMLButtonElement>> = useCallback((_, event) => {
        event.stopPropagation();
        if (!currentSearchScopeId) return;
        navigate(`/new?${buildUrlQueryString({ teiId: id, programId: currentSearchScopeId, orgUnitId })}`);
    }, [navigate, id, currentSearchScopeId, orgUnitId]);

    const buttons: ButtonProp[] = [];

    if (showViewDashboard) {
        buttons.push({
            dataTest: 'view-dashboard-button',
            onClick: onViewDashboardClick,
            label: getViewDashboardLabel(currentSearchScopeType, programName),
        });
    }

    if (showViewActiveEnrollment) {
        buttons.push({
            dataTest: 'view-active-enrollment-button',
            onClick: onViewDashboardClick,
            label: i18n.t('View active enrollment'),
        });
    }

    if (showReEnroll && program) {
        buttons.push({
            dataTest: 're-enrollment-button',
            onClick: onReEnrollClick,
            label: getReEnrollLabel(program.name),
        });
    }

    return <ActionButtons buttonProps={buttons} />;
};

export { CardListButtons };

import React, { useEffect, useCallback } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { useDispatch, useSelector } from 'react-redux';
import { spacersNum, Button, IconEdit24, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { useEnrollmentEditEventPageMode } from 'capture-core/hooks';
import { startShowEditEventDataEntry } from '../WidgetEventEdit.actions';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import { useCategoryCombinations } from '../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import {
    updateEnrollmentEvent,
    commitEnrollmentEvent,
    deleteEnrollmentEvent,
} from '../../Pages/common/EnrollmentOverviewDomain';
import { changeEventFromUrl } from '../../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { pageKeys } from '../../App/withAppUrlSync';
import { EventOverflowMenu } from '../../EventOverflowMenu';
import { useNavigate, buildUrlQueryString } from '../../../utils/routing';
import type { PlainProps } from './WidgetHeader.types';

const styles: Readonly<any> = {
    icon: {
        paddingInlineEnd: spacersNum.dp8,
    },
    menu: {
        marginInlineStart: 'auto',
    },
    menuActions: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp4,
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

const WidgetHeaderPlain = ({
    eventId,
    eventStatus,
    stage,
    programId,
    orgUnit,
    teiId,
    enrollmentId,
    setChangeLogIsOpen,
    classes,
    readOnly,
}: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);
    const dispatch = useDispatch();
    const { navigate } = useNavigate();

    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);

    const showEditButton = !readOnly;
    const { programCategory } = useCategoryCombinations(programId);

    const storedEvent = useSelector((state: any) =>
        state.enrollmentDomain?.enrollment?.events?.find((event: any) => event.event === eventId));

    const onCompletionStatusUpdated = useCallback((newStatus: string) => {
        if (storedEvent) {
            const { completedAt, completedBy, ...eventWithoutCompletion } = storedEvent;
            dispatch(updateEnrollmentEvent(eventId, { ...eventWithoutCompletion, status: newStatus }));
            dispatch(commitEnrollmentEvent(eventId));
        }
        dispatch(changeEventFromUrl(eventId, pageKeys.ENROLLMENT_EVENT));
    }, [dispatch, storedEvent, eventId]);

    const onOptimisticStatusUpdate = useCallback((_eventId: string, newStatus: string) => {
        if (storedEvent) {
            dispatch(updateEnrollmentEvent(eventId, { ...storedEvent, status: newStatus }));
            dispatch(commitEnrollmentEvent(eventId));
        }
    }, [dispatch, storedEvent, eventId]);

    const onStatusUpdateSuccess = useCallback(() => {
        dispatch(changeEventFromUrl(eventId, pageKeys.ENROLLMENT_EVENT));
    }, [dispatch, eventId]);

    const navigateToEnrollment = useCallback(() => {
        navigate(`/enrollment?${buildUrlQueryString({ orgUnitId: orgUnit.id, programId, teiId, enrollmentId })}`);
    }, [navigate, orgUnit.id, programId, teiId, enrollmentId]);

    const onDeleteSuccess = useCallback(() => {
        dispatch(deleteEnrollmentEvent(eventId));
        navigateToEnrollment();
    }, [dispatch, eventId, navigateToEnrollment]);

    const { icon, name } = stage;

    return (
        <>
            {icon && (
                <div className={classes.icon}>
                    <NonBundledDhis2Icon
                        name={icon?.name}
                        color={icon?.color}
                        width={30}
                        height={30}
                        cornerRadius={2}
                    />
                </div>
            )}
            <span> {name} </span>
            <div className={classes.menu}>
                {currentPageMode === dataEntryKeys.VIEW && (
                    <div className={classes.menuActions}>
                        {showEditButton && (
                            <Button
                                small
                                secondary
                                icon={<IconEdit24 />}
                                onClick={() => dispatch(startShowEditEventDataEntry(orgUnit, programCategory))}
                                data-test="widget-enrollment-event-edit-button"
                            >
                                {i18n.t('Edit event')}
                            </Button>
                        )}
                        <EventOverflowMenu
                            eventId={eventId}
                            eventStatus={eventStatus}
                            occurredAt={storedEvent?.occurredAt}
                            completedAt={storedEvent?.completedAt}
                            programId={programId}
                            programStage={stage}
                            onCompletionStatusUpdated={onCompletionStatusUpdated}
                            onOptimisticStatusUpdate={onOptimisticStatusUpdate}
                            onStatusUpdateSuccess={onStatusUpdateSuccess}
                            onDeleteSuccess={onDeleteSuccess}
                            onOpenChangelog={() => setChangeLogIsOpen(true)}
                            dataTest="tracker-program-event-overflow-menu"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export const WidgetHeader = withStyles(styles)(WidgetHeaderPlain);

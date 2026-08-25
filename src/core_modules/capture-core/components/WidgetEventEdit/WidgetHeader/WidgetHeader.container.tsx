import React, { useEffect, useCallback, useState } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { useDispatch, useSelector } from 'react-redux';
import { spacersNum, Button, CircularLoader, IconEdit24, IconMore16, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import i18n from '@dhis2/d2-i18n';
import { useEnrollmentEditEventPageMode } from 'capture-core/hooks';
import { startShowEditEventDataEntry } from '../WidgetEventEdit.actions';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import { useCategoryCombinations } from '../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { OverflowButton } from '../../Buttons';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import {
    updateEnrollmentEvent,
    commitEnrollmentEvent,
    rollbackEnrollmentEvent,
    deleteEnrollmentEvent,
    addPersistedEnrollmentEvents,
} from '../../Pages/common/EnrollmentOverviewDomain';
import { EventOverflowMenu, DeleteMenuItemModal } from '../../EventOverflowMenu';
import { changeEventFromUrl } from '../../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { pageKeys } from '../../App/withAppUrlSync';
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
    canDeleteEvent,
    canUncompleteEvent,
    canEditProgramStage,
    readOnlyMessage,
}: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);
    const dispatch = useDispatch();
    const { navigate } = useNavigate();

    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const showEditButton = !readOnly;
    const { programCategory } = useCategoryCombinations(programId);

    const storedEvent = useSelector((state: any) =>
        state.enrollmentDomain?.enrollment?.events?.find((event: any) => event.event === eventId));

    const onCompletionStatusMutate = useCallback((newStatus: string) => {
        if (storedEvent) {
            const { completedAt, ...eventWithoutCompletion } = storedEvent;
            dispatch(updateEnrollmentEvent(eventId, { ...eventWithoutCompletion, status: newStatus }));
        }
    }, [dispatch, storedEvent, eventId]);

    const onCompletionStatusSuccess = useCallback(() => {
        dispatch(commitEnrollmentEvent(eventId));
        dispatch(changeEventFromUrl(eventId, pageKeys.ENROLLMENT_EVENT));
    }, [dispatch, eventId]);

    const onCompletionStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(eventId));
    }, [dispatch, eventId]);

    const onSkipStatusMutate = useCallback((newStatus: string) => {
        if (storedEvent) {
            dispatch(updateEnrollmentEvent(eventId, { ...storedEvent, status: newStatus }));
        }
    }, [dispatch, storedEvent, eventId]);

    const onSkipStatusSuccess = useCallback(() => {
        dispatch(commitEnrollmentEvent(eventId));
        dispatch(changeEventFromUrl(eventId, pageKeys.ENROLLMENT_EVENT));
    }, [dispatch, eventId]);

    const onSkipStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(eventId));
    }, [dispatch, eventId]);

    const onDeleteEvent = useCallback((eventToDeleteId: string) => {
        dispatch(deleteEnrollmentEvent(eventToDeleteId));
        navigate(`/enrollment?${buildUrlQueryString({ orgUnitId: orgUnit.id, teiId, enrollmentId })}`);
    }, [dispatch, navigate, orgUnit.id, teiId, enrollmentId]);

    const onRollbackDeleteEvent = useCallback((eventDetails: ApiEnrollmentEvent) => {
        dispatch(addPersistedEnrollmentEvents({ events: [eventDetails] }));
    }, [dispatch]);

    const { icon, name } = stage;
    const pendingApiResponse = !!storedEvent?.pendingApiResponse;

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
                        {showEditButton && !pendingApiResponse && (
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

                        {pendingApiResponse && <CircularLoader small dataTest="widget-header-saving-loader" />}

                        {!pendingApiResponse && (
                            <OverflowButton
                                open={actionsIsOpen}
                                onClick={() => setActionsIsOpen(prev => !prev)}
                                icon={<IconMore16 />}
                                small
                                secondary
                                dataTest={'tracker-program-event-overflow-button'}
                                component={(
                                    <EventOverflowMenu
                                        eventId={eventId}
                                        eventStatus={eventStatus}
                                        maxWidth="250px"
                                        dataTest="tracker-program-event-overflow-menu"
                                        onOpenChangelog={() => setChangeLogIsOpen(true)}
                                        onClose={() => setActionsIsOpen(false)}
                                        hideMutationActions={!canEditProgramStage}
                                        onSkipMutate={onSkipStatusMutate}
                                        onSkipSuccess={onSkipStatusSuccess}
                                        onSkipError={onSkipStatusError}
                                        onCompletionMutate={onCompletionStatusMutate}
                                        onCompletionSuccess={onCompletionStatusSuccess}
                                        onCompletionError={onCompletionStatusError}
                                        onDeleteRequest={() => setDeleteModalOpen(true)}
                                        canMutateEvent={canDeleteEvent}
                                        canUncompleteEvent={canUncompleteEvent}
                                        readOnlyMessage={readOnlyMessage}
                                    />
                                )}
                            />
                        )}
                    </div>
                )}
            </div>
            {deleteModalOpen && storedEvent && (
                <DeleteMenuItemModal
                    eventId={eventId}
                    pendingApiResponse={false}
                    eventDetails={storedEvent}
                    onDeleteEvent={onDeleteEvent}
                    onRollbackDeleteEvent={onRollbackDeleteEvent}
                    setDeleteModalOpen={setDeleteModalOpen}
                />
            )}
        </>
    );
};

export const WidgetHeader = withStyles(styles)(WidgetHeaderPlain);

import React, { useEffect, useCallback } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { useDispatch, useSelector } from 'react-redux';
import { spacersNum, Button, IconEdit24, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { useEnrollmentEditEventPageMode } from 'capture-core/hooks';
import { startShowEditEventDataEntry } from '../WidgetEventEdit.actions';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import { useCategoryCombinations } from '../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import {
    addPersistedEnrollmentEvents,
    deleteEnrollmentEvent,
} from '../../Pages/common/EnrollmentOverviewDomain/enrollment.actions';
import { EventOverflowMenu } from '../../EventOverflowMenu';
import { useNavigate, buildUrlQueryString } from '../../../utils/routing';
import { changeEventFromUrl } from '../../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { pageKeys } from '../../App/withAppUrlSync';
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

    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus, eventId);
    const showEditButton = !readOnly;
    const { programCategory } = useCategoryCombinations(programId);

    const storedEvent = useSelector((state: any) =>
        state.enrollmentDomain?.enrollment?.events?.find((event: any) => event.event === eventId));

    const onDeleteEvent = useCallback(() => {
        dispatch(deleteEnrollmentEvent(eventId));
        navigate(`enrollment?${buildUrlQueryString({ enrollmentId, orgUnitId: orgUnit.id, programId, teiId })}`);
    }, [dispatch, navigate, eventId, enrollmentId, orgUnit.id, programId, teiId]);

    const onRollbackDeleteEvent = useCallback((event: ApiEnrollmentEvent) => {
        dispatch(addPersistedEnrollmentEvents({ events: [event] }));
    }, [dispatch]);

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

                        {storedEvent && (
                            <EventOverflowMenu
                                eventId={eventId}
                                eventDetails={storedEvent}
                                programId={programId}
                                programStage={stage}
                                pendingApiResponse={storedEvent.pendingApiResponse}
                                onDeleteEvent={onDeleteEvent}
                                onRollbackDeleteEvent={onRollbackDeleteEvent}
                                onOpenChangelog={() => setChangeLogIsOpen(true)}
                                onStatusUpdated={() => dispatch(changeEventFromUrl(eventId, pageKeys.ENROLLMENT_EVENT))}
                                dataTest={'tracker-program-event-overflow'}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export const WidgetHeader = withStyles(styles)(WidgetHeaderPlain);

import React, { useState, useEffect, useCallback } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { useDispatch, useSelector } from 'react-redux';
import { spacersNum, Button, IconEdit24, IconMore16, FlyoutMenu, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
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
} from '../../Pages/common/EnrollmentOverviewDomain';
import { CompletionMenuItem, ChangelogMenuItem } from '../../EventOverflowMenu';
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
    setChangeLogIsOpen,
    classes,
    readOnly,
    canUncompleteEvent,
}: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);
    const dispatch = useDispatch();

    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

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

                        <OverflowButton
                            open={actionsIsOpen}
                            onClick={() => setActionsIsOpen(prev => !prev)}
                            icon={<IconMore16 />}
                            small
                            secondary
                            dataTest={'tracker-program-event-overflow-button'}
                            component={
                                <FlyoutMenu
                                    dense
                                    maxWidth="250px"
                                    dataTest={'tracker-program-event-overflow-menu'}
                                >
                                    {canUncompleteEvent && (
                                        <CompletionMenuItem
                                            eventId={eventId}
                                            eventStatus={eventStatus}
                                            onMutate={onCompletionStatusMutate}
                                            onSuccess={onCompletionStatusSuccess}
                                            onError={onCompletionStatusError}
                                            onClose={() => setActionsIsOpen(false)}
                                        />
                                    )}
                                    <ChangelogMenuItem
                                        onOpenChangelog={() => setChangeLogIsOpen(true)}
                                        onClose={() => setActionsIsOpen(false)}
                                    />
                                </FlyoutMenu>
                            }
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export const WidgetHeader = withStyles(styles)(WidgetHeaderPlain);

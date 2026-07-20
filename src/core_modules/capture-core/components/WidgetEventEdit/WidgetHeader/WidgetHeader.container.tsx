import React, { useState, useEffect, useCallback } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { useDispatch, useSelector } from 'react-redux';
import { spacersNum, Button, IconEdit24, IconMore16, FlyoutMenu, MenuItem, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { FEATURES, useFeature } from 'capture-core-utils';
import { useEnrollmentEditEventPageMode } from 'capture-core/hooks';
import { startShowEditEventDataEntry } from '../WidgetEventEdit.actions';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import { useCategoryCombinations } from '../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { OverflowButton } from '../../Buttons';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import {
    updateEnrollmentEvent,
    commitEnrollmentEvent,
} from '../../Pages/common/EnrollmentOverviewDomain';
import { changeEventFromUrl } from '../../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { pageKeys } from '../../App/withAppUrlSync';
import { eventStatuses } from '../constants/status.const';
import { UncompleteEventMenuItem } from '../UncompleteEventMenuItem';
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

    const supportsChangelog = useFeature(FEATURES.changelogs);
    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

    const showEditButton = !readOnly;
    const showUncompleteAction = Boolean(canUncompleteEvent) && eventStatus === eventStatuses.COMPLETED;
    const { programCategory } = useCategoryCombinations(programId);

    const storedEvent = useSelector((state: any) =>
        state.enrollmentDomain?.enrollment?.events?.find((event: any) => event.event === eventId));

    const onUncompleted = useCallback(() => {
        if (storedEvent) {
            const { completedAt, completedBy, ...uncompletedEvent } = storedEvent;
            dispatch(updateEnrollmentEvent(eventId, { ...uncompletedEvent, status: eventStatuses.ACTIVE }));
            dispatch(commitEnrollmentEvent(eventId));
        }
        dispatch(changeEventFromUrl(eventId, pageKeys.ENROLLMENT_EVENT));
    }, [dispatch, storedEvent, eventId]);

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

                        {(supportsChangelog || showUncompleteAction) && (
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
                                        {showUncompleteAction && (
                                            <UncompleteEventMenuItem
                                                eventId={eventId}
                                                onUncompleted={onUncompleted}
                                                onClose={() => setActionsIsOpen(false)}
                                            />
                                        )}
                                        {supportsChangelog && (
                                            <MenuItem
                                                label={i18n.t('View changelog')}
                                                suffix=""
                                                onClick={() => {
                                                    setChangeLogIsOpen(true);
                                                    setActionsIsOpen(false);
                                                }}
                                            />
                                        )}
                                    </FlyoutMenu>
                                }
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export const WidgetHeader = withStyles(styles)(WidgetHeaderPlain);

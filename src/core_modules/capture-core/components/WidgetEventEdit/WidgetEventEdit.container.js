// @flow
import React, { type ComponentType, useEffect, useState } from 'react';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import { useSelector } from 'react-redux';
import {
    spacersNum,
    colors,
    spacers,
} from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { PlainProps, ComponentProps } from './widgetEventEdit.types';
import { Widget } from '../Widget';
import { EditEventDataEntry } from './EditEventDataEntry/';
import { ViewEventDataEntry } from './ViewEventDataEntry/';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { EventChangelogWrapper } from './EventChangelogWrapper';
import { FEATURES, useFeature } from '../../../capture-core-utils';
import { inMemoryFileStore } from '../DataEntry/file/inMemoryFileStore';
import { WidgetHeader } from './WidgetHeader';
import { WidgetTwoEventWorkspace, WidgetTwoEventWorkspaceWrapperTypes } from '../WidgetTwoEventWorkspace';
import { useProgramExpiryForUser, useEnrollmentEditEventPageMode, useAvailableProgramStages } from '../../hooks';

const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        '& > div:nth-child(2)': {
            margin: spacersNum.dp16,
            borderRadius: 3,
            borderStyle: 'solid',
            borderColor: colors.grey400,
            borderWidth: 1,
        },
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    form: {
        padding: spacersNum.dp8,
    },
    menu: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
        justifyContent: 'space-between',
        background: colors.white,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    menuActions: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp4,
    },
    button: { margin: spacersNum.dp8 },
    tooltip: { display: 'inline-flex' },
};

const WidgetEventEditPlain = ({
    eventStatus,
    initialScheduleDate,
    stage,
    formFoundation,
    onCancelEditEvent,
    onHandleScheduleSave,
    onSaveExternal,
    programId,
    orgUnitId,
    enrollmentId,
    eventId,
    stageId,
    teiId,
    assignee,
    onSaveAndCompleteEnrollment,
    onSaveAndCompleteEnrollmentSuccessActionType,
    onSaveAndCompleteEnrollmentErrorActionType,
    onDeleteEvent,
    onDeleteEventRelationship,
    classes,
}: PlainProps) => {
    useEffect(() => inMemoryFileStore.clear, []);

    const supportsChangelog = useFeature(FEATURES.changelogs);
    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);
    const [changeLogIsOpen, setChangeLogIsOpen] = useState(false);
    // "Edit event"-button depends on loadedValues. Delay rendering component until loadedValues has been initialized.
    const loadedValues = useSelector(({ viewEventPage }) => viewEventPage.loadedValues);
    const orgUnit = loadedValues?.orgUnit;
    const occurredAt = loadedValues?.dataEntryValues?.occurredAt;
    const expiryPeriod = useProgramExpiryForUser(programId);

    const availableProgramStages = useAvailableProgramStages(stage, teiId, enrollmentId, programId);

    return orgUnit && loadedValues ? (
        <div className={classes.container}>
            <WidgetTwoEventWorkspace
                type={WidgetTwoEventWorkspaceWrapperTypes.EDIT_EVENT}
                currentPage={currentPageMode}
                eventId={eventId}
                programId={programId}
                orgUnitId={orgUnitId}
                stageId={stageId}
                stage={stage}
                onDeleteEvent={onDeleteEvent}
                onDeleteEventRelationship={onDeleteEventRelationship}
            />
            <div data-test="widget-enrollment-event">
                <Widget
                    header={
                        <WidgetHeader
                            eventStatus={eventStatus}
                            stage={stage}
                            programId={programId}
                            orgUnit={orgUnit}
                            setChangeLogIsOpen={setChangeLogIsOpen}
                            occurredAt={occurredAt}
                        />
                    }
                    noncollapsible
                    borderless
                >
                    <div className={classes.form}>
                        {currentPageMode === dataEntryKeys.VIEW ? (
                            <div
                                className={classes.form}
                                data-test={'widget-enrollment-event-view'}
                            >
                                <ViewEventDataEntry
                                    programId={programId}
                                    formFoundation={formFoundation}
                                    dataEntryId={dataEntryIds.ENROLLMENT_EVENT}
                                    hideDueDate={stage.hideDueDate}
                                />
                            </div>
                        ) : (
                            <div
                                className={classes.form}
                                data-test={'widget-enrollment-event-edit'}
                            >
                                <EditEventDataEntry
                                    dataEntryId={dataEntryIds.ENROLLMENT_EVENT}
                                    formFoundation={formFoundation}
                                    orgUnit={orgUnit}
                                    programId={programId}
                                    stageId={stageId}
                                    teiId={teiId}
                                    enrollmentId={enrollmentId}
                                    expiryPeriod={expiryPeriod}
                                    eventId={eventId}
                                    eventStatus={eventStatus}
                                    onCancelEditEvent={onCancelEditEvent}
                                    hasDeleteButton
                                    onHandleScheduleSave={onHandleScheduleSave}
                                    onSaveExternal={onSaveExternal}
                                    initialScheduleDate={initialScheduleDate}
                                    allowGenerateNextVisit={stage.allowGenerateNextVisit}
                                    askCompleteEnrollmentOnEventComplete={stage.askCompleteEnrollmentOnEventComplete}
                                    availableProgramStages={availableProgramStages}
                                    hideDueDate={stage.hideDueDate}
                                    assignee={assignee}
                                    onSaveAndCompleteEnrollmentExternal={onSaveAndCompleteEnrollment}
                                    onSaveAndCompleteEnrollmentErrorActionType={onSaveAndCompleteEnrollmentErrorActionType}
                                    onSaveAndCompleteEnrollmentSuccessActionType={onSaveAndCompleteEnrollmentSuccessActionType}
                                />
                            </div>
                        )}
                    </div>
                </Widget>
            </div>

            {supportsChangelog && changeLogIsOpen && (
                <EventChangelogWrapper
                    isOpen
                    setIsOpen={setChangeLogIsOpen}
                    eventId={loadedValues.eventContainer.id}
                    eventData={loadedValues.eventContainer.values}
                    formFoundation={formFoundation}
                />
            )}
        </div>
    ) : <LoadingMaskElementCenter />;
};
export const WidgetEventEdit: ComponentType<ComponentProps> = withStyles(styles)(WidgetEventEditPlain);


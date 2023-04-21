// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { getProgramAndStageForProgram, TrackerProgram, getProgramEventAccess } from '../../metaData';
import { useOrganisationUnit } from '../../dataQueries';
import { useLocationQuery } from '../../utils/routing';
import type { ContainerProps } from './widgetEventSchedule.types';
import { WidgetEventScheduleComponent } from './WidgetEventSchedule.component';
import {
    useScheduleConfigFromProgramStage,
    useDetermineSuggestedScheduleDate,
    useEventsInOrgUnit,
    useScheduleConfigFromProgram,
    useCommentDetails,
} from './hooks';
import { requestScheduleEvent } from './WidgetEventSchedule.actions';
import { NoAccess } from './AccessVerification';

export const WidgetEventSchedule = ({
    enrollmentId,
    teiId,
    stageId,
    programId,
    orgUnitId,
    onSave,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    onCancel,
    initialScheduleDate,
    ...passOnProps
}: ContainerProps) => {
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const dispatch = useDispatch();
    const { orgUnit } = useOrganisationUnit(orgUnitId, 'displayName');
    const { programStageScheduleConfig } = useScheduleConfigFromProgramStage(stageId);
    const { programConfig } = useScheduleConfigFromProgram(programId);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, initialScheduleDate, ...passOnProps,
    });
    const { currentUser, noteId } = useCommentDetails();
    const [scheduleDate, setScheduleDate] = useState('');
    const [comments, setComments] = useState([]);
    const { events } = useEventsInOrgUnit(orgUnitId, scheduleDate);
    const { eventId } = useLocationQuery();
    const eventCountInOrgUnit = events.filter(event => moment(event.scheduledAt).format('YYYY-MM-DD') === scheduleDate).length;

    useEffect(() => {
        if (!scheduleDate && suggestedScheduleDate) { setScheduleDate(suggestedScheduleDate); }
    }, [suggestedScheduleDate, scheduleDate]);

    const onHandleSchedule = useCallback(() => {
        dispatch(requestScheduleEvent({
            scheduleDate,
            comments,
            programId,
            orgUnitId,
            stageId,
            teiId,
            enrollmentId,
            eventId,
            onSaveExternal: onSave,
            onSaveSuccessActionType,
            onSaveErrorActionType,
        }));
    }, [
        dispatch,
        scheduleDate,
        comments,
        programId,
        orgUnitId,
        stageId,
        teiId,
        enrollmentId,
        eventId,
        onSave,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    ]);

    React.useEffect(() => {
        if (suggestedScheduleDate && !scheduleDate) {
            setScheduleDate(suggestedScheduleDate);
        }
    }, [scheduleDate, suggestedScheduleDate]);


    const onAddComment = (comment) => {
        const newComment = {
            storedBy: currentUser.userName,
            storedAt: moment().toISOString(),
            value: comment,
            createdBy: {
                firstName: currentUser.firstName,
                surname: currentUser.surname,
            },
            note: noteId,
        };
        setComments([...comments, newComment]);
    };


    if (!program || !stage || !(program instanceof TrackerProgram)) {
        return (
            <div>
                {i18n.t('program or stage is invalid')};
            </div>
        );
    }

    const eventAccess = getProgramEventAccess(programId, stageId);
    if (!eventAccess?.write) {
        return (
            <NoAccess
                onCancel={onCancel}
            />
        );
    }

    return (
        <WidgetEventScheduleComponent
            stageId={stageId}
            stageName={stage.name}
            programId={programId}
            programName={program.name}
            scheduleDate={scheduleDate}
            displayDueDateLabel={programStageScheduleConfig.displayDueDateLabel}
            suggestedScheduleDate={suggestedScheduleDate}
            onCancel={onCancel}
            setScheduleDate={setScheduleDate}
            onSchedule={onHandleSchedule}
            onAddComment={onAddComment}
            eventCountInOrgUnit={eventCountInOrgUnit}
            orgUnit={orgUnit}
            comments={comments}
            {...passOnProps}
        />

    );
};


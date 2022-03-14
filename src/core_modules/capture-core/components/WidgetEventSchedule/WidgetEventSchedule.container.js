// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { useOrganisationUnit } from '../../dataQueries';
import type { ContainerProps } from './widgetEventSchedule.types';
import { WidgetEventScheduleComponent } from './WidgetEventSchedule.component';
import {
    useScheduleConfigFromProgramStage,
    useDetermineSuggestedScheduleDate,
    useEventsInOrgUnit,
    useScheduleConfigFromProgram,
} from './hooks';
import { requestScheduleEvent } from './WidgetEventSchedule.actions';

export const WidgetEventSchedule = ({
    enrollmentId,
    teiId,
    stageId,
    programId,
    orgUnitId,
    onSave,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    ...passOnProps
}: ContainerProps) => {
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const dispatch = useDispatch();
    const { orgUnit } = useOrganisationUnit(orgUnitId, 'displayName');
    const { programStageScheduleConfig } = useScheduleConfigFromProgramStage(stageId);
    const { programConfig } = useScheduleConfigFromProgram(programId);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, ...passOnProps,
    });
    const [scheduleDate, setScheduleDate] = useState('');
    const [comments, setComments] = useState([]);
    const { events } = useEventsInOrgUnit(orgUnitId, scheduleDate);

    const eventCountInOrgUnit = events
        .filter(event => moment(event.scheduledAt).format('YYYY-MM-DD') === scheduleDate).length;

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
        setComments([...comments, { value: comment }]);
    };


    if (!program || !stage || !(program instanceof TrackerProgram)) {
        return (
            <div>
                {i18n.t('program or stage is invalid')};
            </div>
        );
    }

    return (
        <WidgetEventScheduleComponent
            stageId={stageId}
            stageName={stage.name}
            programId={programId}
            programName={program.name}
            scheduleDate={scheduleDate}
            suggestedScheduleDate={suggestedScheduleDate}
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


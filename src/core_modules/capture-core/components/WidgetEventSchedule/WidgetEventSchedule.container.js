// @flow
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import i18n from '@dhis2/d2-i18n';
import { useDataMutation } from '@dhis2/app-runtime';
import moment from 'moment';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { useOrganisationUnit } from '../WidgetEnrollmentEventNew/Validated/useOrganisationUnit';
import type { ContainerProps } from './widgetEventSchedule.types';
import { WidgetEventScheduleComponent } from './WidgetEventSchedule.component';
import { urlArguments } from '../../utils/url';
import {
    useScheduleConfigFromProgramStage,
    useDetermineSuggestedScheduleDate,
    useEventsInOrgUnit,
    useScheduleConfigFromProgram,
} from './hooks';

const scheduleEventMutation = {
    resource: 'events',
    type: 'create',
    data: events => events,
};

export const WidgetEventSchedule = ({
    enrollmentId,
    teiId,
    stageId,
    programId,
    orgUnitId,
    ...passOnProps
}: ContainerProps) => {
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const history = useHistory();
    const { orgUnit } = useOrganisationUnit(orgUnitId);
    const { programStageScheduleConfig } = useScheduleConfigFromProgramStage(stageId);
    const { programConfig } = useScheduleConfigFromProgram(programId);
    const { events, refetch: refetchEventsInOrgUnit } = useEventsInOrgUnit(orgUnitId);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, ...passOnProps,
    });
    const [scheduleDate, setScheduleDate] = useState(suggestedScheduleDate);
    const [mutate] = useDataMutation(scheduleEventMutation, {
        onComplete: () => {
            history.push(`/enrollment?${urlArguments({ orgUnitId, programId, stageId, enrollmentId })}`);
        },
    });
    const eventCountInOrgUnit = events
        .filter(event => moment(event.dueDate).format('YYYY-MM-DD') === scheduleDate).length;

    const onHandleSchedule = async () => {
        if (!scheduleDate) { return; }
        await mutate({ events: [{
            dueDate: scheduleDate,
            dataValues: [],
            trackedEntityInstance: teiId,
            orgUnit: orgUnitId,
            enrollment: enrollmentId,
            program: programId,
            programStage: stageId,
            status: 'SCHEDULE',
            notes: [],
        }] });
    };
    const onAddComment = () => {
        // TODO add the comment function in DHIS2-11864
    };

    useEffect(() => { refetchEventsInOrgUnit(); }, [orgUnitId]);// eslint-disable-line react-hooks/exhaustive-deps
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
            scheduleDate={scheduleDate ?? suggestedScheduleDate}
            suggestedScheduleDate={suggestedScheduleDate}
            setScheduleDate={setScheduleDate}
            onSchedule={onHandleSchedule}
            onAddComment={onAddComment}
            eventCountInOrgUnit={eventCountInOrgUnit}
            orgUnit={orgUnit}
            {...passOnProps}
        />

    );
};


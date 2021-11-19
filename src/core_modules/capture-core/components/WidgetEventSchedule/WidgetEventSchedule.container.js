// @flow
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import i18n from '@dhis2/d2-i18n';
import { useDataMutation } from '@dhis2/app-runtime';
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
import { buildUrlQueryString } from '../../utils/routing';

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
    const { orgUnit } = useOrganisationUnit(orgUnitId, 'displayName');
    const { programStageScheduleConfig } = useScheduleConfigFromProgramStage(stageId);
    const { programConfig } = useScheduleConfigFromProgram(programId);
    const suggestedScheduleDate = useDetermineSuggestedScheduleDate({
        programStageScheduleConfig, programConfig, ...passOnProps,
    });
    const [scheduleDate, setScheduleDate] = useState();
    const { events } = useEventsInOrgUnit(orgUnitId, scheduleDate);

    const [mutate] = useDataMutation(scheduleEventMutation, {
        onComplete: () => {
            history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, stageId, enrollmentId })}`);
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

    React.useEffect(() => {
        if (suggestedScheduleDate && !scheduleDate) {
            setScheduleDate(suggestedScheduleDate);
        }
    }, [scheduleDate, suggestedScheduleDate]);

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
            {...passOnProps}
        />

    );
};


// @flow
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import i18n from '@dhis2/d2-i18n';
import { useDataMutation } from '@dhis2/app-runtime';
import { getProgramAndStageForProgram, TrackerProgram } from '../../metaData';
import { useOrganisationUnit } from '../WidgetEnrollmentEventNew/Validated/useOrganisationUnit';
import type { ContainerProps } from './widgetEventSchedule.types';
import { WidgetEventScheduleComponent } from './WidgetEventSchedule.component';
import { urlArguments } from '../../utils/url';

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
    const [scheduleDate, setScheduleDate] = useState();
    const { program, stage } = useMemo(() => getProgramAndStageForProgram(programId, stageId), [programId, stageId]);
    const history = useHistory();
    const { orgUnit } = useOrganisationUnit(orgUnitId);

    const [mutate] = useDataMutation(scheduleEventMutation, {
        onComplete: () => {
            history.push(`/enrollment?${urlArguments({ orgUnitId, programId, stageId, enrollmentId })}`);
        },
    });
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
            setScheduleDate={setScheduleDate}
            onSchedule={onHandleSchedule}
            orgUnit={{ id: orgUnitId, ...orgUnit }}
            {...passOnProps}
        />

    );
};


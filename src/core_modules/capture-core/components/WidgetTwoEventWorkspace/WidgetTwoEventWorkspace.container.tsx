import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './WidgetTwoEventWorkspace.types';
import { useMetadataForProgramStage } from '../DataEntries/common/ProgramStage/useMetadataForProgramStage';
import { Widget } from '../Widget';
import { useLinkedEventByOriginId } from './hooks/useLinkedEventByOriginId';
import { WidgetTwoEventWorkspaceComponent } from './WidgetTwoEventWorkspace.component';
import { useClientDataValues } from './hooks/useClientDataValues';
import { WidgetWrapper } from './WidgetWrapper';
import { WidgetHeader } from './WidgetHeader';
import { useProgram } from '../WidgetEnrollment/hooks/useProgram';

const stageHasWriteAccess = (program: any, id: string | undefined) =>
    Boolean(program?.programStages?.find((s: any) => s.id === id)?.access?.data?.write);

const useTwoEventWorkspaceData = (eventId: string, programId: string, fallbackStageId: string | undefined) => {
    const { program } = useProgram(programId);

    const linkedEventQuery = useLinkedEventByOriginId({ originEventId: eventId });
    const { linkedEvent, dataValues } = linkedEventQuery;

    const metadataQuery = useMetadataForProgramStage({
        programId,
        stageId: linkedEvent?.programStage,
    });
    const { formFoundation, stage: linkedStage } = metadataQuery;

    const clientValuesQuery = useClientDataValues({
        linkedEventId: linkedEvent?.event,
        dataValues,
        formFoundation,
    });

    const isLoading = linkedEventQuery.isLoading || metadataQuery.isLoading || clientValuesQuery.isLoading;
    const isError = linkedEventQuery.isError || metadataQuery.isError || clientValuesQuery.isError;
    const missingData = !linkedEvent || !formFoundation || !linkedStage;
    const accessBlocked = Boolean(program)
        && (!stageHasWriteAccess(program, fallbackStageId) || !stageHasWriteAccess(program, linkedEvent?.programStage));

    return {
        program,
        linkedEvent,
        linkedStage,
        formFoundation,
        relationship: linkedEventQuery.relationship,
        relationshipType: linkedEventQuery.relationshipType,
        clientValuesWithSubValues: clientValuesQuery.clientValuesWithSubValues,
        isLoading,
        isError,
        missingData,
        accessBlocked,
    };
};

export const WidgetTwoEventWorkspace = ({
    eventId,
    programId,
    orgUnitId,
    currentPage,
    stageId,
    stage,
    type,
    onDeleteEvent,
    onDeleteEventRelationship,
}: Props) => {
    const {
        linkedEvent,
        linkedStage,
        formFoundation,
        relationship,
        relationshipType,
        clientValuesWithSubValues,
        isLoading,
        isError,
        missingData,
        accessBlocked,
    } = useTwoEventWorkspaceData(eventId, programId, stageId ?? stage?.id);

    if (isLoading) return null;
    if (isError) {
        return (
            <div>
                {i18n.t('An error occurred while loading the widget.')}
            </div>
        );
    }
    if (missingData || accessBlocked) return null;

    return (
        <WidgetWrapper
            type={type}
            stage={stage}
            linkedStage={linkedStage}
            widget={
                <Widget
                    header={
                        <WidgetHeader
                            linkedStage={linkedStage}
                            linkedEvent={linkedEvent}
                            orgUnitId={orgUnitId}
                            currentPage={currentPage}
                            stage={linkedStage}
                            eventId={eventId}
                            relationship={relationship}
                            relationshipType={relationshipType}
                            onDeleteEvent={onDeleteEvent}
                            onDeleteEventRelationship={onDeleteEventRelationship}
                        />
                    }
                    noncollapsible
                >
                    <WidgetTwoEventWorkspaceComponent
                        linkedEvent={linkedEvent}
                        formFoundation={formFoundation}
                        dataValues={clientValuesWithSubValues}
                    />
                </Widget>
            }
        />
    );
};

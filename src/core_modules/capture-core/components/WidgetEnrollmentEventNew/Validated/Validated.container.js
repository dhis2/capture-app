// @flow
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { withAskToCreateNew, withSaveHandler } from '../../DataEntry';
import { useLifecycle } from './useLifecycle';
import { useClientFormattedRulesExecutionDependencies } from './useClientFormattedRulesExecutionDependencies';
import { ValidatedComponent } from './Validated.component';
import {
    cleanUpEventSaveInProgress,
    newEventBatchActionTypes,
    requestSaveEvent,
    setSaveEnrollmentEventInProgress,
    startCreateNewAfterCompleting,
} from './validated.actions';
import type { ContainerProps, RelatedStageRefPayload } from './validated.types';
import type { RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { useAvailableProgramStages } from '../../../hooks';
import { useBuildNewEventPayload } from './useBuildNewEventPayload';

const SaveHandlerHOC = withSaveHandler()(ValidatedComponent);
const AskToCreateNewHandlerHOC = withAskToCreateNew()(SaveHandlerHOC);

export const Validated = ({
    program,
    stage,
    formFoundation,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    orgUnit,
    teiId,
    enrollmentId,
    rulesExecutionDependencies,
    ...passOnProps
}: ContainerProps) => {
    const dataEntryId = 'enrollmentEvent';
    const itemId = 'newEvent';
    const relatedStageRef = useRef<RelatedStageRefPayload | null>(null);
    const eventSaveInProgress = useSelector(
        ({ enrollmentDomain }) => !!enrollmentDomain.eventSaveInProgress?.requestEventId,
    );
    const { buildNewEventPayload } = useBuildNewEventPayload({
        dataEntryId,
        itemId,
        programId: program.id,
        orgUnitId: orgUnit.id,
        orgUnitName: orgUnit.name,
        teiId,
        enrollmentId,
        formFoundation,
    });

    const rulesExecutionDependenciesClientFormatted =
        useClientFormattedRulesExecutionDependencies(rulesExecutionDependencies, program);

    const ready = useLifecycle({
        program,
        stage,
        formFoundation,
        orgUnit,
        dataEntryId,
        itemId,
        // $FlowFixMe Investigate
        rulesExecutionDependenciesClientFormatted,
    });

    const availableProgramStages = useAvailableProgramStages(stage, teiId, enrollmentId, program.id);

    const dispatch = useDispatch();
    const handleSave = useCallback((
        dataEntryItemId: string,
        dataEntryIdArgument: string,
        formFoundationArgument: RenderFoundation,
        saveType: ?$Values<typeof addEventSaveTypes>,
    ) => {
        // window.scrollTo(0, 0);
        const {
            clientRequestEvent,
            formHasError,
            linkedEvent,
            relationship,
            linkMode,
        } = buildNewEventPayload(saveType, relatedStageRef);

        if (formHasError) return;

        dispatch(batchActions([
            requestSaveEvent({
                requestEvent: clientRequestEvent,
                linkedEvent,
                relationship,
                linkMode,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            }),
            // stores meta in redux to be used when navigating after save
            setSaveEnrollmentEventInProgress({
                requestEventId: clientRequestEvent?.event,
                linkedEventId: linkedEvent?.event,
                linkedOrgUnitId: linkedEvent?.orgUnit,
                linkMode,
            }),
        ], newEventBatchActionTypes.REQUEST_SAVE_AND_SET_SUBMISSION_IN_PROGRESS),
        );
    }, [buildNewEventPayload, onSaveExternal, dispatch, onSaveSuccessActionType, onSaveErrorActionType]);

    const handleCreateNew = useCallback((isCreateNew?: boolean) => {
        handleSave(itemId, dataEntryId, formFoundation, addEventSaveTypes.COMPLETE);

        dispatch(startCreateNewAfterCompleting({
            enrollmentId, isCreateNew, orgUnitId: orgUnit.id, programId: program.id, teiId, availableProgramStages,
        }));
    }, [handleSave, formFoundation, dispatch, enrollmentId, orgUnit.id, program.id, teiId, availableProgramStages]);

    // Clean up data entry on unmount in case the user navigates away, stopping delayed navigation
    useEffect(() => () => {
        dispatch(cleanUpEventSaveInProgress());
    }, [dispatch]);

    return (
        <AskToCreateNewHandlerHOC
            {...passOnProps}
            stage={stage}
            allowGenerateNextVisit={stage.allowGenerateNextVisit}
            availableProgramStages={availableProgramStages}
            eventSaveInProgress={eventSaveInProgress}
            ready={ready}
            id={dataEntryId}
            itemId={itemId}
            enrollmentId={enrollmentId}
            formFoundation={formFoundation}
            relatedStageRef={relatedStageRef}
            onSave={handleSave}
            onCancelCreateNew={() => handleCreateNew()}
            onConfirmCreateNew={() => handleCreateNew(true)}
            programId={program.id}
            programName={program.name}
            orgUnit={orgUnit}
            rulesExecutionDependenciesClientFormatted={rulesExecutionDependenciesClientFormatted}
        />
    );
};

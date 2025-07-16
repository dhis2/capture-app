import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { withAskToCompleteEnrollment } from '../../DataEntries';
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
import type { ContainerProps } from './validated.types';
import type { RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { useAvailableProgramStages } from '../../../hooks';
import { createServerData, useBuildNewEventPayload } from './useBuildNewEventPayload';
import type { RelatedStageRefPayload } from '../../WidgetRelatedStages';

const SaveHandlerHOC = withSaveHandler()(ValidatedComponent);
const AskToCreateNewHandlerHOC = withAskToCreateNew()(SaveHandlerHOC);
const ValidatedComponentWrapper = withAskToCompleteEnrollment()(AskToCreateNewHandlerHOC);

export const Validated = ({
    program,
    stage,
    formFoundation,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    orgUnitContext,
    teiId,
    enrollmentId,
    rulesExecutionDependencies,
    onSaveAndCompleteEnrollmentSuccessActionType,
    onSaveAndCompleteEnrollmentErrorActionType,
    ...passOnProps
}: ContainerProps) => {
    const dataEntryId = 'enrollmentEvent';
    const itemId = 'newEvent';
    const relatedStageRef = useRef<RelatedStageRefPayload | null>(null);
    const eventSaveInProgress = useSelector(
        (state: any) => !!state.enrollmentDomain.eventSaveInProgress?.requestEventId,
    );
    const { buildNewEventPayload } = useBuildNewEventPayload({
        dataEntryId,
        itemId,
        programId: program.id,
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
        orgUnitContext,
        dataEntryId,
        itemId,
        rulesExecutionDependenciesClientFormatted,
    });

    const availableProgramStages = useAvailableProgramStages(stage, teiId, enrollmentId, program.id);

    const dispatch = useDispatch();
    const handleSave = useCallback((
        dataEntryItemId: string,
        dataEntryIdArgument: string,
        formFoundationArgument: RenderFoundation,
        saveType?: keyof typeof addEventSaveTypes,
        enrollment?: Record<string, unknown>,
    ) => new Promise((resolve) => {
        window.scrollTo(0, 0);
        const {
            serverRequestEvent,
            linkedEvent,
            relationship,
            linkMode,
            formHasError,
        } = buildNewEventPayload(
            saveType,
            relatedStageRef,
        );

        if (formHasError) {
            resolve({ success: false });
            return;
        }

        const serverData = createServerData({
            serverRequestEvent: serverRequestEvent as any,
            linkedEvent: linkedEvent as any,
            relationship: relationship as any,
            enrollment,
        });

        dispatch(batchActions([
            requestSaveEvent({
                requestEvent: serverRequestEvent as any,
                linkedEvent: linkedEvent as any,
                relationship: relationship as any,
                serverData,
                linkMode,
                onSaveExternal,
                onSaveSuccessActionType: enrollment ? onSaveAndCompleteEnrollmentSuccessActionType : onSaveSuccessActionType,
                onSaveErrorActionType: enrollment ? onSaveAndCompleteEnrollmentErrorActionType : onSaveErrorActionType,
            }),

            setSaveEnrollmentEventInProgress({
                requestEventId: (serverRequestEvent as any)?.event,
                linkedEventId: (linkedEvent as any)?.event,
                linkedOrgUnitId: (linkedEvent as any)?.orgUnit,
                linkMode,
            }),
        ], newEventBatchActionTypes.REQUEST_SAVE_AND_SET_SUBMISSION_IN_PROGRESS),
        );

        resolve({ success: true });
    }), [buildNewEventPayload, dispatch, onSaveExternal, onSaveAndCompleteEnrollmentSuccessActionType, onSaveSuccessActionType, onSaveAndCompleteEnrollmentErrorActionType, onSaveErrorActionType]);

    const handleCreateNew = useCallback(async (isCreateNew?: boolean) => {
        const saveResult = await handleSave(itemId, dataEntryId, formFoundation, 'COMPLETE');
        if ((saveResult as any)?.success) {
            dispatch(startCreateNewAfterCompleting({
                enrollmentId,
                isCreateNew,
                orgUnitId: orgUnitContext?.id,
                programId: program.id,
                teiId,
                availableProgramStages,
            }));
        }
    }, [handleSave, formFoundation, dispatch, enrollmentId, orgUnitContext?.id, program.id, teiId, availableProgramStages]);


    const handleSaveAndCompleteEnrollment = useCallback(
        (
            dataEntryItemId: string,
            dataEntryIdArgument: string,
            formFoundationArgument: RenderFoundation,
            enrollment: Record<string, unknown>,
        ) => {
            handleSave(
                dataEntryItemId,
                dataEntryIdArgument,
                formFoundationArgument,
                'COMPLETE',
                enrollment,
            );
        },
        [handleSave],
    );

    useEffect(() => () => {
        dispatch(cleanUpEventSaveInProgress());
    }, [dispatch]);

    return (
        <ValidatedComponentWrapper
            {...passOnProps}
            stage={stage}
            allowGenerateNextVisit={stage.allowGenerateNextVisit}
            askCompleteEnrollmentOnEventComplete={stage.askCompleteEnrollmentOnEventComplete}
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
            onSaveAndCompleteEnrollment={handleSaveAndCompleteEnrollment}
            programName={program.name}
            rulesExecutionDependenciesClientFormatted={rulesExecutionDependenciesClientFormatted}
        />
    );
};

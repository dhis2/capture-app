import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { withAskToCompleteEnrollment } from '../../DataEntries';
import { withAskToCreateNew, withSaveHandler } from '../../DataEntry';
import { useLifecycle } from './useLifecycle';
import { useClientFormattedRulesExecutionDependencies } from './useClientFormattedRulesExecutionDependencies';
import { ValidatedComponent } from './Validated.component';
import {
    handleSaveButton,
    cleanUpEventSaveInProgress,
    startCreateNewAfterCompleting,
} from './validated.actions';
import type { ContainerProps } from './validated.types';
import type { RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { useAvailableProgramStages } from '../../../hooks';
import type { RelatedStageRefPayload } from '../../WidgetRelatedStages';

const SaveHandlerHOC = withSaveHandler()(ValidatedComponent);
const AskToCreateNewHandlerHOC = withAskToCreateNew()(SaveHandlerHOC);
const ValidatedComponentWrapper = withAskToCompleteEnrollment()(AskToCreateNewHandlerHOC) as any;

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

    const dispatch = useDispatch();

    const availableProgramStages = useAvailableProgramStages(stage, teiId, enrollmentId, program.id);

    const { fromClientDate } = useTimeZoneConversion();

    const buildPayloadArgs = useMemo(() => ({
        dataEntryId,
        itemId,
        programId: program.id,
        teiId,
        enrollmentId,
        formFoundation,
        fromClientDate,
    }), [dataEntryId, itemId, program.id, teiId, enrollmentId, formFoundation, fromClientDate]);

    const handleSave = useCallback((
        dataEntryItemId: string,
        dataEntryIdArgument: string,
        formFoundationArgument: RenderFoundation,
        saveType?: typeof addEventSaveTypes[keyof typeof addEventSaveTypes],
        enrollment?: Record<string, unknown>,
    ) => {
        window.scrollTo(0, 0);
        dispatch(handleSaveButton({
            saveType,
            enrollment,
            buildPayloadArgs,
            relatedStageRef,
            onSaveExternal,
            onSaveSuccessActionType: enrollment ? onSaveAndCompleteEnrollmentSuccessActionType : onSaveSuccessActionType,
            onSaveErrorActionType: enrollment ? onSaveAndCompleteEnrollmentErrorActionType : onSaveErrorActionType,
        }));
    }, [
        dispatch,
        buildPayloadArgs,
        relatedStageRef,
        onSaveExternal,
        onSaveAndCompleteEnrollmentSuccessActionType,
        onSaveSuccessActionType,
        onSaveAndCompleteEnrollmentErrorActionType,
        onSaveErrorActionType,
    ]);

    const handleCreateNew = useCallback(async (isCreateNew?: boolean) => {
        window.scrollTo(0, 0);
        dispatch(handleSaveButton({
            saveType: addEventSaveTypes.COMPLETE,
            buildPayloadArgs,
            relatedStageRef,
            onSaveExternal,
            onSaveSuccessActionType,
            onSaveErrorActionType,
            onSaveSuccessAction: startCreateNewAfterCompleting({
                isCreateNew,
                orgUnitId: orgUnitContext?.id,
                enrollmentId: buildPayloadArgs.enrollmentId,
                programId: buildPayloadArgs.programId,
                teiId: buildPayloadArgs.teiId,
                availableProgramStages,
            }),
        }));
    }, [
        dispatch,
        buildPayloadArgs,
        relatedStageRef,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        orgUnitContext?.id,
        availableProgramStages,
    ]);
    const cancelCreateNew = useCallback(() => { handleCreateNew(false); }, [handleCreateNew]);
    const confirmCreateNew = useCallback(() => { handleCreateNew(true); }, [handleCreateNew]);

    const handleSaveAndCompleteEnrollment = useCallback(
        (enrollment: Record<string, unknown>) => {
            window.scrollTo(0, 0);
            dispatch(handleSaveButton({
                saveType: addEventSaveTypes.COMPLETE,
                enrollment,
                buildPayloadArgs,
                relatedStageRef,
                onSaveSuccessActionType: onSaveAndCompleteEnrollmentSuccessActionType,
                onSaveErrorActionType: onSaveAndCompleteEnrollmentErrorActionType,
            }));
        },
        [
            dispatch,
            buildPayloadArgs,
            relatedStageRef,
            onSaveAndCompleteEnrollmentSuccessActionType,
            onSaveAndCompleteEnrollmentErrorActionType,
        ],
    );

    // Clean up data entry on unmount in case the user navigates away, stopping delayed navigation
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
            onCancelCreateNew={cancelCreateNew}
            onConfirmCreateNew={confirmCreateNew}
            programId={program.id}
            onSaveAndCompleteEnrollment={handleSaveAndCompleteEnrollment}
            programName={program.name}
            rulesExecutionDependenciesClientFormatted={rulesExecutionDependenciesClientFormatted}
        />
    );
};

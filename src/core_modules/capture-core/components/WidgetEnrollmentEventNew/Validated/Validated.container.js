// @flow
import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { withAskToCreateNew, withSaveHandler } from '../../DataEntry';
import { useLifecycle } from './useLifecycle';
import { useClientFormattedRulesExecutionDependencies } from './useClientFormattedRulesExecutionDependencies';
import { ValidatedComponent } from './Validated.component';
import { requestSaveEvent, startCreateNewAfterCompleting } from './validated.actions';
import type { ContainerProps } from './validated.types';
import type { RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { useAvailableProgramStages } from '../../../hooks';
import { generateUID } from '../../../utils/uid/generateUID';
import { getConvertedReferralEvent } from './getConvertedReferralEvent';

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
    const referralRef = useRef();

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
        const clientRequestEvent = {
            dataEntryItemId,
            eventId: generateUID(),
            dataEntryId: dataEntryIdArgument,
            formFoundation: formFoundationArgument,
            programId: program.id,
            orgUnitId: orgUnit.id,
            orgUnitName: orgUnit.name || '',
            teiId,
            enrollmentId,
            onSaveExternal,
        };

        if (
            referralRef.current
            && saveType === addEventSaveTypes.COMPLETE
            && referralRef.current.eventHasReferralRelationship()
        ) {
            const isValid = referralRef.current.formIsValidOnSave();

            if (isValid) {
                const { referralValues, referralType } = referralRef.current
                    .getReferralValues(clientRequestEvent.eventId);

                const { referralEvent, relationship } = getConvertedReferralEvent({
                    referralDataValues: referralValues,
                    currentEventId: clientRequestEvent.eventId,
                    referralType,
                    programId: program.id,
                    currentProgramStageId: stage.id,
                    teiId,
                    enrollmentId,
                });

                dispatch(requestSaveEvent({
                    requestEvent: {
                        completed: true,
                        ...clientRequestEvent,
                    },
                    referralEvent,
                    relationship,
                    onSaveSuccessActionType,
                    onSaveErrorActionType,
                }));
            }
            return;
        }

        window.scrollTo(0, 0);
        const completed = saveType === addEventSaveTypes.COMPLETE;
        dispatch(requestSaveEvent({
            requestEvent: { completed, ...clientRequestEvent },
            onSaveSuccessActionType,
            onSaveErrorActionType,
        }));
    }, [
        program,
        orgUnit,
        teiId,
        enrollmentId,
        onSaveExternal,
        dispatch,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        stage.id,
    ]);

    const handleCreateNew = useCallback((isCreateNew?: boolean) => {
        handleSave(itemId, dataEntryId, formFoundation, addEventSaveTypes.COMPLETE);

        dispatch(startCreateNewAfterCompleting({
            enrollmentId, isCreateNew, orgUnitId: orgUnit.id, programId: program.id, teiId, availableProgramStages,
        }));
    }, [handleSave, formFoundation, dispatch, enrollmentId, orgUnit.id, program.id, teiId, availableProgramStages]);

    return (
        <AskToCreateNewHandlerHOC
            {...passOnProps}
            stage={stage}
            allowGenerateNextVisit={stage.allowGenerateNextVisit}
            availableProgramStages={availableProgramStages}
            ready={ready}
            id={dataEntryId}
            itemId={itemId}
            formFoundation={formFoundation}
            referralRef={referralRef}
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

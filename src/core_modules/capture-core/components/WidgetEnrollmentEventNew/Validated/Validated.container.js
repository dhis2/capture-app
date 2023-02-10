// @flow
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withAskToCreateNew, withSaveHandler } from '../../DataEntry';
import { useLifecycle } from './useLifecycle';
import { useClientFormattedRulesExecutionDependencies } from './useClientFormattedRulesExecutionDependencies';
import { ValidatedComponent } from './Validated.component';
import { requestSaveEvent, startCreateNewAfterCompleting } from './validated.actions';
import type { ContainerProps, ReferralDataValueStates } from './validated.types';
import type { RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { useAvailableProgramStages } from '../../../hooks';
import { actions as ReferralModes } from '../../WidgetReferral/constants';
import { getConvertedReferralEvent } from './getConvertedReferralEvent';
import { generateUID } from '../../../utils/uid/generateUID';

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
    const [selectedReferralType, setSelectedReferralType] = useState(null);
    const [referralDataValues, setReferralDataValues] = useState<ReferralDataValueStates>({
        referralMode: ReferralModes.REFER_ORG,
        scheduledAt: '',
        orgUnit: undefined,
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
        const requestEvent = {
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

        if (saveType === addEventSaveTypes.COMPLETE && selectedReferralType) {
            const { referralEvent, relationship, isValid } = getConvertedReferralEvent({
                referralDataValues,
                programId: program.id,
                teiId,
                enrollmentId,
                currentProgramStageId: stage.id,
                currentEventId: requestEvent.eventId,
                referralType: selectedReferralType,
            });

            if (isValid) {
                dispatch(requestSaveEvent({
                    requestEvent: {
                        completed: true,
                        ...requestEvent,
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
            requestEvent: { completed, ...requestEvent },
            onSaveSuccessActionType,
            onSaveErrorActionType,
        }));
    }, [
        program.id,
        orgUnit,
        teiId,
        enrollmentId,
        onSaveExternal,
        dispatch,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        referralDataValues,
        stage.id,
        selectedReferralType,
    ]);

    const handleCreateNew = useCallback((isCreateNew?: boolean) => {
        dispatch(requestSaveEvent({
            requestEvent: {
                eventId: generateUID(),
                dataEntryItemId: itemId,
                dataEntryId,
                formFoundation,
                completed: true,
                programId: program.id,
                orgUnitId: orgUnit.id,
                orgUnitName: orgUnit.name || '',
                teiId,
                enrollmentId,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            },
        }));
        dispatch(startCreateNewAfterCompleting({
            enrollmentId, isCreateNew, orgUnitId: orgUnit.id, programId: program.id, teiId, availableProgramStages,
        }));
    }, [dispatch,
        program.id,
        orgUnit,
        teiId,
        enrollmentId,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        formFoundation,
        availableProgramStages,
    ]);


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
            onSave={handleSave}
            referralDataValues={referralDataValues}
            setReferralDataValues={setReferralDataValues}
            setSelectedReferralType={setSelectedReferralType}
            onCancelCreateNew={() => handleCreateNew()}
            onConfirmCreateNew={() => handleCreateNew(true)}
            programName={program.name}
            orgUnit={orgUnit}
            rulesExecutionDependenciesClientFormatted={rulesExecutionDependenciesClientFormatted}
        />
    );
};

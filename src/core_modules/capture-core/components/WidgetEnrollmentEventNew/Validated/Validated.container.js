// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { withAskToCompleteEnrollment } from '../../DataEntries';
import { withAskToCreateNew, withSaveHandler } from '../../DataEntry';
import { useLifecycle } from './useLifecycle';
import { useClientFormattedRulesExecutionDependencies } from './useClientFormattedRulesExecutionDependencies';
import { ValidatedComponent } from './Validated.component';
import { requestSaveEvent, startCreateNewAfterCompleting, requestSaveAndCompleteEnrollment } from './validated.actions';
import type { ContainerProps } from './validated.types';
import type { RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';
import { useAvailableProgramStages } from '../../../hooks';

const SaveHandlerHOC = withSaveHandler()(ValidatedComponent);
const AskToCreateNewHandlerHOC = withAskToCreateNew()(SaveHandlerHOC);
const DataEntry = withAskToCompleteEnrollment()(AskToCreateNewHandlerHOC);

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
    onSaveAndCompleteEnrollmentExternal,
    onSaveAndCompleteEnrollmentSuccessActionType,
    onSaveAndCompleteEnrollmentErrorActionType,
    ...passOnProps
}: ContainerProps) => {
    const dataEntryId = 'enrollmentEvent';
    const itemId = 'newEvent';
    const { fromClientDate } = useTimeZoneConversion();

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
        eventId: string,
        dataEntryIdArgument: string,
        formFoundationArgument: RenderFoundation,
        saveType?: ?string,
    ) => {
        window.scrollTo(0, 0);
        const completed = saveType === addEventSaveTypes.COMPLETE;
        dispatch(requestSaveEvent({
            eventId,
            dataEntryId: dataEntryIdArgument,
            formFoundation: formFoundationArgument,
            completed,
            programId: program.id,
            orgUnitId: orgUnit.id,
            orgUnitName: orgUnit.name || '',
            teiId,
            enrollmentId,
            fromClientDate,
            onSaveExternal,
            onSaveSuccessActionType,
            onSaveErrorActionType,
        }));
    }, [
        dispatch,
        program.id,
        orgUnit,
        teiId,
        enrollmentId,
        fromClientDate,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    ]);

    const handleCreateNew = useCallback((isCreateNew?: boolean) => {
        dispatch(requestSaveEvent({
            eventId: itemId,
            dataEntryId,
            formFoundation,
            completed: true,
            programId: program.id,
            orgUnitId: orgUnit.id,
            orgUnitName: orgUnit.name || '',
            teiId,
            enrollmentId,
            fromClientDate,
            onSaveExternal,
            onSaveSuccessActionType,
            onSaveErrorActionType,
        }));
        dispatch(startCreateNewAfterCompleting({
            enrollmentId, isCreateNew, orgUnitId: orgUnit.id, programId: program.id, teiId, availableProgramStages,
        }));
    }, [dispatch,
        program.id,
        orgUnit,
        teiId,
        enrollmentId,
        fromClientDate,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        formFoundation,
        availableProgramStages,
    ]);

    const handleSaveAndCompleteEnrollment = useCallback(
        (
            eventId: string,
            dataEntryIdArgument: string,
            formFoundationArgument: RenderFoundation,
            enrollment: string,
        ) => {
            dispatch(requestSaveAndCompleteEnrollment({
                eventId,
                dataEntryId: dataEntryIdArgument,
                formFoundation: formFoundationArgument,
                completed: true,
                programId: program.id,
                orgUnitId: orgUnit.id,
                orgUnitName: orgUnit.name || '',
                teiId,
                enrollmentId,
                enrollment,
                fromClientDate,
                onSaveAndCompleteEnrollmentExternal,
                onSaveAndCompleteEnrollmentSuccessActionType,
                onSaveAndCompleteEnrollmentErrorActionType,
            }));
        },
        [
            dispatch,
            program.id,
            orgUnit,
            teiId,
            enrollmentId,
            fromClientDate,
            onSaveAndCompleteEnrollmentExternal,
            onSaveAndCompleteEnrollmentSuccessActionType,
            onSaveAndCompleteEnrollmentErrorActionType,
        ],
    );

    return (
        <DataEntry
            {...passOnProps}
            stage={stage}
            allowGenerateNextVisit={stage.allowGenerateNextVisit}
            askCompleteEnrollmentOnEventComplete={stage.askCompleteEnrollmentOnEventComplete}
            availableProgramStages={availableProgramStages}
            ready={ready}
            id={dataEntryId}
            itemId={itemId}
            formFoundation={formFoundation}
            onSave={handleSave}
            onCancelCreateNew={() => handleCreateNew()}
            onConfirmCreateNew={() => handleCreateNew(true)}
            onSaveAndCompleteEnrollment={handleSaveAndCompleteEnrollment}
            programName={program.name}
            orgUnit={orgUnit}
            rulesExecutionDependenciesClientFormatted={rulesExecutionDependenciesClientFormatted}
        />
    );
};

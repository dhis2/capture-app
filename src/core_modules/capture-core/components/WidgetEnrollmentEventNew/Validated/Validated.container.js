// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withSaveHandler } from '../../DataEntry';
import { useLifecycle } from './useLifecycle';
import { useClientFormattedRulesExecutionDependencies } from './useClientFormattedRulesExecutionDependencies';
import { ValidatedComponent } from './Validated.component';
import { requestSaveEvent } from './validated.actions';
import type { ContainerProps } from './validated.types';
import type { RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';

const SaveHandlerHOC = withSaveHandler()(ValidatedComponent);
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
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    ]);

    return (
        <SaveHandlerHOC
            {...passOnProps}
            stage={stage}
            ready={ready}
            id={dataEntryId}
            itemId={itemId}
            formFoundation={formFoundation}
            onSave={handleSave}
            programName={program.name}
            orgUnit={orgUnit}
            rulesExecutionDependenciesClientFormatted={rulesExecutionDependenciesClientFormatted}
        />
    );
};

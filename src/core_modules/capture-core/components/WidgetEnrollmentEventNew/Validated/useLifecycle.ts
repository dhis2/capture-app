import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getOpenDataEntryActions } from '../DataEntry';
import type { TrackerProgram, ProgramStage, RenderFoundation } from '../../../metaData';
import type { RulesExecutionDependenciesClientFormatted } from '../common.types';
import { newEventBatchActionTypes, initialRuleExecution } from './validated.actions';
import { useCategoryCombinations } from '../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';

export const useLifecycle = ({
    program,
    stage,
    formFoundation,
    orgUnitContext,
    dataEntryId,
    itemId,
    rulesExecutionDependenciesClientFormatted: {
        events: eventsRulesDependency,
        attributeValues: attributesValuesRulesDependency,
        enrollmentData: enrollmentDataRulesDependency,
    },
}: {
    program: TrackerProgram;
    stage: ProgramStage;
    formFoundation: RenderFoundation;
    orgUnitContext?: OrgUnit;
    dataEntryId: string;
    itemId: string;
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted;
}) => {
    const dispatch = useDispatch();
    const dataEntryReadyRef = useRef(false);
    const { programCategory, isLoading } = useCategoryCombinations(program.id);

    useEffect(() => {
        if (!isLoading && !dataEntryReadyRef.current) {
            dataEntryReadyRef.current = true;
            dispatch(batchActions([
                ...getOpenDataEntryActions(dataEntryId, itemId, programCategory, orgUnitContext),
                initialRuleExecution({
                    programId: program.id,
                    stage,
                    formFoundation,
                    dataEntryId,
                    itemId,
                    orgUnit: orgUnitContext,
                    eventsRulesDependency,
                    attributesValuesRulesDependency,
                    enrollmentDataRulesDependency,
                }),
            ], newEventBatchActionTypes.INITIALIZE_REGISTER_ENROLLMENT_PAGE));
        }
    }, [
        dispatch,
        dataEntryId,
        itemId,
        program,
        stage,
        formFoundation,
        isLoading,
        programCategory,
        orgUnitContext,
        eventsRulesDependency,
        attributesValuesRulesDependency,
        enrollmentDataRulesDependency,
    ]);

    return dataEntryReadyRef.current;
};

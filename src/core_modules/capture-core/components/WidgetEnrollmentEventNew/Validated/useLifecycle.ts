import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getOpenDataEntryActions, getRulesActions } from '../DataEntry';
import type { TrackerProgram, ProgramStage, RenderFoundation } from '../../../metaData';
import type { RulesExecutionDependenciesClientFormatted } from '../common.types';
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
    const [rulesExecutionTrigger, setRulesExecutionTrigger] = useState(1);

    const dataEntryReadyRef = useRef(false);
    const delayRulesExecutionRef = useRef(false);
    const { programCategory, isLoading } = useCategoryCombinations(program.id);

    useEffect(() => {
        if (!isLoading) {
            dispatch(batchActions([
                ...getOpenDataEntryActions(dataEntryId, itemId, programCategory, orgUnitContext),
            ]));
            dataEntryReadyRef.current = true;
            delayRulesExecutionRef.current = true;
        }
    }, [dispatch, dataEntryId, itemId, program, formFoundation, isLoading, programCategory, orgUnitContext]);

    const eventsRef = useRef<any>(undefined);
    const attributesRef = useRef<any>(undefined);
    const enrollmentDataRef = useRef<any>(undefined);


    const state = useSelector(stateArg => stateArg);
    useEffect(() => {
        if (isLoading) { return; }
        if (delayRulesExecutionRef.current) {
            // getRulesActions depends on settings in the redux store that are being managed through getOpenDataEntryActions.

            delayRulesExecutionRef.current = false;
            setRulesExecutionTrigger(-rulesExecutionTrigger);
        } else {
            dispatch(batchActions([
                getRulesActions({
                    state,
                    program,
                    stage,
                    formFoundation,
                    dataEntryId,
                    itemId,
                    orgUnit: orgUnitContext,
                    eventsRulesDependency,
                    attributesValuesRulesDependency,
                    enrollmentDataRulesDependency,
                }),
            ]));
            eventsRef.current = eventsRulesDependency;
            attributesRef.current = attributesValuesRulesDependency;
            enrollmentDataRef.current = enrollmentDataRulesDependency;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,

        orgUnitContext,
        eventsRulesDependency,
        attributesValuesRulesDependency,
        program,
        stage,
        dataEntryId,
        itemId,
        rulesExecutionTrigger,
        isLoading,
    ]);

    const rulesReady =
        eventsRef.current === eventsRulesDependency &&
        attributesRef.current === attributesValuesRulesDependency &&
        enrollmentDataRef.current === enrollmentDataRulesDependency;

    return dataEntryReadyRef.current && rulesReady;
};

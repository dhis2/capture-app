// @flow
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
    orgUnit,
    dataEntryId,
    itemId,
    rulesExecutionDependenciesClientFormatted: {
        events: eventsRulesDependency,
        attributeValues: attributesValuesRulesDependency,
        enrollmentData: enrollmentDataRulesDependency,
    },
}: {
    program: TrackerProgram,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    dataEntryId: string,
    itemId: string,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
}) => {
    const dispatch = useDispatch();
    const [rulesExecutionTrigger, setRulesExecutionTrigger] = useState(1);

    const dataEntryReadyRef = useRef(false);
    const delayRulesExecutionRef = useRef(false);
    const { programCategory, isLoading } = useCategoryCombinations(program.id);

    useEffect(() => {
        if (!isLoading) {
            dispatch(batchActions([
                ...getOpenDataEntryActions(dataEntryId, itemId, programCategory),
            ]));
            dataEntryReadyRef.current = true;
            delayRulesExecutionRef.current = true;
        }
    }, [dispatch, dataEntryId, itemId, program, formFoundation, isLoading, programCategory]);

    const eventsRef = useRef();
    const attributesRef = useRef();
    const enrollmentDataRef = useRef();

    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);
    useEffect(() => {
        if (isLoading) { return; }
        if (delayRulesExecutionRef.current) {
            // getRulesActions depends on settings in the redux store that are being managed through getOpenDataEntryActions.
            // The purpose of the following lines of code is to make sure the redux store is ready before calling getRulesActions.
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
                    orgUnit,
                    eventsRulesDependency,
                    attributesValuesRulesDependency,
                    enrollmentDataRulesDependency,
                }),
            ]));
            eventsRef.current = eventsRulesDependency;
            attributesRef.current = attributesValuesRulesDependency;
            enrollmentDataRef.current = enrollmentDataRulesDependency;
        }
    // Ignoring state (due to various reasons, bottom line being that field updates are handled in epic)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,
        orgUnit,
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

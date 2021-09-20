// @flow
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { getOpenDataEntryActions, getRulesActions } from '../DataEntry';
import type { TrackerProgram, RenderFoundation } from '../../../metaData';
import type { OrgUnit, RulesExecutionDependenciesClientFormatted } from '../common.types';

export const useLifecycle = ({
    program,
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
    formFoundation: RenderFoundation,
    orgUnit?: OrgUnit,
    dataEntryId: string,
    itemId: string,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
}) => {
    const dispatch = useDispatch();

    const dataEntryReadyRef = useRef(false);
    useEffect(() => {
        dispatch(batchActions([
            ...getOpenDataEntryActions(dataEntryId, itemId),
        ]));
        dataEntryReadyRef.current = true;
    }, [dispatch, dataEntryId, itemId, program, formFoundation]);

    const eventsRef = useRef();
    const attributesRef = useRef();
    const orgUnitRef = useRef();
    const enrollmentDataRef = useRef();

    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);
    useEffect(() => {
        if (orgUnit) {
            dispatch(batchActions([
                ...getRulesActions({
                    state,
                    program,
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
            orgUnitRef.current = orgUnit;
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
        formFoundation,
        dataEntryId,
        itemId,
    ]);

    const rulesReady =
        eventsRef.current === eventsRulesDependency &&
        attributesRef.current === attributesValuesRulesDependency &&
        enrollmentDataRef.current === enrollmentDataRulesDependency &&
        orgUnit &&
        orgUnitRef.current === orgUnit;

    return dataEntryReadyRef.current && rulesReady;
};

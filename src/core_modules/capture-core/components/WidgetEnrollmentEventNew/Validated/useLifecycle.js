// @flow
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOrgUnitGroups } from 'capture-core/hooks/useOrgUnitGroups';
import { batchActions } from 'redux-batched-actions';
import type { OrgUnit as EngineOrgUnit } from 'capture-core-utils/rulesEngine';
import { getOpenDataEntryActions, getRulesActions } from '../DataEntry';
import type { TrackerProgram, ProgramStage, RenderFoundation } from '../../../metaData';
import type { OrgUnit, RulesExecutionDependenciesClientFormatted } from '../common.types';

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

    const orgUnitGroups = useOrgUnitGroups(orgUnit ? orgUnit.id : null);

    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);
    useEffect(() => {
        if (orgUnit && orgUnitGroups) {
            const engineFormattedOrgUnit: EngineOrgUnit = {
                id: orgUnit.id,
                name: orgUnit.name,
                groups: orgUnitGroups,
            };
            dispatch(batchActions([
                getRulesActions({
                    state,
                    program,
                    stage,
                    formFoundation,
                    dataEntryId,
                    itemId,
                    orgUnit: engineFormattedOrgUnit,
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
        orgUnitGroups,
        eventsRulesDependency,
        attributesValuesRulesDependency,
        program,
        stage,
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

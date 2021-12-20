// @flow
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { OrgUnit, TrackedEntityAttributes, OptionSets, ProgramRulesContainer } from 'capture-core-utils/rulesEngine';
import { useProgramRules, useConstants } from './index';
import { getOpenDataEntryActions } from '../dataEntry.actions';
import { buildRulesContainer } from '../ProgramRules';
import {
    buildFormFoundation,
    buildFormValues,
    processProgramTrackedEntityAttributes,
    processOptionSets,
} from '../FormFoundation';

export const useLifecycle = ({
    programAPI,
    orgUnitId,
    trackedEntityInstanceAttributes,
    dataEntryId,
    itemId,
    toggleEditModal,
}: {
    programAPI: any,
    orgUnitId: string,
    trackedEntityInstanceAttributes: Array<any>,
    dataEntryId: string,
    itemId: string,
    toggleEditModal: boolean,
}) => {
    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);

    const { programRules, loading: loadingProgramRules } = useProgramRules(programAPI.id);
    const { constants } = useConstants();
    const dispatch = useDispatch();
    const [rulesContainer, setRulesContainer] = useState<ProgramRulesContainer>({});
    const [formFoundation, setFormFoundation] = useState<any>({});
    const [formValues, setFormValues] = useState<any>({});

    const trackedEntityName: string = useMemo(() => programAPI?.trackedEntityType?.displayName || '', [programAPI]);
    const orgUnit: OrgUnit = useMemo(() => ({ id: orgUnitId, name: '' }), [orgUnitId]);
    const programTrackedEntityAttributes: TrackedEntityAttributes = useMemo(() => processProgramTrackedEntityAttributes(programAPI), [programAPI]);
    const optionSets: OptionSets = useMemo(() => processOptionSets(programTrackedEntityAttributes), [programTrackedEntityAttributes]);

    useEffect(() => {
        if (toggleEditModal && !loadingProgramRules && constants) {
            buildFormFoundation(programAPI, setFormFoundation);
            buildRulesContainer({ programAPI, setRulesContainer, programRules, constants });
        }
    }, [programAPI, loadingProgramRules, programRules, constants, toggleEditModal]);

    useEffect(() => {
        if (toggleEditModal && Object.entries(formFoundation).length > 0) {
            Object.entries(formValues).length === 0 && buildFormValues(formFoundation, trackedEntityInstanceAttributes, setFormValues, { orgUnitCode: orgUnit.id });

            Object.entries(formValues).length > 0 && Object.entries(rulesContainer).length > 0 &&
                dispatch(
                    getOpenDataEntryActions({
                        orgUnit,
                        dataEntryId,
                        itemId,
                        foundation: formFoundation,
                        trackedEntityAttributes: programTrackedEntityAttributes,
                        optionSets,
                        rulesContainer,
                        formValues,
                    }),
                );
        }
    }, [dispatch, orgUnit, formFoundation, programTrackedEntityAttributes, trackedEntityInstanceAttributes, optionSets, rulesContainer, formValues, dataEntryId, itemId, toggleEditModal]);


    return {
        orgUnit,
        trackedEntityAttributes: programTrackedEntityAttributes,
        optionSets,
        rulesContainer,
        formFoundation,
        state,
        trackedEntityName,
    };
};

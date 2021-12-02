// @flow
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type {
    OrgUnit,
    TrackedEntityAttributes,
    OptionSets,
    ProgramRulesContainer,
} from 'capture-core-utils/rulesEngine';
import { useProgramRules, useConstants } from './index';
import { getOpenDataEntryActions } from '../actions';
import { buildRulesContainer } from '../ProgramRules';
import { buildFormFoundation } from '../FormFoundation';

export const useLifecycle = ({
    programAPI,
    orgUnitId,
    mergedAttributes,
    dataEntryId,
    itemId,
}: {
    programAPI: any,
    orgUnitId: string,
    mergedAttributes: Array<any>,
    dataEntryId: string,
    itemId: string,
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

    const orgUnit: OrgUnit = useMemo(() => ({ id: orgUnitId, name: '' }), [orgUnitId]);
    const trackedEntityAttributes: TrackedEntityAttributes = useMemo(
        () =>
            programAPI?.programTrackedEntityAttributes?.reduce(
                (acc, currentValue) => ({
                    ...acc,
                    [currentValue.trackedEntityAttribute.id]: currentValue.trackedEntityAttribute,
                }),
                {},
            ),
        [programAPI],
    );
    const optionSets: OptionSets = useMemo(
        () =>
            Object.values(trackedEntityAttributes)?.reduce(
                (acc, currentValue) =>
                    // $FlowFixMe[incompatible-type]
                    (currentValue.optionSet ? { ...acc, [currentValue.optionSet.id]: currentValue.optionSet } : acc),
                {},
            ),
        [trackedEntityAttributes],
    );
    const formValues = useMemo(
        () =>
            mergedAttributes.reduce(
                (acc, currentValue) => ({ ...acc, [currentValue.reactKey]: currentValue.value }),
                {},
            ),
        [mergedAttributes],
    );

    useEffect(() => {
        if (!loadingProgramRules && constants && Object.entries(formFoundation).length === 0) {
            buildFormFoundation(programAPI, setFormFoundation);
            buildRulesContainer({
                programAPI,
                setRulesContainer,
                programRules,
                constants,
            });
        }
    }, [programAPI, loadingProgramRules, programRules, formFoundation, constants]);

    useEffect(() => {
        if (
            rulesContainer &&
            Object.entries(rulesContainer).length > 0 &&
            formFoundation &&
            Object.entries(formFoundation).length > 0
        ) {
            dispatch(
                getOpenDataEntryActions({
                    orgUnit,
                    dataEntryId,
                    itemId,
                    foundation: formFoundation,
                    trackedEntityAttributes,
                    optionSets,
                    rulesContainer,
                    formValues,
                }),
            );
        }
    }, [
        dispatch,
        orgUnit,
        formFoundation,
        trackedEntityAttributes,
        optionSets,
        rulesContainer,
        formValues,
        dataEntryId,
        itemId,
    ]);

    return {
        orgUnit,
        trackedEntityAttributes,
        optionSets,
        rulesContainer,
        formFoundation,
        state,
    };
};

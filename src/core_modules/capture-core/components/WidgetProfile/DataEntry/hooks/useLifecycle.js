// @flow
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOrganisationUnit } from 'capture-core/dataQueries/useOrganisationUnit';
import type { OrgUnit, TrackedEntityAttributes, OptionSets, ProgramRulesContainer, DataElements } from 'capture-core-utils/rulesEngine';
import { cleanUpDataEntry } from '../../../DataEntry';
import { RenderFoundation } from '../../../../metaData';
import { getOpenDataEntryActions, cleanTeiModal } from '../dataEntry.actions';
import {
    useFormFoundation,
    useRulesContainer,
    useFormValues,
    useEvents,
    useDataElements,
    useOptionSets,
    useProgramTrackedEntityAttributes,
} from './index';
import { getRulesActionsForTEI } from '../ProgramRules';

export const useLifecycle = ({
    programAPI,
    orgUnitId,
    clientAttributesWithSubvalues,
    dataEntryId,
    itemId,
}: {
    programAPI: any,
    orgUnitId: string,
    clientAttributesWithSubvalues: Array<any>,
    dataEntryId: string,
    itemId: string,
}) => {
    const dispatch = useDispatch();
    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);
    const enrollment = useSelector(({ enrollmentDomain }) => enrollmentDomain?.enrollment);
    const dataElements: DataElements = useDataElements(programAPI);
    const otherEvents = useEvents(enrollment, programAPI);
    const orgUnit: ?OrgUnit = useOrganisationUnit(orgUnitId).orgUnit;
    const rulesContainer: ProgramRulesContainer = useRulesContainer(programAPI);
    const formFoundation: RenderFoundation = useFormFoundation(programAPI);
    const { formValues, clientValues } = useFormValues({ formFoundation, clientAttributesWithSubvalues, orgUnit });
    const programTrackedEntityAttributes: TrackedEntityAttributes = useProgramTrackedEntityAttributes(programAPI);
    const optionSets: OptionSets = useOptionSets(programTrackedEntityAttributes, dataElements);
    const trackedEntityName: string = useMemo(() => programAPI?.trackedEntityType?.displayName || '', [programAPI]);

    useEffect(() => {
        if (Object.entries(formValues).length > 0) {
            dispatch(
                getOpenDataEntryActions({
                    dataEntryId,
                    itemId,
                    formValues,
                }),
            );
        }
        return () => {
            dispatch(cleanUpDataEntry(dataEntryId));
            dispatch(cleanTeiModal());
        };
    }, [dispatch, formValues, dataEntryId, itemId]);

    useEffect(() => {
        if (
            orgUnit &&
            Object.entries(orgUnit).length > 0 &&
            Object.entries(formFoundation).length > 0 &&
            Object.entries(clientValues).length > 0 &&
            Object.entries(rulesContainer).length > 0
        ) {
            dispatch(
                ...getRulesActionsForTEI({
                    foundation: formFoundation,
                    formId: `${dataEntryId}-${itemId}`,
                    orgUnit,
                    trackedEntityAttributes: programTrackedEntityAttributes,
                    teiValues: clientValues,
                    optionSets,
                    rulesContainer,
                    otherEvents,
                    dataElements,
                    enrollmentData: enrollment,
                }),
            );
        }
    }, [
        dispatch,
        orgUnit,
        formFoundation,
        programTrackedEntityAttributes,
        clientAttributesWithSubvalues,
        optionSets,
        rulesContainer,
        clientValues,
        dataEntryId,
        itemId,
        otherEvents,
        dataElements,
        enrollment,
    ]);

    return {
        orgUnit,
        trackedEntityAttributes: programTrackedEntityAttributes,
        optionSets,
        rulesContainer,
        formFoundation,
        state,
        trackedEntityName,
        otherEvents,
        dataElements,
        enrollment,
    };
};

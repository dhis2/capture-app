// @flow
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOrganisationUnit } from 'capture-core/dataQueries/useOrganisationUnit';
import type {
    OrgUnit,
    TrackedEntityAttributes,
    OptionSets,
    ProgramRulesContainer,
    DataElements,
} from '@dhis2/rules-engine-javascript';
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
    useGeometryValues,
} from './index';
import type { Geometry } from '../helpers/types';
import { getRulesActionsForTEI } from '../ProgramRules';
import type { DataEntryFormConfig } from '../../../DataEntries/common/TEIAndEnrollment';

export const useLifecycle = ({
    programAPI,
    orgUnitId,
    clientAttributesWithSubvalues,
    userRoles,
    dataEntryId,
    itemId,
    geometry,
    dataEntryFormConfig,
}: {
    programAPI: any,
    orgUnitId: string,
    clientAttributesWithSubvalues: Array<any>,
    userRoles: Array<string>,
    dataEntryId: string,
    itemId: string,
    geometry: ?Geometry,
    dataEntryFormConfig: ?DataEntryFormConfig,
}) => {
    const dispatch = useDispatch();
    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);
    const enrollment = useSelector(({ enrollmentDomain }) => enrollmentDomain?.enrollment);
    const dataElements: DataElements = useDataElements(programAPI);
    const otherEvents = useEvents(enrollment, dataElements);
    const orgUnit: ?OrgUnit = useOrganisationUnit(orgUnitId).orgUnit;
    const rulesContainer: ProgramRulesContainer = useRulesContainer(programAPI);
    const formFoundation: RenderFoundation = useFormFoundation(programAPI, dataEntryFormConfig);
    const { formValues, clientValues } = useFormValues({ formFoundation, clientAttributesWithSubvalues, orgUnit });
    const { formGeometryValues, clientGeometryValues } = useGeometryValues({
        geometry,
        featureType: programAPI.trackedEntityType.featureType,
    });
    const programTrackedEntityAttributes: TrackedEntityAttributes = useProgramTrackedEntityAttributes(programAPI);
    const optionSets: OptionSets = useOptionSets(programTrackedEntityAttributes, dataElements);

    useEffect(() => {
        if (Object.entries(formValues).length > 0) {
            dispatch(
                getOpenDataEntryActions({
                    dataEntryId,
                    itemId,
                    formValues: { ...formValues, ...formGeometryValues },
                }),
            );
        }
        return () => {
            dispatch(cleanUpDataEntry(dataEntryId));
            dispatch(cleanTeiModal());
        };
    }, [dispatch, formValues, formGeometryValues, dataEntryId, itemId]);

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
                    teiValues: { ...clientValues, ...clientGeometryValues },
                    optionSets,
                    rulesContainer,
                    otherEvents,
                    dataElements,
                    enrollmentData: enrollment,
                    userRoles,
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
        clientGeometryValues,
        userRoles,
    ]);

    return {
        orgUnit,
        trackedEntityAttributes: programTrackedEntityAttributes,
        optionSets,
        rulesContainer,
        formFoundation,
        state,
        otherEvents,
        dataElements,
        enrollment,
        userRoles,
    };
};

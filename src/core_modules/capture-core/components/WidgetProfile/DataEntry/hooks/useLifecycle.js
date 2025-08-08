// @flow
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCoreOrgUnit, type CoreOrgUnit } from 'capture-core/metadataRetrieval/coreOrgUnit';
import type {
    TrackedEntityAttributes,
    OptionSets,
    ProgramRulesContainer,
    DataElements,
} from '../../../../rules/RuleEngine';
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
import { getRulesActionsForTEIAsync } from '../ProgramRules';
import type { DataEntryFormConfig } from '../../../DataEntries/common/TEIAndEnrollment';
import type { EnrollmentData } from '../Types';
import type { QuerySingleResource } from '../../../../utils/api';

export const useLifecycle = ({
    programAPI,
    orgUnitId,
    clientAttributesWithSubvalues,
    userRoles,
    dataEntryId,
    itemId,
    geometry,
    dataEntryFormConfig,
    querySingleResource,
    onGetValidationContext,
}: {
    programAPI: any,
    orgUnitId: string,
    clientAttributesWithSubvalues: Array<any>,
    userRoles: Array<string>,
    dataEntryId: string,
    itemId: string,
    geometry: ?Geometry,
    dataEntryFormConfig: ?DataEntryFormConfig,
    querySingleResource: QuerySingleResource,
    onGetValidationContext: () => Object,
}) => {
    const dispatch = useDispatch();
    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);
    const enrollment: EnrollmentData = useSelector(({ enrollmentDomain }) => enrollmentDomain?.enrollment);
    const dataElements: DataElements = useDataElements(programAPI);
    const otherEvents = useEvents(enrollment, dataElements);
    const orgUnit: ?CoreOrgUnit = useCoreOrgUnit(orgUnitId).orgUnit;
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

    const awaitingInitialRulesExecution = useRef(true);
    useEffect(() => {
        if (
            awaitingInitialRulesExecution.current &&
            orgUnit &&
            Object.entries(orgUnit).length > 0 &&
            Object.entries(formFoundation).length > 0 &&
            Object.entries(clientValues).length > 0 &&
            Object.entries(rulesContainer).length > 0
        ) {
            awaitingInitialRulesExecution.current = false;
            getRulesActionsForTEIAsync({
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
                programName: programAPI.displayName,
                querySingleResource,
                onGetValidationContext,
            }).then((action) => {
                dispatch(action);
            });
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
        programAPI,
        querySingleResource,
        onGetValidationContext,
        awaitingInitialRulesExecution,
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
        programName: programAPI.displayName,
    };
};

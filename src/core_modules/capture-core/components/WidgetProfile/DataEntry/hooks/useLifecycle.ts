import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCoreOrgUnit } from 'capture-core/metadataRetrieval/coreOrgUnit';
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
import { getRulesActionsForTEI } from '../ProgramRules';
import type { UseLifecycleParams } from './hooks.types';
import type { EnrollmentData } from '../Types/dataEntry.types';

export const useLifecycle = ({
    programAPI,
    orgUnitId,
    clientAttributesWithSubvalues,
    userRoles,
    dataEntryId,
    itemId,
    geometry,
    dataEntryFormConfig,
}: UseLifecycleParams) => {
    const dispatch = useDispatch();
    const state = useSelector((stateArg: any) => stateArg);
    const enrollment: EnrollmentData = useSelector(({ enrollmentDomain }: any) => enrollmentDomain?.enrollment);
    const dataElements: DataElements = useDataElements(programAPI);
    const otherEvents = useEvents(enrollment, dataElements);
    const orgUnit = useCoreOrgUnit(orgUnitId).orgUnit;
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
                getRulesActionsForTEI({
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
        programAPI,
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

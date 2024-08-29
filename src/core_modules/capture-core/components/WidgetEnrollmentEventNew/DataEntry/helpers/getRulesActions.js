// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getApplicableRuleEffectsForTrackerProgram,
    updateRulesEffects,
} from '../../../../rules';
import type { RenderFoundation, TrackerProgram, ProgramStage } from '../../../../metaData';
import type { EnrollmentEvents, AttributeValuesClientFormatted, EnrollmentData } from '../../common.types';
import { validateAssignEffects } from '../../../D2Form';
import type { QuerySingleResource } from '../../../../utils/api';

export const getRulesActions = async ({
    state, // temporary
    program,
    stage,
    formFoundation,
    dataEntryId,
    itemId,
    orgUnit,
    eventsRulesDependency,
    attributesValuesRulesDependency,
    enrollmentDataRulesDependency,
    querySingleResource,
}: {
    state: ReduxState,
    program: TrackerProgram,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    dataEntryId: string,
    itemId: string,
    orgUnit: OrgUnit,
    eventsRulesDependency: EnrollmentEvents,
    attributesValuesRulesDependency: AttributeValuesClientFormatted,
    enrollmentDataRulesDependency: EnrollmentData,
    querySingleResource: QuerySingleResource,
}) => {
    const formId = getDataEntryKey(dataEntryId, itemId);

    const formValuesClient = getCurrentClientValues(state, formFoundation, formId);
    const dataEntryValuesClient = getCurrentClientMainData(state, itemId, dataEntryId, formFoundation);
    const eventDataClient = { ...formValuesClient, ...dataEntryValuesClient, programStageId: formFoundation.id };

    const effects = getApplicableRuleEffectsForTrackerProgram({
        program,
        stage,
        orgUnit,
        currentEvent: eventDataClient,
        otherEvents: eventsRulesDependency,
        attributeValues: attributesValuesRulesDependency,
        enrollmentData: enrollmentDataRulesDependency,
    });

    const effectsWithValidations = await validateAssignEffects({
        dataElements: formFoundation.getElements(),
        effects,
        querySingleResource,
    });

    return updateRulesEffects(effectsWithValidations, formId);
};

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

export const getRulesActions = ({
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

    return updateRulesEffects(effects, formId);
};

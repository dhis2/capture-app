import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { RenderFoundation, TrackerProgram, ProgramStage } from '../../../../metaData';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getApplicableRuleEffectsForTrackerProgram,
    updateRulesEffects,
} from '../../../../rules';
import type { AttributeValuesClientFormatted, EnrollmentData } from '../../common.types';
import type { EventsData } from '../../../../rules/RuleEngine/types/ruleEngine.types';

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
    state: any;
    program: TrackerProgram;
    stage: ProgramStage;
    formFoundation: RenderFoundation;
    dataEntryId: string;
    itemId: string;
    orgUnit?: OrgUnit | null;
    eventsRulesDependency: EventsData;
    attributesValuesRulesDependency: AttributeValuesClientFormatted;
    enrollmentDataRulesDependency: EnrollmentData;
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

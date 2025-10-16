import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { ReduxState } from 'capture-core/components/App/withAppUrlSync.types';
import type { RenderFoundation, ProgramStage } from '../../../../metaData';
import { getTrackerProgramThrowIfNotFound } from '../../../../metaData';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getApplicableRuleEffectsForTrackerProgram,
    updateRulesEffects,
} from '../../../../rules';
import type { AttributeValuesClientFormatted, EnrollmentData } from '../../common.types';
import type { EventsData } from '../../../../rules/RuleEngine/types/ruleEngine.types';

export type GetRulesActionsMain = {
    programId: string,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    dataEntryId: string,
    itemId: string,
    orgUnit?: OrgUnit | null,
    eventsRulesDependency: EventsData,
    attributesValuesRulesDependency: AttributeValuesClientFormatted,
    enrollmentDataRulesDependency: EnrollmentData,
};

export const getRulesActions = async ({
    state,
    programId,
    stage,
    formFoundation,
    dataEntryId,
    itemId,
    orgUnit,
    eventsRulesDependency,
    attributesValuesRulesDependency,
    enrollmentDataRulesDependency,
}: { state: ReduxState } & GetRulesActionsMain) => {
    const formId = getDataEntryKey(dataEntryId, itemId);

    const formValuesClient = getCurrentClientValues(state, formFoundation, formId);
    const dataEntryValuesClient = getCurrentClientMainData(state, itemId, dataEntryId, formFoundation);
    const eventDataClient = { ...formValuesClient, ...dataEntryValuesClient, programStageId: formFoundation.id };

    const program = getTrackerProgramThrowIfNotFound(programId);
    const effects = await getApplicableRuleEffectsForTrackerProgram({
        program,
        stage,
        orgUnit,
        currentEvent: eventDataClient,
        otherEvents: eventsRulesDependency,
        attributeValues: attributesValuesRulesDependency,
        enrollmentData: enrollmentDataRulesDependency,
        executionEnvironment: 'NewEnrollmentEvent',
    });
    return updateRulesEffects(effects, formId);
};

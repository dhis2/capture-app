import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getApplicableRuleEffectsForEventProgram,
    updateRulesEffects,
} from '../../../../../../rules';
import type { RenderFoundation, EventProgram } from '../../../../../../metaData';
import { dataEntryId, itemId, formId } from './constants';

export const getRulesActions = async ({
    state,
    program,
    formFoundation,
    orgUnit,
}: {
    state: any,
    program: EventProgram,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit | null,
}) => {
    const formValuesClient = getCurrentClientValues(state, formFoundation, formId);
    const dataEntryValuesClient = getCurrentClientMainData(state, itemId, dataEntryId, formFoundation);
    const currentEvent = { ...formValuesClient, ...dataEntryValuesClient, programStageId: formFoundation.id };

    const effects = await getApplicableRuleEffectsForEventProgram({
        program,
        orgUnit,
        currentEvent,
    });

    return updateRulesEffects(effects, formId);
};

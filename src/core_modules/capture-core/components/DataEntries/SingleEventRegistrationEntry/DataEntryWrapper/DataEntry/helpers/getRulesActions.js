// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getApplicableRuleEffectsForEventProgram,
    updateRulesEffects,
    validateAssignEffects,
} from '../../../../../../rules';
import type { RenderFoundation, EventProgram } from '../../../../../../metaData';
import { dataEntryId, itemId, formId } from './constants';
import type { QuerySingleResource } from '../../../../../../utils/api';
import { rulesExecutedPostLoadDataEntry } from '../../../../../DataEntry';

export const getRulesActions = async ({
    state, // temporary
    program,
    formFoundation,
    orgUnit,
    querySingleResource,
    uid,
}: {
    state: ReduxState,
    program: EventProgram,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    querySingleResource: QuerySingleResource,
    uid: string,
}) => {
    const formValuesClient = getCurrentClientValues(state, formFoundation, formId);
    const dataEntryValuesClient = getCurrentClientMainData(state, itemId, dataEntryId, formFoundation);
    const currentEvent = { ...formValuesClient, ...dataEntryValuesClient, programStageId: formFoundation.id };

    const effects = getApplicableRuleEffectsForEventProgram({
        program,
        orgUnit,
        currentEvent,
    });

    const effectsWithValidations = await validateAssignEffects({
        dataElements: formFoundation.getElements(),
        effects,
        querySingleResource,
    });

    return [
        updateRulesEffects(effectsWithValidations, formId),
        rulesExecutedPostLoadDataEntry(dataEntryId, itemId, uid),
    ];
};

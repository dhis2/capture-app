// @flow
/**
 * @module rulesEngineActionsCreator
 */
import { RulesEngine } from '../../capture-core-utils/RulesEngine';
import { Program, RenderFoundation, TrackerProgram } from '../metaData';
import postProcessRulesEffects from './postProcessRulesEffects';
import { updateRulesEffects } from './rulesEngine.actions';
import type { OutputEffect, EventData, Enrollment, TEIValues } from 'capture-core-utils/RulesEngine/rulesEngine.types';

const rulesEngine = new RulesEngine();

function getRulesActions(
    rulesEffects: ?Array<OutputEffect>,
    foundation: ?RenderFoundation,
    formId: string,
) {
    const effectsHierarchy = postProcessRulesEffects(rulesEffects, foundation);
    return [updateRulesEffects(effectsHierarchy, formId)];
}

export function getRulesActionsForEvent(
    program: ?Program,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: Object,
    currentEventData: ?EventData | {} = {},
    allEventsData: ?Array<EventData>,
) {
    const rulesEffects = runRulesForSingleEvent(
        rulesEngine,
        program,
        foundation,
        orgUnit,
        currentEventData,
        allEventsData,
    );
    return getRulesActions(rulesEffects, foundation, formId);
}

export function getRulesActionsForTEI(
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: Object,
    enrollmentData: ?Enrollment,
    teiValues: ?TEIValues,
) {
    const rulesEffects = runRulesForTEI(
        rulesEngine,
        program,
        foundation,
        formId,
        orgUnit,
        enrollmentData,
        teiValues,
    );
    return getRulesActions(rulesEffects, foundation, formId);
}

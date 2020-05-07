// @flow
/**
 * @module rulesEngineActionsCreator
 */
import { RulesEngine } from '../../capture-core-utils/RulesEngine';
import { RenderFoundation, Program, TrackerProgram } from '../metaData';
import runRulesForSingleEvent from './runRulesForSingleEvent';
import runRulesForTEI from './runRulesForTEI';
import postProcessRulesEffects from './postProcessRulesEffects';
import { updateRulesEffects } from './rulesEngine.actions';
import type {
    OutputEffect,
    EventData,
    Enrollment,
    TEIValues,
    InputEvent,
} from '../../capture-core-utils/RulesEngine/rulesEngine.types';

const rulesEngine = new RulesEngine();

function getRulesActions(
    rulesEffects: Array<OutputEffect>,
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
    currentEventData: ?InputEvent = {},
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
    if (rulesEffects) {
        return getRulesActions(rulesEffects, foundation, formId);
    }
    return [];
}

export function getRulesActionsForTEI(
    program: ?TrackerProgram,
    foundation: ?RenderFoundation,
    formId: string,
    orgUnit: OrgUnit,
    enrollmentData: ?Enrollment,
    teiValues: ?TEIValues,
) {
    const rulesEffects = runRulesForTEI(
        rulesEngine,
        program,
        foundation,
        orgUnit,
        enrollmentData,
        teiValues,
    );
    if (rulesEffects) {
        return getRulesActions(rulesEffects, foundation, formId);
    }
    return [];
}

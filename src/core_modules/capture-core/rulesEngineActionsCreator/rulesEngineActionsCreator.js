// @flow
/**
 * @module rulesEngineActionsCreator
 */
import { Program, RenderFoundation, TrackerProgram } from '../metaData';
import runRulesForSingleEvent from './runRulesForSingleEvent';
import runRulesForTEI from './runRulesForTEI';
import postProcessRulesEffects from './postProcessRulesEffects';
import { updateRulesEffects } from './rulesEngine.actions';
import type {
    OutputEffects,
    Enrollment,
    TEIValues,
    OrgUnit,
    EventData,
    EventsData,
} from '../../capture-core-utils/RulesEngine/rulesEngine.types';


function getRulesActions(
    rulesEffects: ?OutputEffects,
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
    orgUnit: OrgUnit,
    currentEvent: EventData = {},
    allEventsData: EventsData = [],
) {
    const rulesEffects = runRulesForSingleEvent(
        program,
        foundation,
        formId,
        orgUnit,
        currentEvent,
        allEventsData,
    );
    return getRulesActions(rulesEffects, foundation, formId);
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
        program,
        foundation,
        orgUnit,
        enrollmentData,
        teiValues,
    );
    return getRulesActions(rulesEffects, foundation, formId);
}

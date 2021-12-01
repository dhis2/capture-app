// @flow
import type { OrgUnit, EnrollmentEvents, AttributeValuesClientFormatted, EnrollmentData } from '../../common.types';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import {
    getCurrentClientValues,
    getCurrentClientMainData,
    getRulesActionsForEnrollmentEvent,
} from '../../../../rules/actionsCreator';
import type { RenderFoundation, TrackerProgram } from '../../../../metaData';

export const getRulesActions = ({
    state, // temporary
    program,
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

    const allEventsDataClient = [
        eventDataClient,
        ...eventsRulesDependency,
    ];

    return getRulesActionsForEnrollmentEvent({
        program,
        foundation: formFoundation,
        formId,
        orgUnit,
        currentEvent: eventDataClient,
        // $FlowFixMe Candidate for Typescript reasoning!! can not cast from stricter to less strict type
        eventsData: allEventsDataClient,
        attributeValues: attributesValuesRulesDependency,
        // $FlowFixMe Candidate for Typescript reasoning!! can not cast from stricter to less strict type
        enrollmentData: enrollmentDataRulesDependency,
    });
};

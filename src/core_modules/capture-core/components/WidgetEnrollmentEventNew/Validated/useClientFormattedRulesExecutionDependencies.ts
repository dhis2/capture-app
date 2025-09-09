import { useMemo } from 'react';
import { dataElementTypes, type TrackerProgram } from '../../../metaData';
import { convertServerToClient } from '../../../converters';
import { prepareEnrollmentEventsForRulesEngine } from '../../../events/prepareEnrollmentEvents';
import type {
    RulesExecutionDependencies,
    AttributeValuesClientFormatted,
} from '../common.types';

const prepareAttributesForRulesEngine =
    (attributeValues: any, program: TrackerProgram): AttributeValuesClientFormatted => attributeValues
        .reduce((accAttributeValues: any, { id, value }: any) => {
            const { type } = program.attributes.find(({ id: metadataId }: any) => id === metadataId) || {};
            if (type) {
                accAttributeValues[id] = convertServerToClient(value, type);
            }
            return accAttributeValues;
        }, {});

const prepareEnrollmentDataForRulesEngine = ({ enrolledAt, occurredAt, enrollmentId }: any) => ({
    enrolledAt: convertServerToClient(enrolledAt, dataElementTypes.DATE),
    occurredAt: convertServerToClient(occurredAt, dataElementTypes.DATE),
    enrollmentId,
});

export const useClientFormattedRulesExecutionDependencies =
    ({ events, attributeValues, enrollmentData }: RulesExecutionDependencies, program: TrackerProgram) =>
        useMemo(() => ({
            events: prepareEnrollmentEventsForRulesEngine(events),
            attributeValues: prepareAttributesForRulesEngine(attributeValues, program),
            enrollmentData: prepareEnrollmentDataForRulesEngine(enrollmentData),
        }), [events, attributeValues, enrollmentData, program]);

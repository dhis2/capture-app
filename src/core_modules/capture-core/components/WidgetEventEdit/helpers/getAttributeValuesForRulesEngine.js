// @flow
import { convertServerToClient } from '../../../converters';
import { type DataElement } from '../../../metaData';
import type {
    AttributeValue,
} from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export const getAttributeValuesForRulesEngine = (attributeValues: Array<AttributeValue> = [], attributes: Array<DataElement>) =>
    attributeValues.reduce((acc, { id, value }) => {
        const dataElement = attributes.find(({ id: attributeId }) => id === attributeId);
        if (dataElement) {
            acc[id] = convertServerToClient(value, dataElement.type);
        }
        return acc;
    }, {});

// @flow
import { getAttributesFromScopeId } from '../../../metaData/helpers';

type Attributes = {|
  attribute: string,
  code: string,
  created: string,
  displayName: string,
  lastUpdated: string,
  storedBy: string,
  value: string,
  valueType: string,
|}

export const deriveTeiName = (attributes: Array<Attributes>, trackedEntityType: string) => {
    const tetAttributes = getAttributesFromScopeId(trackedEntityType);
    const [firstId, secondId] = tetAttributes
        .filter(({ displayInReports }) => displayInReports)
        .map(({ id }) => id);

    const { value: firstValue } = attributes.find(({ attribute }) => attribute === firstId) || { value: '' };
    const { value: secondValue } = attributes.find(({ attribute }) => attribute === secondId) || { value: '' };
    return `${firstValue}${firstValue && ' '}${secondValue}`;
};


// @flow
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';

const dataEntryId = 'singleEvent';
const itemId = 'newEvent';
const formId = getDataEntryKey(dataEntryId, itemId);

export { dataEntryId, itemId, formId };

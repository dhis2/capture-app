// @flow
import i18n from '@dhis2/d2-i18n';
import { DataElement, OptionSet, Option, dataElementTypes } from '../metaData';

const eventStatusElement = new DataElement((o) => {
  o.id = 'status';
  o.type = dataElementTypes.TEXT;
});

const eventStatusOptionSet = new OptionSet(
  'statusOptionSet',
  [
    new Option((o) => {
      o.text = i18n.t('Active');
      o.value = 'ACTIVE';
    }),
    new Option((o) => {
      o.text = i18n.t('Completed');
      o.value = 'COMPLETED';
    }),
  ],
  null,
  eventStatusElement,
);

eventStatusElement.optionSet = eventStatusOptionSet;

export default eventStatusElement;

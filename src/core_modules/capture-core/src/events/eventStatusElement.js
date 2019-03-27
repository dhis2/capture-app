// @flow
import i18n from '@dhis2/d2-i18n';
import { DataElement, OptionSet, Option, dataElementTypes } from '../metaData';

const eventStatusElement = new DataElement((_this) => {
    _this.id = 'status';
    _this.type = dataElementTypes.TEXT;
});

const eventStatusOptionSet = new OptionSet('statusOptionSet', [
    new Option((_this) => {
        _this.text = i18n.t('Active');
        _this.value = 'ACTIVE';
    }),
    new Option((_this) => {
        _this.text = i18n.t('Completed');
        _this.value = 'COMPLETED';
    }),
], eventStatusElement);

eventStatusElement.optionSet = eventStatusOptionSet;

export default eventStatusElement;

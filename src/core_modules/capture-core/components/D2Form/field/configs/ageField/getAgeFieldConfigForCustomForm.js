// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { AgeFieldForCustomForm } from '../../Components';
import { orientations } from '../../../../FormFields/New';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

export const getAgeFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
    }, metaData);

    return createFieldConfig({
        component: AgeFieldForCustomForm,
        props,
    }, metaData);
};

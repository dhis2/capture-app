// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { orientations } from '../../../../FormFields/New';
import { CoordinateFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';

export const getCoordinateFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
    }, metaData);

    return createFieldConfig({
        component: CoordinateFieldForCustomForm,
        props,
    }, metaData);
};

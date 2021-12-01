// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { orientations } from '../../../../FormFields/New';
import { PolygonFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';

export const getPolygonFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
    }, metaData);

    return createFieldConfig({
        component: PolygonFieldForCustomForm,
        props,
    }, metaData);
};

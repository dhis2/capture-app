// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { PolygonFieldForCustomForm } from '../../Components';
import { orientations } from '../../../../FormFields/New';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

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

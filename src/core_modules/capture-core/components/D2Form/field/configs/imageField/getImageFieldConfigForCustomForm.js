// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { ImageFieldForCustomForm } from '../../Components';
import { orientations } from '../../../../FormFields/New';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

export const getImageFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
        async: true,
        orientation: orientations.HORIZONTAL,
    }, metaData);

    return createFieldConfig({
        component: ImageFieldForCustomForm,
        props,
    }, metaData);
};

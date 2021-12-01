// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { orientations } from '../../../../FormFields/New';
import { FileResourceFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';

export const getFileResourceFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
        async: true,
        orientation: orientations.HORIZONTAL,
    }, metaData);

    return createFieldConfig({
        component: FileResourceFieldForCustomForm,
        props,
    }, metaData);
};

// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { FileResourceFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getFileResourceFieldConfigForCustomForm = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        async: true,
        orientation: orientations.HORIZONTAL,
    }, metaData);

    return createFieldConfig({
        component: FileResourceFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};

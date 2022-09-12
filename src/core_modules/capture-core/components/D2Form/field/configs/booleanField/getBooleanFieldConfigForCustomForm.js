// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { BooleanFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getBooleanFieldConfigForCustomForm = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        id: metaData.id,
    }, metaData);

    return createFieldConfig({
        component: BooleanFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};

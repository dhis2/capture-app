// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { PolygonFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getPolygonFieldConfigForCustomForm = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
    }, metaData);

    return createFieldConfig({
        component: PolygonFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};

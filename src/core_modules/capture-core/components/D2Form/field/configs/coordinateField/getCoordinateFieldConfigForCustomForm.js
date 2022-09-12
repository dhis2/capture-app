// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { CoordinateFieldForCustomForm } from '../../Components';
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getCoordinateFieldConfigForCustomForm = (metaData: MetaDataElement, options: Object, querySingleResource: QuerySingleResource) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
    }, metaData);

    return createFieldConfig({
        component: CoordinateFieldForCustomForm,
        props,
    }, metaData, querySingleResource);
};

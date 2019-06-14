// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { PolygonFieldForCustomForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getPolygonField = (metaData: MetaDataElement) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
    }, metaData);

    return createFieldConfig({
        component: PolygonFieldForCustomForm,
        props,
    }, metaData);
};

export default getPolygonField;

// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { ImageFieldForCustomForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getImageFieldConfig = (metaData: MetaDataElement) => {
    const props = createProps({
        async: true,
        orientation: orientations.HORIZONTAL,
    }, metaData);

    return createFieldConfig({
        component: ImageFieldForCustomForm,
        props,
    }, metaData);
};

export default getImageFieldConfig;

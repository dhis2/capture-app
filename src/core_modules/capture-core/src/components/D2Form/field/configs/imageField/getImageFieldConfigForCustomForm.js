// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { ImageFieldForCustomForm } from '../../Components';

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

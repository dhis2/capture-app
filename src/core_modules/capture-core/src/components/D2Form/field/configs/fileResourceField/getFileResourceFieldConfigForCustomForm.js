// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { FileResourceFieldForCustomForm } from '../../Components';

const getFileResourceFieldConfig = (metaData: MetaDataElement) => {
    const props = createProps({
        async: true,
        orientation: orientations.HORIZONTAL,
    }, metaData);

    return createFieldConfig({
        component: FileResourceFieldForCustomForm,
        props,
    }, metaData);
};

export default getFileResourceFieldConfig;

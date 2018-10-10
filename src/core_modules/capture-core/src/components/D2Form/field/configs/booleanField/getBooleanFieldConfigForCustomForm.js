// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { BooleanFieldForCustomForm } from '../../Components';

const getBooleanField = (metaData: MetaDataElement) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        id: metaData.id,
    }, metaData);

    return createFieldConfig({
        component: BooleanFieldForCustomForm,
        props,
    }, metaData);
};

export default getBooleanField;

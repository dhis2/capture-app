// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { AgeFieldForCustomForm } from '../../Components';

const getAgeFieldForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        shrinkDisabled: false,
    }, metaData);

    return createFieldConfig({
        component: AgeFieldForCustomForm,
        props,
    }, metaData);
};

export default getAgeFieldForCustomForm;

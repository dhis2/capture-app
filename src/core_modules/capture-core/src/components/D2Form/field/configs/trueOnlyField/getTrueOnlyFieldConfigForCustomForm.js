// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { TrueOnlyFieldForCustomForm } from '../../Components';
import MetaDataElement from '../../../../../metaData/DataElement/DataElement';

const getTrueOnlyField = (metaData: MetaDataElement) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        id: metaData.id,
    }, metaData);

    return createFieldConfig({
        component: TrueOnlyFieldForCustomForm,
        props,
    }, metaData);
};

export default getTrueOnlyField;

// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { TrueOnlyFieldForCustomForm } from '../../Components';
import { orientations } from '../../../../FormFields/New';
import type { DataElement as MetaDataElement } from '../../../../../metaData';

export const getTrueOnlyFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
        orientation: orientations.HORIZONTAL,
        id: metaData.id,
    }, metaData);

    return createFieldConfig({
        component: TrueOnlyFieldForCustomForm,
        props,
    }, metaData);
};

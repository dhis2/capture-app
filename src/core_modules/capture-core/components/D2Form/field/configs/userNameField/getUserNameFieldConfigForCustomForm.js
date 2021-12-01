// @flow
import type { DataElement as MetaDataElement } from '../../../../../metaData';
import { UserNameFieldForCustomForm } from '../../Components';
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';

export const getUserNameFieldConfigForCustomForm = (metaData: MetaDataElement) => {
    const props = createProps({
    }, metaData);

    return createFieldConfig({
        component: UserNameFieldForCustomForm,
        props,
    }, metaData);
};

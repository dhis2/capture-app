
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { MultiOptionSetSelectFieldForCustomForm } from '../../Components';
import { getOptionsForSelect } from './optionSetHelpers';
import type { DataElement, OptionSet } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getMultiOptionSetFieldConfigForCustomForm = (
    metaData: DataElement,
    options: any,
    querySingleResource: QuerySingleResource,
) => {
    const optionSet: OptionSet = metaData.optionSet;

    const props = createProps(
        {
            id: metaData.id,
            formId: options.formId,
            optionGroups: optionSet.optionGroups,
            options: getOptionsForSelect(metaData.optionSet),
            nullable: !metaData.compulsory,
        },
        metaData,
    );

    return createFieldConfig(
        {
            component: MultiOptionSetSelectFieldForCustomForm,
            props,
            commitEvent: 'onBlur',
        },
        metaData,
        querySingleResource,
    );
};

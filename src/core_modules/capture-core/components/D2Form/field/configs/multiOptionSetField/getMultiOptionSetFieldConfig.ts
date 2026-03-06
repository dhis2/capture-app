
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { MultiOptionSetSelectFieldForForm } from '../../Components';
import { getOptionsForSelect } from './optionSetHelpers';
import type { DataElement, OptionSet } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getMultiOptionSetFieldConfig = (
    metaData: DataElement,
    options: any,
    querySingleResource: QuerySingleResource,
) => {
    const optionSet: OptionSet | null = metaData.optionSet;

    if (!optionSet) {
        return null;
    }

    const props = createProps(
        {
            id: metaData.id,
            formId: options.formId,
            formHorizontal: options.formHorizontal,
            fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
            optionGroups: optionSet.optionGroups,
            options: getOptionsForSelect(metaData.optionSet),
            nullable: !metaData.compulsory,
            style: {
                width: '100%',
            },
        },
        options,
        metaData,
    );

    return createFieldConfig(
        {
            component: MultiOptionSetSelectFieldForForm,
            props,
            commitEvent: 'onBlur',
        },
        metaData,
        querySingleResource,
    );
};

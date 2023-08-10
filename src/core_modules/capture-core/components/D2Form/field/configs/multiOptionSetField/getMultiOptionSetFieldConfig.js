// @flow
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { MultiOptionSetSelectFieldForForm } from '../../Components';
import { getOptionsForSelect } from './optionSetHelpers';
import type { DataElement, OptionSet } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getMultiOptionSetFieldConfig = (
    metaData: DataElement,
    options: Object,
    querySingleResource: QuerySingleResource,
) => {
    // $FlowFixMe[incompatible-type] automated comment
    const optionSet: OptionSet = metaData.optionSet;

    const props = createProps(
        {
            id: metaData.id,
            formId: options.formId,
            formHorizontal: options.formHorizontal,
            fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
            optionGroups: optionSet.optionGroups,
            // $FlowFixMe[incompatible-call] automated comment
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

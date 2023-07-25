// @flow
import { createFieldConfig, createProps } from '../base/configBaseCustomForm';
import { MultiOptionSetSelectFieldForCustomForm } from '../../Components';
import { getOptionsForSelect } from './optionSetHelpers';
import type { DataElement, OptionSet } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

export const getMultiOptionSetFieldConfigForCustomForm = (
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
            optionGroups: optionSet.optionGroups,
            // $FlowFixMe[incompatible-call] automated comment
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

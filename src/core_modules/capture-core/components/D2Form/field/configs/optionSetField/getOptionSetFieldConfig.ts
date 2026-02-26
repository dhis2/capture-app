
import { createFieldConfig, createProps } from '../base/configBaseDefaultForm';
import { OptionSetSelectFieldForForm, OptionSetBoxesFieldForForm } from '../../Components';
import { getOptionsForRadioButtons, getOptionsForSelect } from './optionSetHelpers';
import { orientations } from '../../../../FormFields/New';
import { inputTypes } from '../../../../../metaData/OptionSet/optionSet.const';
import type { DataElement, OptionSet } from '../../../../../metaData';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

const mapInputTypeToPropsGetterFn = {
    [inputTypes.DROPDOWN]: (metaData: DataElement) => ({
        options: getOptionsForSelect(metaData.optionSet),
        nullable: !metaData.compulsory,
        filterable: true,
        style: {
            width: '100%',
        },
    }),
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: (metaData: DataElement) => ({
        options: getOptionsForRadioButtons(metaData.optionSet),
    }),
    [inputTypes.VERTICAL_RADIOBUTTONS]: (metaData: DataElement) => ({
        orientation: orientations.VERTICAL,
        options: getOptionsForRadioButtons(metaData.optionSet),
    }),
};

const mapInputTypeToComponent = {
    [inputTypes.DROPDOWN]: OptionSetSelectFieldForForm,
    [inputTypes.HORIZONTAL_RADIOBUTTONS]: OptionSetBoxesFieldForForm,
    [inputTypes.VERTICAL_RADIOBUTTONS]: OptionSetBoxesFieldForForm,
};


export const getOptionSetFieldConfig = (metaData: DataElement, options: any, querySingleResource: QuerySingleResource) => {
    const optionSet: OptionSet | null = metaData.optionSet;
    if (!optionSet) {
        return null;
    }

    const inputType = optionSet.inputType;
    const inputTypeProps = mapInputTypeToPropsGetterFn[inputType](metaData);

    const props = createProps({
        id: metaData.id,
        formId: options.formId,
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        optionGroups: optionSet.optionGroups,
        showHelpText: options.showHelpText,
        ...inputTypeProps,
    }, options, metaData);

    return createFieldConfig({
        component: mapInputTypeToComponent[inputType],
        props,
        commitEvent: inputType === inputTypes.DROPDOWN ? 'onBlur' : 'onSelect',
    }, metaData, querySingleResource);
};

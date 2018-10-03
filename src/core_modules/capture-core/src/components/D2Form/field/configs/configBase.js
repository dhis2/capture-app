// @flow
import getValidators from '../validators';
import MetaDataElement from '../../../../metaData/DataElement/DataElement';
import type { FieldConfig, ValidatorContainer } from '../../../../__TEMP__/FormBuilderExternalState.component';

type FieldConfigForType = {
    component: React.ComponentType<any>,
    props?: ?Object,
    id?: string,
    validators?: Array<ValidatorContainer>,
    commitEvent?: ?string,
    onIsEqual?: ?(newValue: any, oldValue: any) => boolean,
};

const convertPx = (options: Object, value: number) => {
    const pxToRem = options && options.theme && options.theme.typography.pxToRem;
    return pxToRem ? pxToRem(value) : value;
};

const commitEvents = {
    ON_BLUR: 'onBlur',
};

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

const getBaseProps = () => ({
    style: {
        width: '100%',
    },
    styles: baseComponentStyles,
});

const getBaseConfigForField = (metaData: MetaDataElement) => ({
    id: metaData.id,
    validators: getValidators(metaData),
    commitEvent: commitEvents.ON_BLUR,
});

const baseComponentStylesVertical = {
    labelContainerStyle: {
        width: 150,
    },
    inputContainerStyle: {
        width: 150,
    },
};

const getBaseFormHorizontalProps = (options: Object) => ({
    style: {
        width: convertPx(options, 150),
    },
    styles: baseComponentStylesVertical,
});

export const createProps = (props?: ?Object, options?: ?Object) => ({
    ...getBaseProps(),
    ...(options && options.formHorizontal ? getBaseFormHorizontalProps(options) : {}),
    ...props,
});

export const createFieldConfig = (fieldSpecifications: FieldConfigForType, metaData: MetaDataElement): FieldConfig => ({
    ...getBaseConfigForField(metaData),
    ...fieldSpecifications,
});

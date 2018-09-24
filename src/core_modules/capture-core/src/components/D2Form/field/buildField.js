// @flow
import log from 'loglevel';

import errorCreator from '../../../utils/errorCreator';
import { TextField, BooleanField, TrueOnlyField, AgeField, orientations, withFocusSaver, withLabel } from '../../FormFields/New';
import labelTypeClasses from './buildField.mod.css';
import D2Date from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import D2DateTime from '../../FormFields/DateAndTime/D2DateTime/D2DateTime.component';
import D2File from '../../FormFields/File/D2File.component';
import D2Image from '../../FormFields/Image/D2Image.component';
import D2PhoneNumber from '../../FormFields/PhoneNumber/PhoneNumber.component';
import OrgUnitTree from '../../FormFields/OrgUnitTree/OrgUnitTree.component';
import CoordinateField from '../../FormFields/CoordinateField/CoordinateField.component';
import UsernameField from '../../FormFields/Username/Username.component';

import SelectBoxes from '../../FormFields/Options/SelectBoxes/SelectBoxes.component';
import OptionsSelect from '../../FormFields/Options/SelectVirtualized/OptionsSelectVirtualized.component';
import withSelectTranslations from '../../FormFields/Options/SelectVirtualized/withTranslations';
import withConvertedOptionSet from '../../FormFields/Options/withConvertedOptionSet';

import getValidators from './validators';
import MetaDataElement from '../../../metaData/DataElement/DataElement';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import { inputTypes as optionSetInputTypes } from '../../../metaData/OptionSet/optionSet.const';

import withInternalChangeHandler from '../../FormFields/withInternalChangeHandler';
import withDefaultShouldUpdateInterface from './withDefaultShouldUpdateInterface';
import withDefaultFieldContainer from './withDefaultFieldContainer';
import withHideCompatibility from './withHideCompatibility';
import withGotoInterface from './withGotoInterface';
import withRequiredFieldCalculation from './withRequiredFieldCalculation';
import withCalculateMessages from './messages/withCalculateMessages';
import withDisplayMessages from './messages/withDisplayMessages';

import type { Field } from '../../../__TEMP__/FormBuilderExternalState.component';

const commitEvents = {
    ON_BLUR: 'onBlur',
};
const errorMessages = {
    NO_FORMFIELD_FOR_TYPE: 'Formfield component not specified for type',
};

const convertPx = (options: Object, value: number) => {
    const pxToRem = options && options.theme && options.theme.typography.pxToRem;
    return pxToRem ? pxToRem(value) : value;
};

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

const getBaseComponentProps = () => ({
    style: {
        width: '100%',
    },
    styles: baseComponentStyles,
});

const getBaseFieldProps = (metaData: MetaDataElement) => ({
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

const createComponentProps = (componentProps: Object, options: Object) => ({
    ...getBaseComponentProps(),
    ...(options && options.formHorizontal ? getBaseFormHorizontalProps(options) : {}),
    ...componentProps,
});

const createFieldProps = (fieldProps: Object, metaData: MetaDataElement) => ({
    ...getBaseFieldProps(metaData),
    ...fieldProps,
});

const getBaseTextField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        multiline: false,
        metaCompulsory: metaData.compulsory,
    }, options);

    return createFieldProps({
        id: metaData.id,
        component:
            withGotoInterface()(
                withHideCompatibility()(
                    withDefaultShouldUpdateInterface()(
                        withRequiredFieldCalculation()(
                            withFocusSaver()(
                                withCalculateMessages()(
                                    withDefaultFieldContainer()(
                                        withLabel({
                                            onGetUseVerticalOrientation: () => options.formHorizontal,
                                            onGetCustomFieldLabeClass: () =>
                                                `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                                        })(
                                            withDisplayMessages()(
                                                withInternalChangeHandler()(TextField),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        props,
    }, metaData);
};

const getPhoneField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        multiline: false,
        metaCompulsory: metaData.compulsory,
    }, options);

    return createFieldProps({
        id: metaData.id,
        component:
      withGotoInterface()(
          withHideCompatibility()(
              withDefaultShouldUpdateInterface()(
                  withRequiredFieldCalculation()(
                      withCalculateMessages()(
                          withDefaultFieldContainer()(
                              withDisplayMessages()(
                                  withInternalChangeHandler()(D2PhoneNumber),
                              ),
                          ),
                      ),
                  ),
              ),
          ),
      ),
        props,
    }, metaData);
};

const getOrgUnitField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        multiline: false,
        metaCompulsory: metaData.compulsory,
    }, options);

    return createFieldProps({
        id: metaData.id,
        component:
        withGotoInterface()(
            withHideCompatibility()(
                withDefaultShouldUpdateInterface()(
                    withRequiredFieldCalculation()(
                        withCalculateMessages()(
                            withDefaultFieldContainer()(
                                withDisplayMessages()(
                                    withInternalChangeHandler()(OrgUnitTree),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
        props,
    }, metaData);
};

const getCoordinateField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        multiline: false,
        metaCompulsory: metaData.compulsory,
    }, options);

    return createFieldProps({
        id: metaData.id,
        component:
        withGotoInterface()(
            withHideCompatibility()(
                withDefaultShouldUpdateInterface()(
                    withRequiredFieldCalculation()(
                        withDefaultFieldContainer()(
                            withDefaultMessages()(
                                withInternalChangeHandler()(CoordinateField),
                            ),
                        ),
                    ),
                ),
            ),
        ),
        props,
    }, metaData);
};

const getUsernameField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        multiline: false,
        metaCompulsory: metaData.compulsory,
    }, options);

    return createFieldProps({
        id: metaData.id,
        component:
        withGotoInterface()(
            withHideCompatibility()(
                withDefaultShouldUpdateInterface()(
                    withRequiredFieldCalculation()(
                        withDefaultFieldContainer()(
                            withDefaultMessages()(
                                withInternalChangeHandler()(UsernameField),
                            ),
                        ),
                    ),
                ),
            ),
        ),
        props,
    }, metaData);
};

const getAgeField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        multiline: false,
        metaCompulsory: metaData.compulsory,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
    }, options);

    return createFieldProps({
        id: metaData.id,
        component:
        withGotoInterface()(
            withHideCompatibility()(
                withDefaultShouldUpdateInterface()(
                    withRequiredFieldCalculation()(
                        withCalculateMessages()(
                            withFocusSaver()(
                                withDefaultFieldContainer()(
                                    withLabel({
                                        onGetUseVerticalOrientation: () => options.formHorizontal,
                                        onGetCustomFieldLabeClass: () =>
                                            `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                                    })(
                                        withDisplayMessages()(
                                            withInternalChangeHandler()(AgeField),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
        props,
    }, metaData);
};

const fieldForTypes = {
    [elementTypes.EMAIL]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.TEXT]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.PHONE_NUMBER]: (metaData: MetaDataElement, options: Object) => getPhoneField(metaData, options),
    [elementTypes.LONG_TEXT]: (metaData: MetaDataElement, options: Object) => {
        const baseField = getBaseTextField(metaData, options);
        const props = { ...baseField.props, multiLine: true };
        return { ...baseField, props };
    },
    [elementTypes.NUMBER]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.INTEGER]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.INTEGER_POSITIVE]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.INTEGER_NEGATIVE]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.BOOLEAN]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
            id: metaData.id,
        }, options);

        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withCalculateMessages()(
                                    withFocusSaver()(
                                        withDefaultFieldContainer()(
                                            withLabel({
                                                onGetUseVerticalOrientation: () => options.formHorizontal,
                                                onGetCustomFieldLabeClass: () =>
                                                    `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.booleanLabel}`,
                                            })(
                                                withDisplayMessages()(BooleanField),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.TRUE_ONLY]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
            id: metaData.id,
        }, options);

        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withCalculateMessages()(
                                    withFocusSaver()(
                                        withDefaultFieldContainer()(
                                            withLabel({
                                                onGetUseVerticalOrientation: () => options.formHorizontal,
                                                onGetCustomFieldLabeClass: () =>
                                                    `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
                                            })(
                                                withDisplayMessages()(TrueOnlyField),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.DATE]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            width: options.formHorizontal ? 150 : 350,
            calendarWidth: 350,
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
        }, options);

        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withCalculateMessages()(
                                    withDefaultFieldContainer()(
                                        withDisplayMessages()(
                                            withInternalChangeHandler()(D2Date),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.DATETIME]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            dateWidth: 200,
            calendarWidth: 350,
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
        }, options);

        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withCalculateMessages()(
                                    withDefaultFieldContainer()(
                                        withDisplayMessages()(
                                            withInternalChangeHandler()(D2DateTime),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.TIME]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.PERCENTAGE]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.URL]: (metaData: MetaDataElement, options: Object) => getBaseTextField(metaData, options),
    [elementTypes.AGE]: (metaData: MetaDataElement, options: Object) => getAgeField(metaData, options),
    [elementTypes.ORGANISATION_UNIT]: (metaData: MetaDataElement, options: Object) => getOrgUnitField(metaData, options),
    [elementTypes.COORDINATE]: (metaData: MetaDataElement, options: Object) => getCoordinateField(metaData, options),
    [elementTypes.USERNAME]: (metaData: MetaDataElement, options: Object) => getUsernameField(metaData, options),
    [elementTypes.FILE_RESOURCE]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            async: true,
            formHorizontal: options.formHorizontal,
        }, options);
        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withCalculateMessages()(
                                    withDefaultFieldContainer()(
                                        withDisplayMessages()(
                                            withInternalChangeHandler()(D2File),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.IMAGE]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            async: true,
            formHorizontal: options.formHorizontal,
        }, options);
        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withCalculateMessages()(
                                    withDefaultFieldContainer()(
                                        withDisplayMessages()(
                                            withInternalChangeHandler()(D2Image),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.UNKNOWN]: (metaData: MetaDataElement, options: Object) => null, // eslint-disable-line no-unused-vars
};

const getOptionSetComponent = (inputType: $Values<typeof optionSetInputTypes>) => {
    if (inputType === optionSetInputTypes.SELECT) {
        return withGotoInterface()(
            withHideCompatibility()(
                withDefaultShouldUpdateInterface()(
                    withRequiredFieldCalculation()(
                        withCalculateMessages()(
                            withDefaultFieldContainer()(
                                withDisplayMessages()(
                                    withConvertedOptionSet()(
                                        withSelectTranslations()(OptionsSelect),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }

    return withGotoInterface()(
        withHideCompatibility()(
            withDefaultShouldUpdateInterface()(
                withRequiredFieldCalculation()(
                    withCalculateMessages()(
                        withDefaultFieldContainer()(
                            withDisplayMessages()(
                                withConvertedOptionSet()(SelectBoxes),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );
};

const optionSetField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        optionSet: metaData.optionSet,
        nullable: !metaData.compulsory,
        required: metaData.compulsory,
        style: {
            width: options.formHorizontal ? convertPx(options, 210) : '100%',
        },
    }, options);

    return createFieldProps({
        id: metaData.id,
        component:
            // $FlowSuppress
            getOptionSetComponent(metaData.optionSet.inputType),
        props,
    }, metaData);
};

export default function buildField(metaData: MetaDataElement, options: Object): ?Field {
    const type = metaData.type;
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        return fieldForTypes[elementTypes.UNKNOWN](metaData, options);
    }

    if (metaData.optionSet) {
        return optionSetField(metaData, options);
    }

    return fieldForTypes[type](metaData, options);
}

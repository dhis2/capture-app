// @flow
import log from 'loglevel';

import errorCreator from '../../../utils/errorCreator';
import { createFieldConfig, createProps } from './configBase'; // remove this eventually
import { getTextFieldConfig } from './configs';

import { BooleanField, TrueOnlyField, AgeField, orientations, withFocusSaver, withLabel, VirtualizedSelectField, DateField, DateTimeField, CoordinateField, withCalculateMessages, withDisplayMessages } from '../../FormFields/New';
import labelTypeClasses from './buildField.mod.css';
import D2File from '../../FormFields/File/D2File.component';
import D2Image from '../../FormFields/Image/D2Image.component';
import OrgUnitTree from '../../FormFields/OrgUnitTree/OrgUnitTree.component';
import UsernameField from '../../FormFields/Username/Username.component';

import SelectBoxes from '../../FormFields/Options/SelectBoxes/SelectBoxes.component';
import withSelectTranslations from '../../FormFields/Options/SelectVirtualizedV2/withTranslations';
import withConvertedOptionSet from '../../FormFields/Options/withConvertedOptionSet';

import MetaDataElement from '../../../metaData/DataElement/DataElement';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import { inputTypes as optionSetInputTypes } from '../../../metaData/OptionSet/optionSet.const';

import withInternalChangeHandler from '../../FormFields/withInternalChangeHandler';
import withDefaultShouldUpdateInterface from './withDefaultShouldUpdateInterface';
import withDefaultFieldContainer from './withDefaultFieldContainer';
import withHideCompatibility from './withHideCompatibility';
import withGotoInterface from './withGotoInterface';
import withRequiredFieldCalculation from './withRequiredFieldCalculation';

const errorMessages = {
    NO_FORMFIELD_FOR_TYPE: 'Formfield component not specified for type',
};

const getOrgUnitField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
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
                                withLabel({
                                    onGetUseVerticalOrientation: () => options.formHorizontal,
                                    onGetCustomFieldLabeClass: () =>
                                        `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.orgUnitLabel}`,
                                })(
                                    withDisplayMessages()(
                                        withInternalChangeHandler()(OrgUnitTree),
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

const getCoordinateField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        metaCompulsory: metaData.compulsory,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
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
                                            `$ {options.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
                                    })(
                                        withDisplayMessages()(
                                            withInternalChangeHandler()(CoordinateField),
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

const getUsernameField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
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
                            withFocusSaver()(
                                withDefaultFieldContainer()(
                                    withLabel({
                                        onGetUseVerticalOrientation: () => options.formHorizontal,
                                        onGetCustomFieldLabeClass: () =>
                                            `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.textLabel}`,
                                    })(
                                        withDisplayMessages()(
                                            withInternalChangeHandler()(UsernameField),
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

const getAgeField = (metaData: MetaDataElement, options: Object) => {
    const props = createComponentProps({
        label: metaData.formName,
        metaCompulsory: metaData.compulsory,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
        shrinkDisabled: options.formHorizontal,
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
                                            `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.ageLabel}`,
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
    [elementTypes.EMAIL]: getTextFieldConfig,
    [elementTypes.TEXT]: getTextFieldConfig,
    [elementTypes.PHONE_NUMBER]: getTextFieldConfig,
    [elementTypes.LONG_TEXT]: (metaData: MetaDataElement, options: Object) => {
        const fieldConfig = getTextFieldConfig(metaData, options, { multiLine: true });
        return fieldConfig;
    },
    [elementTypes.NUMBER]: getTextFieldConfig,
    [elementTypes.INTEGER]: getTextFieldConfig,
    [elementTypes.INTEGER_POSITIVE]: getTextFieldConfig,
    [elementTypes.INTEGER_NEGATIVE]: getTextFieldConfig,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getTextFieldConfig,
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
            width: options.formHorizontal ? 150 : '100%',
            maxWidth: options.formHorizontal ? 150 : 350,
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
                                    withFocusSaver()(
                                        withDefaultFieldContainer()(
                                            withLabel({
                                                onGetUseVerticalOrientation: () => options.formHorizontal,
                                                onGetCustomFieldLabeClass: () =>
                                                    `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                                            })(
                                                withDisplayMessages()(
                                                    withInternalChangeHandler()(DateField),
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
    },
    [elementTypes.DATETIME]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            dateWidth: options.formHorizontal ? 150 : '100%',
            dateMaxWidth: options.formHorizontal ? 150 : 350,
            orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
            shrinkDisabled: options.formHorizontal,
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
                                    withFocusSaver()(
                                        withDefaultFieldContainer()(
                                            withLabel({
                                                onGetUseVerticalOrientation: () => options.formHorizontal,
                                                onGetCustomFieldLabeClass: () =>
                                                    `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.dateTimeLabel}`,
                                            })(
                                                withDisplayMessages()(
                                                    withInternalChangeHandler()(DateTimeField),
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
    },
    [elementTypes.TIME]: getTextFieldConfig,
    [elementTypes.PERCENTAGE]: getTextFieldConfig,
    [elementTypes.URL]: getTextFieldConfig,
    [elementTypes.AGE]: (metaData: MetaDataElement, options: Object) => getAgeField(metaData, options),
    [elementTypes.ORGANISATION_UNIT]: (metaData: MetaDataElement, options: Object) => getOrgUnitField(metaData, options),
    [elementTypes.COORDINATE]: (metaData: MetaDataElement, options: Object) => getCoordinateField(metaData, options),
    [elementTypes.USERNAME]: (metaData: MetaDataElement, options: Object) => getUsernameField(metaData, options),
    [elementTypes.FILE_RESOURCE]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            async: true,
            orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
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
                                                    `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.fileLabel}`,
                                            })(
                                                withDisplayMessages()(
                                                    withInternalChangeHandler()(D2File),
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
    },
    [elementTypes.IMAGE]: (metaData: MetaDataElement, options: Object) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            async: true,
            orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
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
                                                    `${options.fieldLabelMediaBasedClass} ${labelTypeClasses.imageLabel}`,
                                            })(
                                                withDisplayMessages()(
                                                    withInternalChangeHandler()(D2Image),
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
    },
    [elementTypes.UNKNOWN]: (metaData: MetaDataElement, options: Object) => null, // eslint-disable-line no-unused-vars
};

const getOptionSetComponent = (inputType: $Values<typeof optionSetInputTypes>, options: Object) => {
    if (inputType === optionSetInputTypes.SELECT) {
        return withGotoInterface()(
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
                                            withConvertedOptionSet()(
                                                withSelectTranslations()(VirtualizedSelectField),
                                            ),
                                        ),
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
            getOptionSetComponent(metaData.optionSet.inputType, options),
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

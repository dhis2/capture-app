// @flow
import log from 'loglevel';

import errorCreator from '../../../utils/errorCreator';
import TextField from '../../FormFields/Generic/D2TextField.component';
import TrueFalse from '../../FormFields/Generic/D2TrueFalse.component';
import TrueOnly from '../../FormFields/Generic/D2TrueOnly.component';
import D2Date from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import D2DateTime from '../../FormFields/DateAndTime/D2DateTime/D2DateTime.component';
import D2File from '../../FormFields/File/D2File.component';
import D2Image from '../../FormFields/Image/D2Image.component';

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
import withDefaultMessages from './withDefaultMessages';
import withHideCompatibility from './withHideCompatibility';
import withGotoInterface from './withGotoInterface';
import withRequiredFieldCalculation from './withRequiredFieldCalculation';

import type { Field } from '../../../__TEMP__/FormBuilderExternalState.component';


const commitEvents = {
    ON_BLUR: 'onBlur',
};
const errorMessages = {
    NO_FORMFIELD_FOR_TYPE: 'Formfield component not specified for type',
};

const getBaseComponentProps = () => ({
    style: {
        width: '100%',
    },
});

const getBaseFieldProps = (metaData: MetaDataElement) => ({
    validators: getValidators(metaData),
    commitEvent: commitEvents.ON_BLUR,
});

const createComponentProps = (componentProps: Object) => ({
    ...getBaseComponentProps(),
    ...componentProps,
});

const createFieldProps = (fieldProps: Object, metaData: MetaDataElement) => ({
    ...getBaseFieldProps(metaData),
    ...fieldProps,
});

const getBaseTextField = (metaData: MetaDataElement) => {
    const props = createComponentProps({
        label: metaData.formName,
        multiline: false,
        metaCompulsory: metaData.compulsory,
    });

    return createFieldProps({
        id: metaData.id,
        component:
            withGotoInterface()(
                withHideCompatibility()(
                    withDefaultShouldUpdateInterface()(
                        withRequiredFieldCalculation()(
                            withDefaultFieldContainer()(
                                withDefaultMessages()(
                                    withInternalChangeHandler()(TextField),
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
    [elementTypes.TEXT]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.LONG_TEXT]: (metaData: MetaDataElement) => {
        const baseField = getBaseTextField(metaData);
        const props = { ...baseField.props, multiLine: true };
        return { ...baseField, props };
    },
    [elementTypes.NUMBER]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.INTEGER]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.INTEGER_POSITIVE]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.INTEGER_NEGATIVE]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.BOOLEAN]: (metaData: MetaDataElement) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            nullable: !metaData.compulsory,
        });

        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withDefaultFieldContainer({ marginBottom: 0 })(
                                    withDefaultMessages()(TrueFalse),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.TRUE_ONLY]: (metaData: MetaDataElement) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
        });

        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withDefaultFieldContainer({ marginBottom: 0 })(
                                    withDefaultMessages()(TrueOnly),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.DATE]: (metaData: MetaDataElement) => {
        const props = createComponentProps({
            width: 350,
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
        });

        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withDefaultFieldContainer()(
                                    withDefaultMessages()(
                                        withInternalChangeHandler()(D2Date),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.DATETIME]: (metaData: MetaDataElement) => {
        const props = createComponentProps({
            dateWidth: 200,
            calendarWidth: 350,
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
        });

        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withDefaultFieldContainer()(
                                    withDefaultMessages()(
                                        withInternalChangeHandler()(D2DateTime),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.TIME]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.PERCENTAGE]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.URL]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.ORGANISATION_UNIT]: (metaData: MetaDataElement) => getBaseTextField(metaData),
    [elementTypes.FILE_RESOURCE]: (metaData: MetaDataElement) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            async: true,
        });
        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withDefaultFieldContainer()(
                                    withDefaultMessages()(
                                        withInternalChangeHandler()(D2File),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.IMAGE]: (metaData: MetaDataElement) => {
        const props = createComponentProps({
            label: metaData.formName,
            metaCompulsory: metaData.compulsory,
            async: true,
        });
        return createFieldProps({
            id: metaData.id,
            component:
                withGotoInterface()(
                    withHideCompatibility()(
                        withDefaultShouldUpdateInterface()(
                            withRequiredFieldCalculation()(
                                withDefaultFieldContainer()(
                                    withDefaultMessages()(
                                        withInternalChangeHandler()(D2Image),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            props,
        }, metaData);
    },
    [elementTypes.UNKNOWN]: (metaData: MetaDataElement) => null, // eslint-disable-line no-unused-vars
};

const getOptionSetComponent = (inputType: $Values<typeof optionSetInputTypes>) => {
    if (inputType === optionSetInputTypes.SELECT) {
        return withGotoInterface()(
            withHideCompatibility()(
                withDefaultShouldUpdateInterface()(
                    withRequiredFieldCalculation()(
                        withDefaultFieldContainer()(
                            withDefaultMessages()(
                                withConvertedOptionSet()(
                                    withSelectTranslations()(OptionsSelect),
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
                    withDefaultFieldContainer()(
                        withDefaultMessages()(
                            withConvertedOptionSet()(SelectBoxes),
                        ),
                    ),
                ),
            ),
        ),
    );
};

const optionSetField = (metaData: MetaDataElement) => {
    const props = createComponentProps({
        label: metaData.formName,
        optionSet: metaData.optionSet,
        nullable: !metaData.compulsory,
        required: metaData.compulsory,
    });

    return createFieldProps({
        id: metaData.id,
        component:
            // $FlowSuppress
            getOptionSetComponent(metaData.optionSet.inputType),
        props,
    }, metaData);
};

export default function buildField(metaData: MetaDataElement): ?Field {
    const type = metaData.type;
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        return fieldForTypes[elementTypes.UNKNOWN](metaData);
    }

    if (metaData.optionSet) {
        return optionSetField(metaData);
    }

    return fieldForTypes[type](metaData);
}

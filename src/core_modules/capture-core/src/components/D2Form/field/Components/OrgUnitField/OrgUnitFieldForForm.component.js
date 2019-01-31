// @flow
import {
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
    withFilterProps,
    SingleOrgUnitSelectField,
} from '../../../../FormFields/New';
import withRequiredFieldCalculation from '../../withRequiredFieldCalculation';
import withFormFieldOrgUnitsHandler from './withFormFieldOrgUnitsHandler';
import labelTypeClasses from '../../buildField.mod.css';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export default withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withDefaultFieldContainer()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: Object) =>
                                `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.orgUnitLabel}`,
                        })(
                            withFilterProps(getFilteredProps)(
                                withDisplayMessages()(
                                    withInternalChangeHandler()(
                                        withFormFieldOrgUnitsHandler()(SingleOrgUnitSelectField),
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

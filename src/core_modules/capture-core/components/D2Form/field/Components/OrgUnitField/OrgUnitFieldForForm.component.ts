import {
    withGotoInterface,
    withHideCompatibility,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
    withFilterProps,
    SingleOrgUnitSelectField,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
} from '../internal';
import { withFormFieldOrgUnitsHandler } from './withFormFieldOrgUnitsHandler';
import labelTypeClasses from '../../buildField.module.css';

const getFilteredProps = (props: any) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const OrgUnitFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDisabledFieldCalculation()(
            withRequiredFieldCalculation()(
                withCalculateMessages()(
                    withDefaultFieldContainer()(
                        withLabel({
                            onGetUseVerticalOrientation: (props: any) => props.formHorizontal,
                            onGetCustomFieldLabeClass: (props: any) =>
                                `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.orgUnitLabel}`,
                        })(
                            withFilterProps(getFilteredProps)(
                                withDisplayMessages()(
                                    withInternalChangeHandler()(
                                        withFormFieldOrgUnitsHandler()(
                                            SingleOrgUnitSelectField,
                                        ),
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

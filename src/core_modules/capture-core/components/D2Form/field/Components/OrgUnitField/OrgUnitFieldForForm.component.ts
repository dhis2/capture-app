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
    withSearchHelpMessage,
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
        withDefaultShouldUpdateInterface()(
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
                                        withSearchHelpMessage()(
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
        ),
    ),
);

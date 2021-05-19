// @flow
import {
    PolygonField,
    withGotoInterface,
    withHideCompatibility,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withCalculateMessages,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withFilterProps,
    withInternalChangeHandler,
    withStyledContainer,
} from '../../../../FormFields/New';
import {
    withRequiredFieldCalculation,
    withDisabledFieldCalculation,
} from '../internal';
import labelTypeClasses from '../../buildField.module.css';

const getFilteredProps = (props: Object) => {
    const { formHorizontal, fieldLabelMediaBasedClass, ...passOnProps } = props;
    return passOnProps;
};

export const PolygonFieldForForm = withGotoInterface()(
    withHideCompatibility()(
        withDefaultShouldUpdateInterface()(
            withDisabledFieldCalculation()(
                withRequiredFieldCalculation()(
                    withCalculateMessages()(
                        withFocusSaver()(
                            withDefaultFieldContainer()(
                                withStyledContainer(() => ({ paddingTop: 10, paddingBottom: 10 }))(
                                    withLabel({
                                        onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                                        onGetCustomFieldLabeClass: (props: Object) =>
                                            `${props.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
                                    })(
                                        withDisplayMessages()(
                                            withFilterProps(getFilteredProps)(
                                                withInternalChangeHandler()(PolygonField),
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

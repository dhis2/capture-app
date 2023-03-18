// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import {
    placements,
} from '../../DataEntry';
import {
    VirtualizedSelectField,
    withCalculateMessages,
    withDefaultFieldContainer,
    withDefaultShouldUpdateInterface,
    withDisplayMessages,
    withFilterProps,
    withInternalChangeHandler,
    withLabel,
} from '../../FormFields/New';
import { withDataEntryFields } from '../withDataEntryFields';
import { Section } from '../../Section/Section.component';
import { SectionHeaderSimple } from '../../Section';
import { getCategoryOptionsValidatorContainers } from './categoryOptions.validatorContainersGetter';
import labelTypeClasses from './aocFieldBuilderLabel.module.css';

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};

const getStyles = theme => ({
    wrapper: {
        maxWidth: theme.typography.pxToRem(892),
    },
});

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};
const baseComponentStylesVertical = {
    labelContainerStyle: {
        width: 150,
    },
    inputContainerStyle: {
        width: 150,
    },
};

function defaultFilterProps(props: Object) {
    const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
    return passOnProps;
}

const getBaseComponentProps = (props: Object) => ({
    fieldOptions: props.fieldOptions,
    formHorizontal: props.formHorizontal,
    styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: Object, componentProps: Object) => ({
    ...getBaseComponentProps(props),
    ...componentProps,
});

type SelectOption = {
    label: string,
    value: string,
};

type Props = {
    selectedOrgUnitId: ?string,
    onChange: (option: SelectOption) => void,
    initialValue?: ?SelectOption,
    ...CssClasses
};

type State = {
    options: ?Array<SelectOption>,
    prevOrgUnitId: ?string,
    open: boolean,
    selectedOption?: ?SelectOption
};

const getCategoryOptionsSettingsFn = () => {
    const categoryOptionsComponent =
        withCalculateMessages(overrideMessagePropNames)(
            withDefaultFieldContainer()(
                withDefaultShouldUpdateInterface()(
                    withLabel({
                        onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
                        onGetCustomFieldLabeClass: (props: Object) =>
                            `${props.fieldOptions && props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.selectLabel}`,
                    })(
                        withDisplayMessages()(
                            withInternalChangeHandler()(
                                withFilterProps(defaultFilterProps)(VirtualizedSelectField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    const categoryOptionsSettings = {
        getComponent: () => categoryOptionsComponent,
        getComponentProps: (props: Object) => createComponentProps(props, {
            options: [],
            onSetFocus: () => {},
            onRemoveFocus: () => {},
            selectedCategories: props.selectedCategories,
            selectedOrgUnitId: props.orgUnitId,
            required: true,
        }),
        getPropName: () => 'attributeCategoryOptions',
        getValidatorContainers: () => getCategoryOptionsValidatorContainers(),
        getMeta: () => ({
            placement: placements.TOP,
        }),
    };

    return categoryOptionsSettings;
};

class AOCFieldBuilderPlain extends React.Component<Props, State> {
    render() {
        const { programCategory, fields, classes } = this.props;
        const sectionFields = fields ?
            fields.map((fieldContainer, index) => (
                <React.Fragment
                    // using index for now
                    key={index} // eslint-disable-line
                >
                    { fieldContainer.field }
                </React.Fragment>
            ))
            : null;

        return (<div className={classes.wrapper}>
            <Section
                header={
                    <SectionHeaderSimple
                        title={programCategory?.displayName}
                    />
                }
            >
                {sectionFields}
            </Section>
        </div>);
    }
}


export const AOCFieldBuilderComponent = withStyles(getStyles)(
    withDataEntryFields(getCategoryOptionsSettingsFn())(AOCFieldBuilderPlain),
);

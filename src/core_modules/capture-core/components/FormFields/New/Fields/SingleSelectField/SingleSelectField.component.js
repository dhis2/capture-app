// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { SingleSelectField as SingleSelectFieldUI, SingleSelectOption } from '@dhis2/ui';
import { withFocusHandler } from './withFocusHandler';

const getStyles = () => ({
});

type Props = {
    value: ?string,
    onChange?: any,
    onBlur?: ?(value: any) => void,
    options: Array<{value: any, label: string}>,
    classes: {
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
    },
    disabled?: ?boolean,
    required?: ?boolean,
    placeholder?: ?string,
    filterable?: ?boolean,
    clearable?: ?boolean,
};

const SingleSelectComponent =
    withFocusHandler()(
        SingleSelectFieldUI,
    );

class SingleSelectFieldPlain extends Component<Props> {
    handleSelect = ({ selected }) => {
        this.props.onBlur && this.props.onBlur(selected);
    }

    render() {
        const {
            value,
            onBlur,
            onChange,
            options,
            classes,
            disabled,
            required,
            placeholder,
            filterable = true,
            clearable = true,
            ...passOnProps
        } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <SingleSelectComponent
                selected={value || ''}
                onChange={this.handleSelect}
                classes={classes}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                filterable={filterable}
                clearable={clearable}
                dataTest="single-select-field"
                {...passOnProps}
            >
                {options && options.map(option => (
                    <SingleSelectOption
                        key={option.value}
                        label={option.label}
                        value={option.value}
                    />
                ))}
            </SingleSelectComponent>
        );
    }
}

export const SingleSelectField = withStyles(getStyles)(SingleSelectFieldPlain);

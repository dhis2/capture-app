// @flow
import React, { Component } from 'react';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    label: theme.typography.formFieldTitle,
});

type Props = {
    onBlur: (value: any) => void,
    value?: ?string,
    label?: ?string,
    required?: ?boolean,
    classes: {
        label: string,
    },
    style?: ?Object,
    useSwitch?: ?boolean,
    useValueLabel?: ?boolean,
};

class D2TrueOnly extends Component<Props> {
    handleChange: (e: Object, checked: boolean) => void;
    materialUIContainerInstance: ?HTMLDivElement;
    labelClasses: Object;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.labelClasses = this.buildLabelClasses();
    }

    buildLabelClasses() {
        return {
            root: this.props.classes.label,
        };
    }

    handleChange(e: Object, checked: boolean) {
        let value;
        if (checked) {
            value = 'true';
        } else {
            value = null;
        }

        this.props.onBlur(value);
    }

    render() {
        const { onBlur, value, label, required, classes, style, useSwitch, useValueLabel, ...passOnProps } = this.props;
        const SelectComponent = useSwitch ? Switch : Checkbox;
        return (
            <div
                ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}
                style={style}
            >
                <FormControl
                    component="fieldset"
                >
                    {
                        (() => {
                            if (!label || useValueLabel) {
                                return null;
                            }

                            return (
                                <FormLabel
                                    component="label"
                                    required={!!required}
                                    classes={this.labelClasses}
                                    focused={false}
                                >
                                    {label}
                                </FormLabel>
                            );
                        })()
                    }
                    <FormGroup>
                        <FormControlLabel
                            label={useValueLabel ? label : ''}
                            control={
                                <SelectComponent
                                    {...passOnProps}
                                    onChange={this.handleChange}
                                    checked={!!value}
                                />
                            }
                        />
                    </FormGroup>
                </FormControl>
            </div>
        );
    }
}

export default withStyles(styles)(D2TrueOnly);

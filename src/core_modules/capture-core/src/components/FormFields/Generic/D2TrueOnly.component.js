// @flow
import React, { Component } from 'react';
import Switch from 'material-ui-next/Switch';
import { FormControl, FormLabel, FormGroup, FormControlLabel } from 'material-ui-next/Form';
import { withStyles } from 'material-ui-next/styles';

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
};

class D2TrueOnly extends Component<Props> {
    handleChange: (e: Object, checked: boolean) => void;
    materialUIContainerInstance: any;
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
        const { onBlur, value, label, required, classes, style, ...passOnProps } = this.props;

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
                            if (!label) {
                                return null;
                            }

                            return (
                                <FormLabel
                                    component="label"
                                    required={required}
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
                            control={
                                <Switch
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

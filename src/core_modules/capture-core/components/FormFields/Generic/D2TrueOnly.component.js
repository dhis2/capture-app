// @flow
import React, { Component } from 'react';
import { Checkbox, Switch, spacersNum } from '@dhis2/ui';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    label: theme.typography.formFieldTitle,
    checkbox: {
        marginTop: spacersNum.dp12,
        marginBottom: spacersNum.dp12,
    },
});

type Props = {
    onBlur: (value: any) => void,
    value?: ?string,
    label?: ?string,
    required?: ?boolean,
    classes: {
        label: string,
        checkbox: string,
    },
    style?: ?Object,
    useSwitch?: ?boolean,
    useValueLabel?: ?boolean,
};

class D2TrueOnlyPlain extends Component<Props> {
    handleChange: (e: Object) => void;
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

    handleChange(e: Object) {
        let value;

        if (e.checked) {
            value = 'true';
        } else {
            value = null;
        }

        this.props.onBlur(value);
    }

    render() {
        const { value, label, required, classes, style, useSwitch, useValueLabel } = this.props;

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
                    {useSwitch ?
                        <Switch checked={!!value} label={useValueLabel ? label : ''} onChange={this.handleChange} value={value} dense className={classes.checkbox} /> :
                        <Checkbox checked={!!value} label={useValueLabel ? label : ''} onChange={this.handleChange} value={value} dense className={classes.checkbox} />
                    }
                </FormControl>
            </div>
        );
    }
}

export const D2TrueOnly = withStyles(styles)(D2TrueOnlyPlain);

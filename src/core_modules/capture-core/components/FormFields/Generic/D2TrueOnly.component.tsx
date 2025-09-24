import React, { Component } from 'react';
import { Checkbox, Switch, spacersNum, FieldSet, Label } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

const styles: Readonly<any> = theme => ({
    label: theme.typography.formFieldTitle,
    checkbox: {
        marginTop: spacersNum.dp12,
        marginBottom: spacersNum.dp12,
    },
});

type OwnProps = {
    onBlur: (value: any) => void;
    value?: string;
    label?: string;
    required?: boolean;
    style?: Record<string, unknown>;
    useSwitch?: boolean;
    useValueLabel?: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

class D2TrueOnlyPlain extends Component<Props> {
    labelClasses: any;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.labelClasses = this.buildLabelClasses();
    }
    containerInstance: HTMLDivElement | null = null;

    buildLabelClasses() {
        return {
            root: this.props.classes.label,
        };
    }

    handleChange(e: any) {
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
                ref={(containerInstance) => { this.containerInstance = containerInstance; }}
                style={style}
            >
                <FieldSet>
                    {
                        (() => {
                            if (!label || useValueLabel) {
                                return null;
                            }

                            return (
                                <Label
                                    required={!!required}
                                    className={this.labelClasses.root}
                                >
                                    {label}
                                </Label>
                            );
                        })()
                    }
                    {useSwitch ?
                        <Switch checked={!!value} label={useValueLabel ? label : ''} onChange={this.handleChange} value={value} dense className={classes.checkbox} /> :
                        <Checkbox checked={!!value} label={useValueLabel ? label : ''} onChange={this.handleChange} value={value} dense className={classes.checkbox} />
                    }
                </FieldSet>
            </div>
        );
    }
}

export const D2TrueOnly = withStyles(styles)(D2TrueOnlyPlain);

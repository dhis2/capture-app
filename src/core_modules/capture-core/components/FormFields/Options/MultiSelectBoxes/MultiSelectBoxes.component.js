// @flow
/* eslint-disable react/no-array-index-key */
import React, { Component, type ComponentType } from 'react';
import { Checkbox, spacersNum } from '@dhis2/ui';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/core/styles';
import { multiOrientations } from './multiSelectBoxes.const';

const styles = theme => ({
    label: theme.typography.formFieldTitle,
    checkbox: {
        marginTop: spacersNum.dp8,
        marginBottom: spacersNum.dp16,
    },
});

type Props = {
    onBlur: (value: any) => void,
    options: Array<{text: string, value: any}>,
    label?: string,
    value?: any,
    orientation?: ?$Values<typeof multiOrientations>,
    required?: ?boolean,
    classes: {
        label: string,
        checkbox: string,
    }
};

class MultiSelectBoxesPlain extends Component<Props> {
    handleOptionChange: (e: Object, isChecked: boolean, value: any) => void;
    materialUIContainerInstance: any;
    checkedValues: ?Set<any>;
    goto: () => void;
    labelClasses: Object;

    constructor(props: Props) {
        super(props);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.labelClasses = this.buildLabelClasses();
    }

    buildLabelClasses() {
        return {
            root: this.props.classes.label,
        };
    }

    getBoxes() {
        const { options, classes } = this.props;
        return options.map(({ text, value }, index: number) => (
            <Checkbox
                key={index}
                checked={this.isChecked(value)}
                label={text}
                name={`multiSelectBoxes-${index}`}
                onChange={(e: Object) => { this.handleOptionChange(e, value); }}
                value={value}
                className={classes.checkbox}
                dense
            />
        ));
    }

    handleOptionChange(e: Object, value: any) {
        this.handleSelectUpdate(e.checked, value);
    }

    handleSelectUpdate(isChecked: boolean, value: any) {
        let emitValues = null;

        if (isChecked) {
            if (this.checkedValues) {
                this.checkedValues.add(value);

                // $FlowFixMe[incompatible-call] automated comment
                emitValues = Array.from(this.checkedValues);
            } else {
                emitValues = [value];
            }
        } else if (this.checkedValues) {
            this.checkedValues.delete(value);

            // $FlowFixMe[incompatible-use] automated comment
            if (this.checkedValues.size > 0) {
                // $FlowFixMe[incompatible-call] automated comment
                emitValues = Array.from(this.checkedValues);
            } else {
                emitValues = null;
            }
        }

        this.props.onBlur(emitValues);
    }

    setCheckedStatusForBoxes() {
        const value = this.props.value;
        if (value || value === false || value === 0) {
            // $FlowFixMe[prop-missing] automated comment
            this.checkedValues = new Set(value);
        } else {
            this.checkedValues = null;
        }
    }

    isChecked(value: any) {
        return !!(this.checkedValues && this.checkedValues.has(value));
    }

    renderHorizontal() {
        return (
            <FormGroup row>
                {this.getBoxes()}
            </FormGroup>
        );
    }

    renderVertical() {
        return (
            <FormGroup>
                {this.getBoxes()}
            </FormGroup>
        );
    }

    renderCheckboxes() {
        const orientation = this.props.orientation;
        return orientation === multiOrientations.VERTICAL ? this.renderVertical() : this.renderHorizontal();
    }

    render() {
        const { label, required } = this.props;

        this.setCheckedStatusForBoxes();

        return (
            <div ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}>
                <FormControl component="fieldset">
                    {
                        (() => {
                            if (!label) {
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
                    {this.renderCheckboxes()}
                </FormControl>
            </div>
        );
    }
}

export const MultiSelectBoxes: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(MultiSelectBoxesPlain);

// @flow
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

import { orientations } from './multiSelectBoxes.const';

import type { OptionSet, Option } from '../../../../metaData';

const styles = theme => ({
    label: theme.typography.formFieldTitle,
});

type Props = {
    onBlur: (value: any) => void,
    optionSet?: ?OptionSet,
    label?: string,
    value?: any,
    orientation?: ?$Values<typeof orientations>,
    required?: ?boolean,
    classes: {
        label: string,
    },
    style?: ?Object,
    passOnClasses?: ?Object,
};

class MultiSelectBoxes extends Component<Props> {
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

    getBoxes(passOnProps: Object) {
        const optionSet = this.props.optionSet;
        if (optionSet) {
            return optionSet.options.map((o: Option, index: number) => (
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={
                                (e: Object, isChecked: boolean) => { this.handleOptionChange(e, isChecked, o.value); }
                            }
                            checked={this.isChecked(o.value)}
                            {...passOnProps}
                        />
                    }
                    label={o.text}
                    key={index}
                />
            ));
        }
        return null;
    }

    handleOptionChange(e: Object, isChecked: boolean, value: any) {
        this.handleSelectUpdate(isChecked, value);
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

    renderHorizontal(passOnProps: Object) {
        return (
            <FormGroup row>
                {this.getBoxes(passOnProps)}
            </FormGroup>
        );
    }

    renderVertical(passOnProps: Object) {
        return (
            <FormGroup>
                {this.getBoxes(passOnProps)}
            </FormGroup>
        );
    }

    renderCheckboxes(passOnProps: Object) {
        const orientation = this.props.orientation;
        return orientation === orientations.VERTICAL ? this.renderVertical(passOnProps) : this.renderHorizontal(passOnProps);
    }

    render() {
        const { onBlur, optionSet, label, value, orientation, required, classes, style, passOnClasses, ...passOnProps } = this.props;  // eslint-disable-line no-unused-vars

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
                    {this.renderCheckboxes({ ...passOnProps, classes: passOnClasses })}
                </FormControl>
            </div>
        );
    }
}

export default withStyles(styles)(MultiSelectBoxes);

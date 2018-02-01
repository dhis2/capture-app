// @flow
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import Checkbox from 'material-ui-next/Checkbox';
import { FormControl, FormLabel, FormGroup, FormControlLabel } from 'material-ui-next/Form';
import { InputLabel } from 'material-ui-next/Input';
import { withStyles } from 'material-ui-next/styles';

import RadioOffIcon from 'material-ui/svg-icons/image/panorama-fish-eye';
import RadioOnIcon from 'material-ui/svg-icons/action/check-circle';

import isArray from 'd2-utilizr/lib/isArray';

import { orientation } from './optionsCheckboxes.constants';

import OptionSet from '../../../../metaData/OptionSet/OptionSet';
import Option from '../../../../metaData/OptionSet/Option';

// import gotoFn from '../Utils/gotoMixin';

const styles = theme => ({
    label: theme.typography.formFieldTitle,
});

type Props = {
    onBlur: (value: any) => void,
    optionSet?: ?OptionSet,
    label?: string,
    nullable?: boolean,
    multiSelect?: boolean,
    value?: any,
    orientation?: $Values<typeof orientation>,
    required?: ?boolean,
    error?: ?boolean,
    classes: Object,
};

class OptionsCheckboxesField extends Component<Props> {
    handleOptionChange: (e: Object, isChecked: boolean, value: any) => void;
    materialUIContainerInstance: any;
    checkedValues: ?Set<any>;
    goto: () => void;
    labelClasses: Object;

    constructor(props: Props) {
        super(props);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.labelClasses = this.buildLabelClasses();
        // this.goto = gotoFn;
    }

    buildLabelClasses() {
        return {
            root: this.props.classes.label,
        };
    }

    getCheckboxes() {
        const optionSet = this.props.optionSet;
        if (optionSet) {
            const otherProps = {};
            if (!this.props.multiSelect) {
                otherProps.checkedIcon = (<RadioOnIcon />);
                otherProps.icon = (<RadioOffIcon />);
            }

            return optionSet.options.map((o: Option, index: number) => (
                <FormControlLabel
                    control={
                        <Checkbox
                            {...otherProps}
                            onChange={(e: Object, isChecked: boolean) => { this.handleOptionChange(e, isChecked, o.value); }}
                            checked={this.isChecked(o.value)}                            
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
        this.props.multiSelect ? this.handleMultiSelectUpdate(isChecked, value) : this.handleSingleSelectUpdate(isChecked, value);
    }

    handleSingleSelectUpdate(isChecked: boolean, value: any) {
        if (isChecked === false && !this.props.nullable) {
            return;
        }
        this.props.onBlur(isChecked ? value : null);
    }

    handleMultiSelectUpdate(isChecked: boolean, value: any) {
        let emitValues = null;

        if (isChecked) {
            if (this.checkedValues) {
                this.checkedValues.add(value);
                emitValues = Array.from(this.checkedValues);
            } else {
                emitValues = [value];
            }
        } else if (this.checkedValues) {
            this.checkedValues.delete(value);
            if (this.checkedValues.size > 0) {
                emitValues = Array.from(this.checkedValues);
            } else {
                emitValues = null;
            }
        }

        this.props.onBlur(emitValues);
    }

    setCheckedStatusForBoxes() {
        const value = this.props.value;
        if (value || value === false) {
            if (!isArray(value)) {
                this.checkedValues = new Set().add(value);
            } else {
                this.checkedValues = new Set(value);
            }
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
                {this.getCheckboxes()}
            </FormGroup>
        );
    }

    renderVertical() {
        return (
            <FormGroup>
                {this.getCheckboxes()}
            </FormGroup>
        );
    }

    render() {
        const { label, required, error, classes } = this.props;

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
                                    required={required}
                                    error={error}
                                    classes={this.labelClasses}
                                    focused={false}
                                >
                                    {label}
                                </FormLabel>
                            );
                        })()
                    }
                    {this.renderHorizontal()}
                </FormControl>
            </div>
        );
    }
}

export default withStyles(styles)(OptionsCheckboxesField);

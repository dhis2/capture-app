// @flow
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import Checkbox from 'material-ui-next/Checkbox';  // using custom checkboxes because RadioButton can not be deselected
import { FormControl, FormLabel, FormGroup, FormControlLabel } from 'material-ui-next/Form';
import { withStyles } from 'material-ui-next/styles';

import RadioOffIcon from 'material-ui-icons/PanoramaFishEye';
import RadioOnIcon from 'material-ui-icons/CheckCircle';

import { orientations } from './singleSelectBoxes.const';

import OptionSet from '../../../../metaData/OptionSet/OptionSet';
import Option from '../../../../metaData/OptionSet/Option';

const styles = theme => ({
    label: theme.typography.formFieldTitle,
});

type Props = {
    onBlur: (value: any) => void,
    optionSet?: ?OptionSet,
    label?: string,
    nullable?: boolean,
    value?: any,
    orientation?: ?$Values<typeof orientations>,
    required?: ?boolean,
    classes: {
        label: string,
    },
    style?: ?Object,
};

class SingleSelectBoxes extends Component<Props> {
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
                            icon={
                                <RadioOffIcon />
                            }
                            checkedIcon={
                                <RadioOnIcon />
                            }
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
        this.handleSingleSelectUpdate(isChecked, value);
    }

    handleSingleSelectUpdate(isChecked: boolean, value: any) {
        if (isChecked === false && !this.props.nullable) {
            return;
        }
        this.props.onBlur(isChecked ? value : null);
    }

    setCheckedStatusForBoxes() {
        const value = this.props.value;
        if (value || value === false || value === 0) {
            this.checkedValues = new Set().add(value);
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

    renderBoxes() {
        const orientation = this.props.orientation;
        return orientation === orientations.VERTICAL ? this.renderVertical() : this.renderHorizontal();
    }

    render() {
        const { label, required, classes, style, orientation } = this.props;  // eslint-disable-line no-unused-vars

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
                                    classes={this.labelClasses}
                                    focused={false}
                                >
                                    {label}
                                </FormLabel>
                            );
                        })()
                    }
                    {this.renderBoxes()}
                </FormControl>
            </div>
        );
    }
}

export default withStyles(styles)(SingleSelectBoxes);

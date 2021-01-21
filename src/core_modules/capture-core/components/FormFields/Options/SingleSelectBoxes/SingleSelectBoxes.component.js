// @flow
/* eslint-disable react/no-array-index-key */
import React, { Component, type ComponentType } from 'react';
import Checkbox from '@material-ui/core/Checkbox';  // using custom checkboxes because RadioButton can not be deselected
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { colors } from '@dhis2/ui';
import { SingleSelectionCheckedIcon, SingleSelectionUncheckedIcon } from 'capture-ui/Icons';
import { singleOrientations } from './singleSelectBoxes.const';
import type { Props } from './singleSelectBoxes.types';

const styles = ({ typography, palette }) => ({
    label: typography.formFieldTitle,
    iconSelected: {
        fill: palette.secondary.main,
    },
    iconDeselected: {
        fill: colors.grey700,
    },
});

class SingleSelectBoxesPlain extends Component<Props> {
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

    getBoxes(passOnProps: ?Object) {
        const { options, classes } = this.props;
        return options.map(({ text, value }, index: number) => (
            <FormControlLabel
                control={
                    <Checkbox
                        onChange={
                            (e: Object, isChecked: boolean) => { this.handleOptionChange(e, isChecked, value); }
                        }
                        checked={this.isChecked(value)}
                        icon={<SingleSelectionUncheckedIcon className={classes.iconDeselected} />}
                        checkedIcon={<SingleSelectionCheckedIcon className={classes.iconSelected} />}
                        disableRipple
                        {...passOnProps}
                    />
                }
                label={text}
                key={index}
            />
        ));
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

    renderHorizontal(passOnProps: ?Object) {
        return (
            <FormGroup row>
                {this.getBoxes(passOnProps)}
            </FormGroup>
        );
    }

    renderVertical(passOnProps: ?Object) {
        return (
            <FormGroup>
                {this.getBoxes(passOnProps)}
            </FormGroup>
        );
    }

    renderBoxes(passOnProps: ?Object) {
        const orientation = this.props.orientation;
        return orientation === singleOrientations.VERTICAL ?
            this.renderVertical(passOnProps) :
            this.renderHorizontal(passOnProps);
    }

    render() {
        const {
            onBlur,
            options,
            label,
            nullable,
            value,
            orientation,
            required,
            classes,
            style,
            ...passOnProps
        } = this.props;  // eslint-disable-line no-unused-vars

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
                    {this.renderBoxes(passOnProps)}
                </FormControl>
            </div>
        );
    }
}

export const SingleSelectBoxes: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(SingleSelectBoxesPlain);

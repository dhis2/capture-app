// @flow
/* eslint-disable react/no-array-index-key */
import React, { Component, type ComponentType } from 'react';
import { Radio, colors, spacersNum, FieldSet, Label } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { singleOrientations } from './singleSelectBoxes.const';
import type { Props } from './singleSelectBoxes.types';
import { FormGroup } from '../FormGroup.component';


const styles = ({ typography, palette }) => ({
    label: typography.formFieldTitle,
    iconSelected: {
        fill: palette.secondary.main,
    },
    iconDeselected: {
        fill: colors.grey700,
    },
    radio: {
        marginTop: spacersNum.dp8,
        marginBottom: spacersNum.dp16,
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

    getBoxes() {
        const { options, classes } = this.props;
        return options.map(({ text, value }, index: number) => (
            <Radio
                key={index}
                checked={this.isChecked(value)}
                label={text}
                name={`singleSelectBoxes-${index}`}
                onChange={(e: Object) => { this.handleOptionChange(e, value); }}
                value={value}
                className={classes.radio}
                dense
            />
        ));
    }

    handleOptionChange(e: Object, value: any) {
        this.handleSingleSelectUpdate(e.checked, value);
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
        return orientation === singleOrientations.VERTICAL ?
            this.renderVertical() :
            this.renderHorizontal();
    }

    render() {
        const { label, required } = this.props;

        this.setCheckedStatusForBoxes();

        return (
            <div ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}>
                <FieldSet>
                    {
                        (() => {
                            if (!label) {
                                return null;
                            }

                            return (
                                <Label
                                    required={!!required}
                                    className={this.labelClasses}
                                >
                                    {label}
                                </Label>
                            );
                        })()
                    }
                    { this.renderBoxes() }
                </FieldSet>
            </div>
        );
    }
}

export const SingleSelectBoxes: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(SingleSelectBoxesPlain);

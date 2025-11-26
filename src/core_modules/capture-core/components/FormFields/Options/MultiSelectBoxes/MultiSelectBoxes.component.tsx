/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Checkbox, spacersNum, FieldSet, Label } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { multiOrientations } from './multiSelectBoxes.const';
import { FormGroup } from '../FormGroup.component';

const styles = (theme: any) => ({
    label: theme.typography.formFieldTitle,
    checkbox: {
        marginTop: spacersNum.dp8,
        marginBottom: spacersNum.dp16,
    },
});

type OwnProps = {
    onBlur: (value: any) => void;
    options: Array<{text: string; value: any}>;
    label?: string;
    value?: any;
    orientation?: typeof multiOrientations[keyof typeof multiOrientations] | null;
    required?: boolean | null;
};

type Props = OwnProps & WithStyles<typeof styles>;

class MultiSelectBoxesPlain extends Component<Props> {
    checkedValues!: Set<any> | null;
    labelClasses: any;

    constructor(props: Props) {
        super(props);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.labelClasses = this.buildLabelClasses();
    }


    getBoxes() {
        const { options, classes } = this.props;
        return options.map(({ text, value }, index: number) => (
            <Checkbox
                key={index}
                checked={this.isChecked(value)}
                label={text}
                name={`multiSelectBoxes-${index}`}
                onChange={(e: any) => { this.handleOptionChange(e, value); }}
                value={value}
                className={classes.checkbox}
                dense
            />
        ));
    }

    setCheckedStatusForBoxes() {
        const value = this.props.value;
        if (value || value === false || value === 0) {
            this.checkedValues = new Set(value);
        } else {
            this.checkedValues = null;
        }
    }

    buildLabelClasses() {
        return {
            root: this.props.classes.label,
        };
    }

    handleSelectUpdate(isChecked: boolean, value: any) {
        let emitValues: any = null;

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

    handleOptionChange(e: any, value: any) {
        this.handleSelectUpdate((e as any).checked, value);
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
            <div>
                <FieldSet>
                    {
                        (() => {
                            if (!label) {
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
                    {this.renderCheckboxes()}
                </FieldSet>
            </div>
        );
    }
}

export const MultiSelectBoxes = withStyles(styles)(MultiSelectBoxesPlain);

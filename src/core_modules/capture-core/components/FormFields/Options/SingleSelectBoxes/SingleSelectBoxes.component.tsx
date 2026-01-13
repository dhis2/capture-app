/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Radio, colors, spacersNum, FieldSet, Label } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { singleOrientations } from './singleSelectBoxes.const';
import type { Props as OwnProps } from './singleSelectBoxes.types';
import { FormGroup } from '../FormGroup.component';


const styles = ({ typography, palette }: any) => ({
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

type Props = OwnProps & WithStyles<typeof styles>;

class SingleSelectBoxesPlain extends Component<Props> {
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
            <Radio
                key={index}
                checked={this.isChecked(value)}
                label={text}
                name={`singleSelectBoxes-${index}`}
                onChange={(e: any) => { this.handleOptionChange(e, value); }}
                value={value}
                className={classes.radio}
                dense
            />
        ));
    }

    setCheckedStatusForBoxes() {
        const value = this.props.value;
        if (value || value === false || value === 0) {
            this.checkedValues = new Set().add(value);
        } else {
            this.checkedValues = null;
        }
    }

    buildLabelClasses() {
        return {
            root: this.props.classes.label,
        };
    }

    handleSingleSelectUpdate(isChecked: boolean, value: any) {
        if (isChecked === false && !this.props.nullable) {
            return;
        }
        this.props.onBlur(isChecked ? value : null);
    }

    handleOptionChange(e: any, value: any) {
        this.handleSingleSelectUpdate((e as any).checked, value);
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
                    { this.renderBoxes() }
                </FieldSet>
            </div>
        );
    }
}

export const SingleSelectBoxes = withStyles(styles)(SingleSelectBoxesPlain);

// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import D2TrueFalse from '../../FormFields/Generic/D2TrueFalse.component';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import { orientations } from '../../FormFields/Options/MultiSelectBoxes/multiSelectBoxes.const';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';

import type { UpdatableFilterContent } from '../filters.types';

const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        marginRight: theme.typography.pxToRem(-24),
    },
});

type Value = ?Array<any>;

type Props = {
    type: $Values<typeof elementTypes>,
    value: Value,
    onCommitValue: (value: Value) => void,
    classes: {
        selectBoxesContainer: string,
    },
};
// $FlowSuppress
class BooleanFilter extends Component<Props> implements UpdatableFilterContent<Value> {
    static getRequestData(values: Array<any>, type: $Values<typeof elementTypes>) {
        const valueString = values
            .map((value) => {
                const clientValue = convertToClientValue(value, type);
                const filterValue = convertToServerValue(clientValue, type); // should work for now
                return filterValue;
            })
            .join(';');

        return `in:${valueString}`;
    }

    static getAppliedText(values: Array<any>, optionSet: ?OptionSet) {
        const valueString = values
            .map((value) => {
                const text = optionSet ? optionSet.getOptionText(value) : value;
                return text;
            })
            .join(', ');

        return valueString;
    }

    booleanFieldInstance: ?D2TrueFalse;
    onGetUpdateData() {
        const value = this.props.value;

        if (!value) {
            return null;
        }

        return {
            requestData: BooleanFilter.getRequestData(value, this.props.type),
            appliedText:
                BooleanFilter.getAppliedText(
                    value,
                    this.booleanFieldInstance && this.booleanFieldInstance.optionSet),
        };
    }

    onIsValid() { //eslint-disable-line
        return true;
    }

    setBooleanFieldInstance = (instance: ?D2TrueFalse) => {
        this.booleanFieldInstance = instance;
    }

    render() {
        const { onCommitValue, value, classes } = this.props;

        return (
            <div
                className={classes.selectBoxesContainer}
            >
                <D2TrueFalse
                    ref={this.setBooleanFieldInstance}
                    allowMultiple
                    value={value}
                    onBlur={onCommitValue}
                    orientation={orientations.VERTICAL}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(BooleanFilter);

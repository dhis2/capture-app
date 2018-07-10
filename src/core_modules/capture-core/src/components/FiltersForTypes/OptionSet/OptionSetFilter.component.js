// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import MultiSelectBoxes from '../../FormFields/Options/MultiSelectBoxes/MultiSelectBoxes.component';
import { orientations } from '../../FormFields/Options/MultiSelectBoxes/multiSelectBoxes.const';
import withConvertedOptionSet from '../../FormFields/Options/withConvertedOptionSet';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';
import { convertValue as convertToFormValue } from '../../../converters/clientToForm';

import type{ UpdatableFilterContent } from '../filters.types';

const MultiSelectBoxesWithConvertedOptionSet = withConvertedOptionSet()(MultiSelectBoxes);

const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        maxHeight: theme.typography.pxToRem(250),
        overflowY: 'auto',
        marginRight: theme.typography.pxToRem(-24),
    },
});

type Value = ?Array<any>;

type Props = {
    type: $Values<typeof elementTypes>,
    optionSet: OptionSet,
    value: Value,
    onCommitValue: (value: Value) => void,
    classes: {
        selectBoxesContainer: string,
    },
};
// $FlowSuppress
class OptionSetFilter extends Component<Props> implements UpdatableFilterContent<Value> {
    static getRequestData(values: Array<any>, type: $Values<typeof elementTypes>) {
        const valueString = values
            .map((value) => {
                const clientValue = convertToClientValue(type, value);
                const filterValue = convertToServerValue(type, clientValue); // should work for now
                return filterValue;
            })
            .join(',');

        return `in:${valueString}`;
    }

    static getAppliedText(values: Array<any>, type: $Values<typeof elementTypes>) {
        const valueString = values
            .map((value) => {
                const clientValue = convertToClientValue(type, value);
                return convertToFormValue(type, clientValue);
            })
            .join(', ');

        return valueString;
    }

    onGetUpdateData() {
        const value = this.props.value;

        if (!value) {
            return null;
        }

        return {
            requestData: OptionSetFilter.getRequestData(value, this.props.type),
            appliedText: OptionSetFilter.getAppliedText(value, this.props.type),
        };
    }

    onIsValid() { //eslint-disable-line
        return true;
    }

    render() {
        const { onCommitValue, optionSet, value, classes } = this.props;

        return (
            <div
                className={classes.selectBoxesContainer}
            >
                <MultiSelectBoxesWithConvertedOptionSet
                    optionSet={optionSet}
                    value={value}
                    onBlur={onCommitValue}
                    orientation={orientations.VERTICAL}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(OptionSetFilter);

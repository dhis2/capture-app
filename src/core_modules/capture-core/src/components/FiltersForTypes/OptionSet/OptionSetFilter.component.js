// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import SelectBoxes from '../../FormFields/Options/SelectBoxes/SelectBoxes.component';
import { orientations } from '../../FormFields/Options/MultiSelectBoxes/multiSelectBoxes.const';
import withConvertedOptionSet from '../../FormFields/Options/withConvertedOptionSet';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';

import type{ UpdatableFilterContent } from '../filters.types';

const SelectBoxesWithConvertedOptionSet = withConvertedOptionSet()(SelectBoxes);

const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        maxHeight: theme.typography.pxToRem(250),
        overflowY: 'auto',
        marginRight: theme.typography.pxToRem(-24),
    },
});


type Props = {
    type: $Values<typeof elementTypes>,
    optionSet: OptionSet,
    value: any,
    onCommitValue: (value: any) => void,
    classes: {
        selectBoxesContainer: string,
    },
};
// $FlowSuppress
class OptionSetFilter extends Component<Props> implements UpdatableFilterContent<Value> {
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

    static getAppliedText(values: Array<any>, optionSet: OptionSet) {
        const valueString = values
            .map((value) => {
                const text = optionSet.getOptionText(value);
                return text;
            })
            .join(', ');

        return valueString;
    }

    onGetUpdateData() {
        const { value, singleSelect, optionSet, type } = this.props;

        if (!value) {
            return null;
        }

        if (singleSelect) {
            return {
                requestData: `eq:${value}`,
                appliedText: optionSet.getOptionText(value),
            };
        }

        return {
            requestData: OptionSetFilter.getRequestData(value, type),
            appliedText: OptionSetFilter.getAppliedText(value, optionSet),
        };
    }

    onIsValid() { //eslint-disable-line
        return true;
    }

    render() {
        const { onCommitValue, optionSet, value, classes, singleSelect } = this.props;

        return (
            <div
                className={classes.selectBoxesContainer}
            >
                <SelectBoxesWithConvertedOptionSet
                    optionSet={optionSet}
                    value={value}
                    onBlur={onCommitValue}
                    orientation={orientations.VERTICAL}
                    multiSelect={!singleSelect}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(OptionSetFilter);

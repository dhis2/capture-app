// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import SelectBoxes from '../../FormFields/Options/SelectBoxes/SelectBoxes.component';
import { orientations } from '../../FormFields/Options/MultiSelectBoxes/multiSelectBoxes.const';
import withConvertedOptionSet from '../../FormFields/Options/withConvertedOptionSet';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import { getSingleSelectOptionSetFilterData, getMultiSelectOptionSetFilterData } from './getOptionSetFilterData';
import type { UpdatableFilterContent } from '../filters.types';

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
    onGetUpdateData() {
        const { value, singleSelect, optionSet, type } = this.props;

        if (!value) {
            return null;
        }

        if (singleSelect) {
            return getSingleSelectOptionSetFilterData(value, optionSet);
        }

        return getMultiSelectOptionSetFilterData(value, type, optionSet);
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

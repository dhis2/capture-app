// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import D2TrueFalse from '../../FormFields/Generic/D2TrueFalse.component';
import { orientations } from '../../FormFields/Options/MultiSelectBoxes/multiSelectBoxes.const';
import { getBooleanFilterData } from './booleanFilterDataGetter';
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
    booleanFieldInstance: ?D2TrueFalse;
    onGetUpdateData() {
        const value = this.props.value;

        if (!value) {
            return null;
        }
        const optionSet = this.booleanFieldInstance && this.booleanFieldInstance.optionSet;
        return getBooleanFilterData(value, this.props.type, optionSet);
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

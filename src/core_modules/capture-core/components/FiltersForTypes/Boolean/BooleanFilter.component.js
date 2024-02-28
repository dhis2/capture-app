// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { D2TrueFalse } from '../../FormFields/Generic/D2TrueFalse.component';
import { orientations } from '../../FormFields/Options/SelectBoxes'; // TODO: Refactor
import {
    getMultiSelectBooleanFilterData,
    getSingleSelectBooleanFilterData,
} from './booleanFilterDataGetter';
import type { UpdatableFilterContent } from '../types';

const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        marginRight: theme.typography.pxToRem(-24),
    },
});

type Value = ?Array<any> | string;

type Props = {
    value: Value,
    onCommitValue: (value: Value) => void,
    allowMultiple: boolean,
    classes: {
        selectBoxesContainer: string,
    },
};
// $FlowSuppress
// $FlowFixMe[incompatible-variance] automated comment
class BooleanFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
    booleanFieldInstance: ?D2TrueFalse;

    onGetUpdateData() {
        const { value, allowMultiple } = this.props;

        if (!value && value !== false) {
            return null;
        }

        if (!allowMultiple) {
            return getSingleSelectBooleanFilterData(value);
        }

        return getMultiSelectBooleanFilterData(value);
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
                    allowMultiple={this.props.allowMultiple}
                    value={value}
                    onBlur={onCommitValue}
                    orientation={orientations.VERTICAL}
                />
            </div>
        );
    }
}

export const BooleanFilter = withStyles(getStyles)(BooleanFilterPlain);

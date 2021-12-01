// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import type { UpdatableFilterContent } from '../types';
import { orientations } from '../../FormFields/Options/SelectBoxes'; // TODO: Refactor
import { D2TrueFalse } from '../../FormFields/Generic/D2TrueFalse.component';
import { getBooleanFilterData } from './booleanFilterDataGetter';

const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        marginRight: theme.typography.pxToRem(-24),
    },
});

type Value = ?Array<any>;

type Props = {
    value: Value,
    onCommitValue: (value: Value) => void,
    classes: {
        selectBoxesContainer: string,
    },
};
// $FlowSuppress
// $FlowFixMe[incompatible-variance] automated comment
class BooleanFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
    booleanFieldInstance: ?D2TrueFalse;

    onGetUpdateData() {
        const value = this.props.value;

        if (!value) {
            return null;
        }

        return getBooleanFilterData(value);
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

export const BooleanFilter = withStyles(getStyles)(BooleanFilterPlain);

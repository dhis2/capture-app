import React, { Component } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { orientations } from '../../FormFields/Options/SelectBoxes';
import { D2TrueFalse } from '../../FormFields/Generic/D2TrueFalse.component';
import {
    getMultiSelectBooleanFilterData,
    getSingleSelectBooleanFilterData,
} from './booleanFilterDataGetter';
import type { UpdatableFilterContent } from '../types';

const getStyles: Readonly<any> = (theme: Theme) => ({
    selectBoxesContainer: {
        marginRight: theme.typography.pxToRem(-24),
    },
});

type Value = Array<any> | string | boolean | null;

type PlainProps = {
    value?: Value;
    onCommitValue: (value: Value) => void;
    allowMultiple: boolean;
};

type Props = PlainProps & WithStyles<typeof getStyles>;

class BooleanFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
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

    setBooleanFieldInstance = (instance: D2TrueFalse | null) => {
        this.booleanFieldInstance = instance;
    }

    booleanFieldInstance: D2TrueFalse | null = null;

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
                    orientation={'VERTICAL'}
                />
            </div>
        );
    }
}

export const BooleanFilter = withStyles(getStyles)(BooleanFilterPlain) as React.ComponentType<PlainProps>;

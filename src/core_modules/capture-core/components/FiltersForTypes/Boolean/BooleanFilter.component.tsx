import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { orientations } from '../../FormFields/Options/SelectBoxes';
import { D2TrueFalse } from '../../FormFields/Generic/D2TrueFalse.component';
import {
    getMultiSelectBooleanFilterData,
    getSingleSelectBooleanFilterData,
} from './booleanFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

const getStyles: Readonly<any> = (theme: any) => ({
    selectBoxesContainer: {
        marginInlineEnd: theme.typography.pxToRem(-24),
    },
});

type Value = Array<any> | string | boolean | null;

type PlainProps = {
    value?: Value;
    onCommitValue: (value: Value) => void;
    onUpdate?: (commitValue?: Value) => void;
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

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ?? null);
    });

    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ?? null);
    });

    onIsValid() { //eslint-disable-line
        return true;
    }

    handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && this.props.onUpdate) {
            this.props.onUpdate(this.props.value);
        }
    };

    setBooleanFieldInstance = (instance: D2TrueFalse | null) => {
        this.booleanFieldInstance = instance;
    }

    booleanFieldInstance: D2TrueFalse | null = null;

    render() {
        const { onCommitValue, value, classes } = this.props;
        const booleanValue = typeof value === 'string' && isEmptyValueFilter(value) ? undefined : value;

        return (
            <div>
                <EmptyValueFilterCheckboxes
                    value={typeof value === 'string' ? value : undefined}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <div
                    className={classes.selectBoxesContainer}
                    onKeyDownCapture={this.handleKeyDown}
                >
                    <D2TrueFalse
                        ref={this.setBooleanFieldInstance}
                        allowMultiple={this.props.allowMultiple}
                        value={booleanValue}
                        onBlur={onCommitValue}
                        orientation={orientations.VERTICAL}
                    />
                </div>
            </div>
        );
    }
}

export const BooleanFilter = withStyles(getStyles)(BooleanFilterPlain) as React.ComponentType<PlainProps>;

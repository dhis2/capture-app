import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { SelectBoxes, orientations } from '../../FormFields/Options/SelectBoxes';
import { getSingleSelectOptionSetFilterData, getMultiSelectOptionSetFilterData } from './optionSetFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { PlainProps, Value } from './OptionSetFilter.types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

export const getStyles = (theme: any) => ({
    selectBoxesContainer: {
        maxHeight: theme.typography.pxToRem(250),
        overflowY: 'auto',
    },
    selectBoxesInnerContainer: {
        marginInlineStart: 12,
    },
}) as const;

type Props = PlainProps & WithStyles<typeof getStyles>;

class OptionSetFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData() {
        const { value, singleSelect } = this.props;

        if (!value) {
            return null;
        }

        if (singleSelect) {
            return getSingleSelectOptionSetFilterData(value);
        }

        return getMultiSelectOptionSetFilterData(value);
    }

    onIsValid() { //eslint-disable-line
        return true;
    }

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ?? null);
    });

    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ?? null);
    });

    render() {
        const { onCommitValue, options, value, classes, singleSelect } = this.props;
        const optionSetValue = typeof value === 'string' && isEmptyValueFilter(value) ? undefined : value;

        return (
            <div>
                <EmptyValueFilterCheckboxes
                    value={typeof value === 'string' ? value : undefined}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <div
                    className={classes.selectBoxesContainer}
                >
                    <div className={classes.selectBoxesInnerContainer}>
                        <SelectBoxes
                            options={options}
                            value={optionSetValue}
                            onBlur={onCommitValue}
                            orientation={orientations.VERTICAL}
                            multiSelect={!singleSelect}
                            nullable
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export const OptionSetFilter = withStyles(getStyles)(OptionSetFilterPlain);

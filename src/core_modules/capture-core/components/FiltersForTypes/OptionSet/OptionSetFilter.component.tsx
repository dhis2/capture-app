import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { SelectBoxes, orientations } from '../../FormFields/Options/SelectBoxes';
import { getSingleSelectOptionSetFilterData, getMultiSelectOptionSetFilterData } from './optionSetFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { PlainProps, Value } from './OptionSetFilter.types';

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

    render() {
        const { onCommitValue, options, value, classes, singleSelect } = this.props;

        return (
            <div
                className={classes.selectBoxesContainer}
            >
                <div className={classes.selectBoxesInnerContainer}>
                    <SelectBoxes
                        options={options}
                        value={value}
                        onBlur={onCommitValue}
                        orientation={orientations.VERTICAL}
                        multiSelect={!singleSelect}
                        nullable
                    />
                </div>
            </div>
        );
    }
}

export const OptionSetFilter = withStyles(getStyles)(OptionSetFilterPlain);

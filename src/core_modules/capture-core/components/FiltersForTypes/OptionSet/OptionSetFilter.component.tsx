import React, { Component } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { SelectBoxes, orientations } from '../../FormFields/Options/SelectBoxes';
import { getSingleSelectOptionSetFilterData, getMultiSelectOptionSetFilterData } from './optionSetFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { PlainProps, Value } from './OptionSetFilter.types';

export const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        maxHeight: theme.typography.pxToRem(250),
        overflowY: 'auto' as const,
    },
    selectBoxesInnerContainer: {
        marginLeft: 12,
    },
});

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
                        optionSet={null}
                    />
                </div>
            </div>
        );
    }
}

export const OptionSetFilter = withStyles(getStyles)(OptionSetFilterPlain);

import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { orientations } from '../../FormFields/Options/SelectBoxes';
import { D2TrueFalse } from '../../FormFields/Generic/D2TrueFalse.component';
import { getBooleanFilterData } from './booleanFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import { WithEmptyValueFilter } from '../EmptyValue';
import type { PlainProps, Value } from './boolean.types';

const getStyles: Readonly<any> = (theme: any) => ({
    selectBoxesContainer: {
        marginInlineEnd: theme.typography.pxToRem(-24),
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

class BooleanFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData() {
        const { value } = this.props;

        if (!value && value !== false) {
            return null;
        }

        return getBooleanFilterData(value);
    }

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

        return (
            <WithEmptyValueFilter
                value={value}
                onCommitValue={onCommitValue}
                disabled={this.props.disableEmptyValueFilter}
            >
                {filteredValue => (
                    <div
                        className={classes.selectBoxesContainer}
                        onKeyDownCapture={this.handleKeyDown}
                    >
                        <D2TrueFalse
                            ref={this.setBooleanFieldInstance}
                            allowMultiple={this.props.allowMultiple}
                            value={filteredValue}
                            onBlur={onCommitValue}
                            orientation={orientations.VERTICAL}
                        />
                    </div>
                )}
            </WithEmptyValueFilter>
        );
    }
}

export const BooleanFilter = withStyles(getStyles)(BooleanFilterPlain) as React.ComponentType<PlainProps>;

import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, WithStyles } from 'capture-core-utils/styles';

import { D2TrueOnly } from '../../FormFields/Generic/D2TrueOnly.component';
import { orientations } from '../../FormFields/Options/SelectBoxes';
import { getTrueOnlyFilterData } from './trueOnlyFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { PlainProps, Value } from './TrueOnly.types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

export const getStyles = (theme: any) => ({
    selectBoxesContainer: {
        marginInlineEnd: theme.typography.pxToRem(-24),
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

class TrueOnlyFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData() {
        const value = this.props.value;

        if (typeof value === 'string' && isEmptyValueFilter(value)) {
            return getTrueOnlyFilterData(value);
        }

        if (!value) {
            return null;
        }

        return getTrueOnlyFilterData();
    }

    onIsValid = () => true

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ? [value] : null);
    });

    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ? [value] : null);
    });

    handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && this.props.onUpdate) {
            this.props.onUpdate(this.props.value);
        }
    };

    handleTrueOnlyBlur = (value: string | null | undefined) => {
        this.props.onCommitValue(value ? [value] : null);
    }

    render() {
        const { value, classes } = this.props;
        const emptyValueStr = Array.isArray(value) && value.length === 1 && isEmptyValueFilter(value[0])
            ? value[0] : undefined;
        const trueOnlyValue = emptyValueStr ? undefined : value;

        return (
            <div>
                <EmptyValueFilterCheckboxes
                    value={emptyValueStr}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <div
                    className={classes.selectBoxesContainer}
                    onKeyDownCapture={this.handleKeyDown}
                >
                    <D2TrueOnly
                        label={i18n.t('Yes')}
                        useValueLabel
                        value={trueOnlyValue}
                        onBlur={this.handleTrueOnlyBlur}
                        orientation={orientations.VERTICAL}
                    />
                </div>
            </div>
        );
    }
}

export const TrueOnlyFilter = withStyles(getStyles)(TrueOnlyFilterPlain);

import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, WithStyles } from 'capture-core-utils/styles';

import { D2TrueOnly } from '../../FormFields/Generic/D2TrueOnly.component';
import { orientations } from '../../FormFields/Options/SelectBoxes';
import { getTrueOnlyFilterData } from './trueOnlyFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { TrueOnlyFilterProps, Value } from './trueOnly.types';
import { WithEmptyValueFilter } from '../EmptyValue';

export const getStyles = (theme: any) => ({
    selectBoxesContainer: {
        marginInlineEnd: theme.typography.pxToRem(-24),
    },
});

type Props = TrueOnlyFilterProps & WithStyles<typeof getStyles>;

class TrueOnlyFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData() {
        const { value } = this.props;
        return getTrueOnlyFilterData(Array.isArray(value) ? value[0] : value);
    }

    onIsValid = () => true

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

        return (
            <WithEmptyValueFilter
                value={value}
                onCommitValue={this.props.onCommitValue}
                disabled={this.props.disableEmptyValueFilter}
            >
                {filteredValue => (
                    <div
                        className={classes.selectBoxesContainer}
                        onKeyDownCapture={this.handleKeyDown}
                    >
                        <D2TrueOnly
                            label={i18n.t('Yes')}
                            useValueLabel
                            value={filteredValue}
                            onBlur={this.handleTrueOnlyBlur}
                            orientation={orientations.VERTICAL}
                        />
                    </div>
                )}
            </WithEmptyValueFilter>
        );
    }
}

export const TrueOnlyFilter = withStyles(getStyles)(TrueOnlyFilterPlain);

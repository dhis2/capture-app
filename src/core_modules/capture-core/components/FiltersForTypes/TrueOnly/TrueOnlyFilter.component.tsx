import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, WithStyles } from 'capture-core-utils/styles';

import { D2TrueOnly } from '../../FormFields/Generic/D2TrueOnly.component';
import { orientations } from '../../FormFields/Options/SelectBoxes';
import { getTrueOnlyFilterData } from './trueOnlyFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { PlainProps, Value } from './TrueOnly.types';

export const getStyles = (theme: any) => ({
    selectBoxesContainer: {
        marginRight: theme.typography.pxToRem(-24),
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

class TrueOnlyFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData() {
        const value = this.props.value;

        if (!value) {
            return null;
        }

        return getTrueOnlyFilterData();
    }

    onIsValid = () => true

    handleTrueOnlyBlur = (value: string | null | undefined) => {
        this.props.onCommitValue(value ? [value] : null);
    }

    render() {
        const { value, classes } = this.props;

        return (
            <div
                className={classes.selectBoxesContainer}
            >
                <D2TrueOnly
                    label={i18n.t('Yes')}
                    useValueLabel
                    value={value}
                    onBlur={this.handleTrueOnlyBlur}
                    orientation={orientations.VERTICAL}
                />
            </div>
        );
    }
}

export const TrueOnlyFilter = withStyles(getStyles)(TrueOnlyFilterPlain);

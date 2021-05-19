// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { D2TrueOnly } from '../../FormFields/Generic/D2TrueOnly.component';
import { orientations } from '../../FormFields/Options/SelectBoxes';  // TODO: Refactor
import { getTrueOnlyFilterData } from './trueOnlyFilterDataGetter';
import type { UpdatableFilterContent } from '../types';

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
class TrueOnlyFilterPlain extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData() {
        const value = this.props.value;

        if (!value) {
            return null;
        }

        return getTrueOnlyFilterData();
    }

    onIsValid() { //eslint-disable-line
        return true;
    }

    handleTrueOnlyBlur = (value: ?string) => {
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

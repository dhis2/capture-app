// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import D2TrueOnly from '../../FormFields/Generic/D2TrueOnly.component';
import { orientations } from '../../FormFields/Options/MultiSelectBoxes/multiSelectBoxes.const';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';

import type { UpdatableFilterContent } from '../filters.types';

const getStyles = (theme: Theme) => ({
    selectBoxesContainer: {
        marginRight: theme.typography.pxToRem(-24),
    },
});

type Value = ?Array<any>;

type Props = {
    type: $Values<typeof elementTypes>,
    value: Value,
    onCommitValue: (value: Value) => void,
    classes: {
        selectBoxesContainer: string,
    },
};
// $FlowSuppress
class TrueOnlyFilter extends Component<Props> implements UpdatableFilterContent<Value> {
    static getRequestData(values: Array<any>, type: $Values<typeof elementTypes>) {
        const valueString = values
            .map((value) => {
                const clientValue = convertToClientValue(type, value);
                const filterValue = convertToServerValue(type, clientValue); // should work for now
                return filterValue;
            })
            .join(',');

        return `in:[${valueString}]`;
    }

    static getAppliedText(values: Array<any>) {
        const valueString = values
            .map(() => {
                const text = i18n.t('Yes');
                return text;
            })
            .join(', ');

        return valueString;
    }

    onGetUpdateData() {
        const value = this.props.value;

        if (!value) {
            return null;
        }

        return {
            requestData: TrueOnlyFilter.getRequestData(value, this.props.type),
            appliedText: TrueOnlyFilter.getAppliedText(value),
        };
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

export default withStyles(getStyles)(TrueOnlyFilter);

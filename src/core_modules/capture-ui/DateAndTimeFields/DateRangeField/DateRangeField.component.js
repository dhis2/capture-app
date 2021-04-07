// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { DateField } from '../DateField/Date.component';
import { withFocusSaver } from '../../HOC/withFocusSaver';
import { withShrinkLabel } from '../../HOC/withShrinkLabel';
import defaultClasses from './dateRangeField.module.css';
import { InnerMessage } from '../../internal/InnerMessage/InnerMessage.component';


const RangeInputField = withFocusSaver()(withShrinkLabel()(DateField));

type DateRangeValue = {
    from?: ?string,
    to?: ?string,
}

type Props = {
    value: DateRangeValue,
    onBlur: (value: ?DateRangeValue, opts: any) => void,
    onChange: (value: ?DateRangeValue) => void,
    classes: Object,
    innerMessage?: ?Object,
}

const inputKeys = {
    FROM: 'from',
    TO: 'to',
};


export class DateRangeField extends React.Component<Props> {
    touchedFields: Set<string>;
    constructor(props: Props) {
        super(props);
        this.touchedFields = new Set();
    }

    getValue = () => this.props.value || {};

    handleFromChange = (value: string) => {
        this.props.onChange({
            from: value,
            to: this.getValue().to,
        });
    }

    handleToChange = (value: string) => {
        this.props.onChange({
            from: this.getValue().from,
            to: value,
        });
    }

    handleFromBlur = (value: string) => {
        this.touchedFields.add('fromTouched');
        const currentValue = this.getValue();
        this.handleBlur({
            from: value,
            to: currentValue.to,
        }, !!currentValue.to);
    }

    handleToBlur = (value: string) => {
        this.touchedFields.add('toTouched');
        const currentValue = this.getValue();
        this.handleBlur({
            from: currentValue.from,
            to: value,
        }, !!currentValue.from);
    }

    handleBlur = (value: DateRangeValue, otherFieldHasValue: boolean) => {
        const touched = this.touchedFields.size === 2;
        if (!value.from && !value.to) {
            this.props.onBlur(undefined, {
                touched,
            });
            return;
        }
        this.props.onBlur(value, {
            touched: touched || otherFieldHasValue,
        });
    }

    getInnerMessage = (key: string) => {
        const { classes, innerMessage } = this.props;
        return (
            <InnerMessage
                classes={classes}
                innerMessage={innerMessage}
                messageKey={key}
            />
        );
    }

    render() {
        const { onBlur, onChange, value, innerMessage, ...passOnProps } = this.props;
        const fromValue = value && value.from ? value.from : '';
        const toValue = value && value.to ? value.to : '';
        return (
            <div className={defaultClasses.container}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <RangeInputField
                    label={i18n.t('From')}
                    value={fromValue}
                    onBlur={this.handleFromBlur}
                    onChange={this.handleFromChange}
                    {...passOnProps}
                />
                {this.getInnerMessage(inputKeys.FROM)}
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <RangeInputField
                    label={i18n.t('To')}
                    value={toValue}
                    onBlur={this.handleToBlur}
                    onChange={this.handleToChange}
                    {...passOnProps}
                />
                {this.getInnerMessage(inputKeys.TO)}
            </div>
        );
    }
}

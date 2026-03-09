import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    value?: string,
    error: string | null,
    onBlur: ({ max }: { max: string }) => void,
    onEnterKey: ({ max }: { max: string }) => void,
    errorClass: string,
};

class MaxNumericFilterPlain extends Component<Props> {
    static getValueObject(value: string) {
        return { max: value.trim() };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(MaxNumericFilterPlain.getValueObject(value));
    }

    handleKeyDown = (payload: { value?: string }, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey(MaxNumericFilterPlain.getValueObject(payload.value ?? this.props.value ?? ''));
        }
    }

    render() {
        const { error, onBlur, onEnterKey, errorClass, ...passOnProps } = this.props;
        return (
            <div>
                <D2TextField
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('Max')}
                    {...passOnProps}
                />
                <div className={errorClass}>
                    {error}
                </div>
            </div>
        );
    }
}

export const MaxNumericFilter = withInternalChangeHandler()(MaxNumericFilterPlain);

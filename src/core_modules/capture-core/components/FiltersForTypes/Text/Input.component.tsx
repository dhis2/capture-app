import React from 'react';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: string;
    onBlur: (value: string) => void;
    onEnterKey: (value: string) => void;
    onChange?: (value: string) => void;
};

class InputPlain extends React.Component<Props> {
    static getValueObject(value: string) {
        return value.trim();
    }

    handleBlur = (value: string) => {
        this.props.onBlur(InputPlain.getValueObject(value));
    }

    handleKeyDown = (payload: { value?: string }, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey(InputPlain.getValueObject(payload.value ?? this.props.value ?? ''));
        }
    }

    render() {
        const { onBlur, onEnterKey, ...passOnProps } = this.props;
        return (
            <D2TextField
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
                {...passOnProps}
            />
        );
    }
}

export const Input = withInternalChangeHandler()(InputPlain);

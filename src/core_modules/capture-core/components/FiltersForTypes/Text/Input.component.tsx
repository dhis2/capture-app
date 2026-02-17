import React from 'react';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    onEnterKey: (value: string | undefined) => void;
    value: string | undefined;
    onBlur: (value: string) => void;
};

class InputPlain extends React.Component<Props> {
    handleKeyDown = (payload: { value?: string }, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (payload.value) {
                this.props.onEnterKey(payload.value);
            }
        }
    };

    render() {
        const { onEnterKey, ...passOnProps } = this.props;
        return (
            <D2TextField
                onKeyDown={this.handleKeyDown}
                {...passOnProps}
            />
        );
    }
}

export const Input = withInternalChangeHandler()(InputPlain);

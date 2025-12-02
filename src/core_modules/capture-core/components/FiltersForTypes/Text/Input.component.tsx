import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    onEnterKey: (value: string | undefined) => void;
    value: string | undefined;
    onBlur: (value: string) => void;
    unique: boolean;
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
        const { onEnterKey, unique, ...passOnProps } = this.props;
        return (
            <D2TextField
                onKeyDown={this.handleKeyDown}
                placeholder={unique ? i18n.t('Exact matches only') : i18n.t('Contains text')}
                {...passOnProps}
            />
        );
    }
}

export const Input = withInternalChangeHandler()(InputPlain);

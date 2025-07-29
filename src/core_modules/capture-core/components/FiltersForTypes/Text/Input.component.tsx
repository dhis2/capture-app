import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    onEnterKey: (value: string | undefined) => void;
    value: string | undefined;
    onBlur: (value: string) => void;
};

class InputPlain extends React.Component<Props> {
    handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey(this.props.value);
        }
    }

    render() {
        const { onEnterKey, ...passOnProps } = this.props;
        return (
            <D2TextField
                onKeyPress={this.handleKeyPress}
                placeholder={i18n.t('Contains text')}
                {...passOnProps}
            />
        );
    }
}

export const Input = withInternalChangeHandler()(InputPlain);

// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import TextField from '../../FormFields/Generic/D2TextField.component';
import withInternalChangeHandler from '../../FormFields/withInternalChangeHandler';

type Props = {
    onEnterKey: (value: ?string) => void,
    value: ?string,
};

class Input extends React.Component<Props> {
    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey(this.props.value);
        }
    }

    render() {
        const { onEnterKey, ...passOnProps } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <TextField
                onKeyPress={this.handleKeyPress}
                fullWidth
                placeholder={i18n.t('Contains text')}
                {...passOnProps}
            />
        );
    }
}

export default withInternalChangeHandler()(Input);

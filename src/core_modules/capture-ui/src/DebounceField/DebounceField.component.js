// @flow
import * as React from 'react';
import { debounce } from 'lodash';
import TextInput from '../internal/TextInput/TextInput.component';

type Props = {
    onChange: (event: SyntheticEvent<HTMLInputElement>) => void,
    value: ?string,
};

type State = {
    value: string,
};

class DebounceField extends React.Component<Props, State> {
    debouncer: Function;
    constructor(props: Props) {
        super(props);
        this.state = {
            value: this.props.value || '',
        };

        this.debouncer = debounce(this.handleDebounced, 500);
    }

    handleDebounced = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange(event);
    }

    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({
            value: event.currentTarget.value,
        });
        this.debouncer(event);
    }

    render() {
        const { onChange, ...passOnProps } = this.props;
        return (
            <TextInput
                onChange={this.handleChange}
                {...passOnProps}
            />
        );
    }
}

export default DebounceField;

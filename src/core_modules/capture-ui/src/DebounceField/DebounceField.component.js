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

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: nextProps.value || '',
            });
        }
    }

    handleDebounced = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange(event);
    }

    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({
            value: event.currentTarget.value,
        });
        event.persist();
        this.debouncer(event);
    }

    render() {
        const { onChange, value, ...passOnProps } = this.props;
        const { value: stateValue } = this.state;
        return (
            <TextInput
                onChange={this.handleChange}
                value={stateValue}
                {...passOnProps}
            />
        );
    }
}

export default DebounceField;

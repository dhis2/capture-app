import * as React from 'react';
import { debounce } from 'lodash';
import { TextInput } from '../internal/TextInput/TextInput.component';

type Props = {
    onDebounced: (event: React.SyntheticEvent<HTMLInputElement>) => void;
    value?: string | null;
    [key: string]: any;
};

type State = {
    value: string;
};

/**
 * Text field exposing a callback method triggered when the input is debounced
 * @class DebounceField
 */
export class DebounceField extends React.Component<Props, State> {
    debouncer: any;
    constructor(props: Props) {
        super(props);
        this.state = {
            value: this.props.value || '',
        };

        this.debouncer = debounce(this.handleDebounced, 500);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: nextProps.value || '',
            });
        }
    }

    componentWillUnmount() {
        this.debouncer.cancel();
    }

    handleDebounced = (event: React.SyntheticEvent<HTMLInputElement>) => {
        this.props.onDebounced(event);
    }

    handleChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        this.setState({
            value: event.currentTarget.value,
        });
        this.debouncer({ ...event });
    }

    render() {
        const { onDebounced, value, ...passOnProps } = this.props;
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

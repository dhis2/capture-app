// @flow
import * as React from 'react';
import { debounce } from 'lodash';
import { TextInput } from '../internal/TextInput/TextInput.component';

type Props = {
    onDebounced: (event: SyntheticEvent<HTMLInputElement>) => void,
    value: ?string,
};

type State = {
    value: string,
};

/**
 * Text field exposing a callback method triggered when the input is debounced
 * @class DebounceField
 */
export class DebounceField extends React.Component<Props, State> {
    debouncer: Function;
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

    handleDebounced = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onDebounced(event);
    }

    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({
            value: event.currentTarget.value,
        });
        this.debouncer({ ...event });
    }

    render() {
        const { onDebounced, value, ...passOnProps } = this.props;
        const { value: stateValue } = this.state;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <TextInput
                onChange={this.handleChange}
                value={stateValue}
                {...passOnProps}
            />
        );
    }
}

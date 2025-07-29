import * as React from 'react';

type Props = {
    onChange?: (value: any) => void;
    value: any;
};

type State = {
    value: any;
};

export const withInternalChangeHandler = () =>
    <P extends Record<string, unknown>>(InnerComponent: React.ComponentType<P>) =>
        (class DefaultFieldChangeHandler extends React.Component<Props & P, State> {
            constructor(props: Props & P) {
                super(props);
                this.handleChange = this.handleChange.bind(this);
                const value = this.props.value;
                this.state = { value };
            }

            UNSAFE_componentWillReceiveProps(nextProps: Props & P) {
                if (nextProps.value !== this.props.value) {
                    this.setState({
                        value: nextProps.value,
                    });
                }
            }

            handleChange(value: any) {
                this.setState({
                    value,
                });
                this.props.onChange && this.props.onChange(value);
            }

            render() {
                const { onChange, value, ...passOnProps } = this.props;
                const stateValue = this.state.value;

                return (
                    <InnerComponent
                        onChange={this.handleChange}
                        value={stateValue}
                        {...passOnProps as unknown as P}
                    />
                );
            }
        });

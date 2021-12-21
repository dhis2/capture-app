// @flow
import * as React from 'react';

type Props = {
    onChange?: ?(value: any) => void,
    value: any,
};

type State = {
    value: any,
};

export const withInternalChangeHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        (class DefaultFieldChangeHandler extends React.Component<Props, State> {
            handleChange: (value: any) => void;

            constructor(props: Props) {
                super(props);
                this.handleChange = this.handleChange.bind(this);
                const value = this.props.value;
                this.state = { value };
            }

            UNSAFE_componentWillReceiveProps(nextProps: Props) {
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
            }

            render() {
                const { onChange, value, ...passOnProps } = this.props;
                const stateValue = this.state.value;

                return (
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <InnerComponent
                        onChange={this.handleChange}
                        value={stateValue}
                        {...passOnProps}
                    />
                );
            }
        });

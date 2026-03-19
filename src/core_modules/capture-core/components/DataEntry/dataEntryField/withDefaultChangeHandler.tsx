import * as React from 'react';

type Props = {
    onChange: (value: any) => void;
    value: any;
};

type State = {
    value: any;
};

export const withDefaultChangeHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        (class DefaultFieldChangeHandler extends React.Component<Props, State> {
            constructor(props: Props) {
                super(props);
                this.handleChange = this.handleChange.bind(this);
                const value = this.props.value;
                this.state = { value };
            }

            componentDidUpdate(prevProps: Props) {
                if (this.props.value !== prevProps.value) {
                    this.setState({
                        value: this.props.value,
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
                    <InnerComponent
                        onChange={this.handleChange}
                        value={stateValue}
                        {...passOnProps}
                    />
                );
            }
        });

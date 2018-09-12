// @flow
import * as React from 'react';

type Props = {
};

type State = {
    inFocus: boolean,
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class DefaultIsFocusedHandler extends React.Component<Props, State> {
            constructor(props: Props) {
                super(props);
                this.state = {
                    inFocus: false,
                };
            }

            setFocus = () => {
                this.setState({
                    inFocus: true,
                });
            }

            removeFocus = () => {
                this.setState({
                    inFocus: false,
                });
            }

            render() {
                const { inFocus } = this.state;
                return (
                    <InnerComponent
                        inFocus={inFocus}
                        onSetFocus={this.setFocus}
                        onRemoveFocus={this.removeFocus}
                        {...this.props}
                    />
                );
            }
        };

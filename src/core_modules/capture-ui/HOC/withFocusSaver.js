// @flow
import * as React from 'react';

type Props = {
    inFocus?: ?boolean,
    onSetFocus?: ?() => void,
    onRemoveFocus?: ?() => void,
};

type State = {
    inFocus: boolean,
};

export const withFocusSaver = () =>
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
                this.props.onSetFocus && this.props.onSetFocus();
            }

            removeFocus = () => {
                this.setState({
                    inFocus: false,
                });
                this.props.onRemoveFocus && this.props.onRemoveFocus();
            }

            render() {
                const { inFocus } = this.state;
                const { inFocus: inFocusProp, onSetFocus, onRemoveFocus, ...passOnProps } = this.props;
                return (
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <InnerComponent
                        inFocus={inFocus}
                        onSetFocus={this.setFocus}
                        onRemoveFocus={this.removeFocus}
                        {...passOnProps}
                    />
                );
            }
        };

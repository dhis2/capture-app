// @flow
import * as React from 'react';

type Props = {
    onSetFocus?: () => void,
    onRemoveFocus?: () => void,
    inFocus: boolean,
};

type State = {
    inFocus: boolean,
};

const getFocusHandler = () => (InnerComponent: React.ComponentType<any>) =>
    class FocusHandlerHOC extends React.Component<Props, State> {
        inputInstance: HTMLInputElement;
        isMouseClick: boolean;

        constructor(props: Props) {
            super(props);
            this.state = {
                inFocus: false,
                isMouseClick: false,
            };
        }

        componentDidMount() {
            this.inputInstance.addEventListener('mousedown', this.handleInputMouseDown);
            this.inputInstance.addEventListener('focus', this.handleInputFocus);
            this.inputInstance.addEventListener('blur', this.handleInputBlur);
        }

        componentWillUnmount() {
            this.inputInstance.removeEventListener('mousedown', this.handleInputMouseDown);
            this.inputInstance.removeEventListener('focus', this.handleInputFocus);
            this.inputInstance.removeEventListener('blur', this.handleInputBlur);
        }

        handleInputMouseDown = () => {
            this.isMouseClick = true;
        }

        handleInputFocus = () => {
            this.props.onSetFocus && this.props.onSetFocus();

            if (this.isMouseClick) {
                this.isMouseClick = false;
                return;
            }

            this.setState({
                inFocus: true,
            });
        }

        handleInputBlur = () => {
            this.props.onRemoveFocus && this.props.onRemoveFocus();

            if (this.state.inFocus) {
                this.setState({
                    inFocus: false,
                });
            }
            this.isMouseClick = false;
        }

        setInputInstance = (instance: HTMLInputElement) => {
            this.inputInstance = instance;
        }

        render() {
            const { onSetFocus, onRemoveFocus, inFocus, ...passOnProps } = this.props;
            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    inputRef={this.setInputInstance}
                    inFocus={this.state.inFocus}
                    {...passOnProps}
                />
            );
        }
    };

export default getFocusHandler;

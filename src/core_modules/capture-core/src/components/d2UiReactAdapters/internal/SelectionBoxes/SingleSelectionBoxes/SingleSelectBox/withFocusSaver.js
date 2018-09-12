// @flow
import * as React from 'react';

type Props = {
    onSetFocus?: () => void,
    onRemoveFocus?: () => void,
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
            if (this.isMouseClick) {
                this.isMouseClick = false;
                return;
            }

            this.setState({
                inFocus: true,
            });
            this.props.onSetFocus && this.props.onSetFocus();
        }

        handleInputBlur = () => {
            if (this.state.inFocus) {
                this.setState({
                    inFocus: false,
                });
                this.props.onRemoveFocus && this.props.onRemoveFocus();
            }
        }

        setInputInstance = (instance: HTMLInputElement) => {
            this.inputInstance = instance;
        }

        render() {
            const { ...passOnProps } = this.props;
            return (
                <InnerComponent
                    inputRef={this.setInputInstance}
                    inFocus={this.state.inFocus}
                    {...passOnProps}
                />
            );
        }
    };

export default getFocusHandler;

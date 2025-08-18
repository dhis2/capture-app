import * as React from 'react';

type OwnProps = {
    setInputRef: (element: HTMLInputElement) => void;
    onSetFocus?: () => void;
    onRemoveFocus?: () => void;
    inFocus: boolean;
};

type Props = OwnProps & any;

type State = {
    inFocus: boolean;
};

export const withFocusHandler = () => (InnerComponent: React.ComponentType<any>) =>
    class FocusHandlerHOC extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);
            this.state = {
                inFocus: false,
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

        setInputInstance = (instance: HTMLInputElement) => {
            this.inputInstance = instance;
            this.props.setInputRef(instance);
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

        inputInstance!: HTMLInputElement;
        isMouseClick = false;

        render() {
            const { setInputRef, onSetFocus, onRemoveFocus, inFocus, ...passOnProps } = this.props as OwnProps & any;
            return (
                <InnerComponent
                    inputRef={this.setInputInstance}
                    inFocus={this.state.inFocus}
                    {...passOnProps}
                />
            );
        }
    };

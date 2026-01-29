import * as React from 'react';

type FocusHandlerProps = {
    onSetFocus?: () => void;
    onRemoveFocus?: () => void;
    inFocus?: boolean;
    onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    classes?: {
        inputWrapperFocused?: string;
        inputWrapperUnfocused?: string;
    };
};

export const withFocusHandler = () => <P extends Record<string, unknown>>(InnerComponent: React.ComponentType<P>) =>
    class FocusHandlerHOC extends React.Component<P & FocusHandlerProps> {
        handleBlur = (event: React.SyntheticEvent<HTMLInputElement>) => {
            this.props.onRemoveFocus?.();
            this.props.onBlur?.(event);
        }

        handleFocus = () => {
            this.props.onSetFocus?.();
            this.props.onFocus?.();
        }

        render() {
            const { onSetFocus, onRemoveFocus, onFocus, inFocus, onBlur, classes, ...passOnProps } = this.props;
            const { inputWrapperFocused, inputWrapperUnfocused } = classes ?? {};
            const inputWrapper = inFocus ? inputWrapperFocused : inputWrapperUnfocused;
            return (
                <div
                    className={inputWrapper}
                >
                    <InnerComponent
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        {...passOnProps as P}
                    />
                </div>
            );
        }
    };

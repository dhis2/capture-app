import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './selectField.module.css';

type Props = {
    onSetFocus: () => void;
    onRemoveFocus: () => void;
    inFocus: boolean;
    onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    classes?: {
        inputWrapperFocused?: string;
        inputWrapperUnfocused?: string;
    };
};

export const withFocusHandler = () => <P extends Record<string, unknown>>(InnerComponent: React.ComponentType<P>) =>
    class FocusHandlerHOC extends React.Component<P & Props> {
        handleBlur = (event: React.SyntheticEvent<HTMLInputElement>) => {
            this.props.onRemoveFocus();
            this.props.onBlur?.(event);
        }

        handleFocus = () => {
            this.props.onSetFocus();
            this.props.onFocus?.();
        }

        render() {
            const { onSetFocus, onRemoveFocus, onFocus, inFocus, onBlur, ...passOnProps } = this.props;
            const inputWrapper = inFocus ? defaultClasses.inputWrapperFocused : defaultClasses.inputWrapperUnfocused;
            return (
                <div
                    className={classNames(defaultClasses.inputWrapper, inputWrapper)}
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

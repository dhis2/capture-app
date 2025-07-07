// @flow
import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './selectField.module.css';

type Props = {
    onSetFocus: () => void,
    onRemoveFocus: () => void,
    inFocus: boolean,
    onBlur?: ?(event: SyntheticEvent<HTMLInputElement>) => void,
    onFocus: () => void,
    classes: {
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
    }
};

export const withFocusHandler = () => (InnerComponent: React.ComponentType<any>) =>
    class FocusHandlerHOC extends React.Component<Props> {
        handleBlur = (event: SyntheticEvent<HTMLInputElement>) => {
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
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <InnerComponent
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

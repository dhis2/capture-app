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

export const withFocusHandler = () => (InnerCompnent: React.ComponentType<any>) =>
    class FocusHandlerHOC extends React.Component<Props> {
        handleRemoveFocus = () => {
            this.props.onRemoveFocus();
        }

        handleFocus = () => {
            this.props.onSetFocus();
            this.props.onFocus && this.props.onFocus();
        }

        handleSelect = (value: any) => {
            this.props.onBlur && this.props.onBlur(value);
        };

        render() {
            const { onSetFocus, onRemoveFocus, onFocus, inFocus, onBlur, classes, ...passOnProps } = this.props;
            const { inputWrapperFocused, inputWrapperUnfocused, ...passOnClasses } = classes;
            const inputWrapper = inFocus ? inputWrapperFocused : inputWrapperUnfocused;

            return (
                <div
                    className={classNames(defaultClasses.inputWrapper, inputWrapper)}
                >
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <InnerCompnent
                        onFocus={this.handleFocus}
                        onBlur={this.handleRemoveFocus}
                        onSelect={this.handleSelect}
                        {...passOnProps}
                        classes={passOnClasses}
                    />
                </div>
            );
        }
    };

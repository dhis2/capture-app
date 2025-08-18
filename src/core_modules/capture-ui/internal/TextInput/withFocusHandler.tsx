import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './textInput.module.css';

type Props = {
    onSetFocus: () => void;
    onRemoveFocus: () => void;
    inFocus: boolean;
    onBlur?: (event: React.SyntheticEvent<HTMLInputElement>, rest?: any) => void;
    onFocus?: () => void;
    classes: {
        inputWrapperFocused: string;
        inputWrapperUnfocused: string;
        [key: string]: any;
    };
    [key: string]: any;
};

export const withTextFieldFocusHandler = () => (InnerComponent: React.ComponentType<any>) =>
    class FocusHandlerHOC extends React.Component<Props> {
        handleBlur = (event: React.SyntheticEvent<HTMLInputElement>, rest?: any) => {
            this.props.onRemoveFocus();
            this.props.onBlur && this.props.onBlur(event, rest);
        }

        handleFocus = () => {
            this.props.onSetFocus();
            this.props.onFocus && this.props.onFocus();
        }

        render() {
            const { onSetFocus, onRemoveFocus, onFocus, inFocus, onBlur, classes, ...passOnProps } = this.props;
            const { inputWrapperFocused, inputWrapperUnfocused, ...passOnClasses } = classes;
            const inputWrapper = inFocus ? inputWrapperFocused : inputWrapperUnfocused;
            return (
                <div
                    className={classNames(defaultClasses.inputWrapper, inputWrapper)}
                >
                    <InnerComponent
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        {...passOnProps}
                        classes={passOnClasses}
                    />
                </div>
            );
        }
    };

import * as React from 'react';
import { cx } from '@emotion/css';
import defaultClasses from './selectField.module.css';

type Props = {
    onSetFocus: () => void,
    onRemoveFocus: () => void,
    inFocus: boolean,
    onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void | null,
    onFocus: () => void,
    classes: {
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
    }
};

export const withFocusHandler = () => (InnerCompnent: React.ComponentType<any>) =>
    class FocusHandlerHOC extends React.Component<Props> {
        handleBlur = (event: React.SyntheticEvent<HTMLInputElement>) => {
            this.props.onRemoveFocus();
            this.props.onBlur && this.props.onBlur(event);
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
                    className={cx(defaultClasses.inputWrapper, inputWrapper)}
                >
                    <InnerCompnent
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        {...passOnProps}
                        classes={passOnClasses}
                    />
                </div>
            );
        }
    };

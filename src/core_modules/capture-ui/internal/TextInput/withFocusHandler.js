// @flow
import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './textInput.mod.css';

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

export default () => (InnerCompnent: React.ComponentType<any>) =>
    class FocusHandlerHOC extends React.Component<Props> {
        handleBlur = (event: SyntheticEvent<HTMLInputElement>) => {
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
                    className={classNames(defaultClasses.inputWrapper, inputWrapper)}
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

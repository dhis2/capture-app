import * as React from 'react';
import { cx } from '@emotion/css';
import { WithStyles } from 'capture-core-utils/styles';
import defaultClasses from './selectField.module.css';
import { styles } from './MultiSelectField.component';

type Props = {
    onSetFocus: () => void,
    onRemoveFocus: () => void,
    inFocus: boolean,
    onBlur?: (value: string | null) => void,
    onFocus: () => void,
};

export const withFocusHandler = () => (InnerComponent: React.ComponentType<any>) =>
    class FocusHandlerHOC extends React.Component<Props & WithStyles<typeof styles>> {
        handleRemoveFocus = (value: string) => {
            this.props.onRemoveFocus();
            this.props.onBlur && this.props.onBlur(value);
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
                    className={cx(defaultClasses.inputWrapper, inputWrapper)}
                >
                    <InnerComponent
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

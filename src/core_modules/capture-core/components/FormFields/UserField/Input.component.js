// @flow
import * as React from 'react';
import { DebounceField, withTextFieldFocusHandler, withFocusSaver } from 'capture-ui';

const FocusableDebounceField = withFocusSaver()(withTextFieldFocusHandler()(DebounceField));

type Props = {
    inputDomRef: Function,
    inputWrapperClasses: Object,
    value: string,
    onUpdateValue: (value: string) => void,
    onHighlightSuggestion: () => void,
};

const Input = (props: Props) => {
    const { onUpdateValue, onHighlightSuggestion, inputWrapperClasses, inputDomRef, ...passOnProps } = props;

    const handleUpdateValue = React.useCallback(event => onUpdateValue(event.currentTarget.value), [onUpdateValue]);
    const handleKeyDown = React.useCallback((event) => {
        if (event.keyCode === 40) {
            onHighlightSuggestion();
        }
    }, [onHighlightSuggestion]);

    return (
        <FocusableDebounceField
            inputRef={inputDomRef}
            onDebounced={handleUpdateValue}
            onKeyDown={handleKeyDown}
            classes={inputWrapperClasses}
            {...passOnProps}
        />
    );
};

export default Input;


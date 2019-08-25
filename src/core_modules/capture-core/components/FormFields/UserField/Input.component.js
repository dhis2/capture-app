// @flow
import * as React from 'react';
import { DebounceField, withTextFieldFocusHandler, withFocusSaver } from 'capture-ui';
import SearchContext from './Search.context';

const FocusableDebounceField = withFocusSaver()(withTextFieldFocusHandler()(DebounceField));

type Props = {
    inputDomRef: Function,
    inputWrapperClasses: Object,
    onUpdateValue: (value: string) => void,
    onHighlightSuggestion: () => void,
    onSelectSuggestion: () => void,
    onResetDisplayedHighlight: () => void,
    onExitSearch: () => void,
};

const isSuggestionBlurTarget = (target, suggestionName) => {
    if (target.getAttribute('name') === suggestionName) {
        return true;
    }

    const parentElement = target.parentElement;
    if (!parentElement) {
        return false;
    }

    return (parentElement.getAttribute('name') === suggestionName);
};

const Input = (props: Props) => {
    const {
        onUpdateValue,
        onHighlightSuggestion,
        onSelectSuggestion,
        onResetDisplayedHighlight,
        onExitSearch,
        inputWrapperClasses,
        inputDomRef,
        ...passOnProps
    } = props;

    const { inputName, suggestionName } = React.useContext(SearchContext);

    const handleUpdateValue = React.useCallback(event => onUpdateValue(event.currentTarget.value), [onUpdateValue]);
    const handleKeyDown = React.useCallback((event) => {
        if (event.keyCode === 40) {
            onHighlightSuggestion();
            event.stopPropagation();
            event.preventDefault();
        } else if (event.keyCode === 13) {
            onSelectSuggestion();
        }
    }, [onHighlightSuggestion, onSelectSuggestion]);
    const handleBlur = React.useCallback((event) => {
        if (!event.relatedTarget || !isSuggestionBlurTarget(event.relatedTarget, suggestionName)) {
            onExitSearch();
        }
    }, [onExitSearch, suggestionName]);

    return (
        <FocusableDebounceField
            name={inputName}
            inputRef={inputDomRef}
            onDebounced={handleUpdateValue}
            onFocus={onResetDisplayedHighlight}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            classes={inputWrapperClasses}
            {...passOnProps}
        />
    );
};

export default Input;


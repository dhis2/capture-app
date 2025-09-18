import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { DebounceField, withTextFieldFocusHandler, withFocusSaver } from 'capture-ui';
import { SearchContext } from './Search.context';

const FocusableDebounceField = withFocusSaver()(withTextFieldFocusHandler()(DebounceField));

type Props = {
    inputDomRef: (element: HTMLElement | null) => void;
    inputWrapperClasses: any;
    onUpdateValue: (value: string) => void;
    onHighlightSuggestion: () => void;
    onSelectSuggestion: () => void;
    onResetDisplayedHighlight: () => void;
    onExitSearch: () => void;
    useUpwardList?: boolean | null;
    placeholder?: string | null;
};

const isSuggestionBlurTarget = (target: any, suggestionName: string) => {
    if (target.getAttribute('name') === suggestionName) {
        return true;
    }

    const parentElement = target.parentElement;
    if (!parentElement) {
        return false;
    }

    return (parentElement.getAttribute('name') === suggestionName);
};

export const Input = (props: Props) => {
    const {
        onUpdateValue,
        onHighlightSuggestion,
        onSelectSuggestion,
        onResetDisplayedHighlight,
        onExitSearch,
        inputWrapperClasses,
        inputDomRef,
        useUpwardList,
        placeholder,
        ...passOnProps
    } = props;

    const { inputName, suggestionName } = React.useContext(SearchContext);

    const handleUpdateValue = React.useCallback((event: any) => onUpdateValue(event.currentTarget.value), [onUpdateValue]);

    // eslint-disable-next-line complexity
    const handleKeyDown = React.useCallback((event: any) => {
        if ((event.keyCode === 40 && !useUpwardList) || (event.keyCode === 38 && useUpwardList)) {
            onHighlightSuggestion();
            event.stopPropagation();
            event.preventDefault();
        } else if (event.keyCode === 13) {
            onSelectSuggestion();
        }
    }, [onHighlightSuggestion, onSelectSuggestion, useUpwardList]);
    const handleBlur = React.useCallback((event: any) => {
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
            placeholder={placeholder !== undefined ? placeholder : i18n.t('start typing to search')}
            {...passOnProps}
        />
    );
};

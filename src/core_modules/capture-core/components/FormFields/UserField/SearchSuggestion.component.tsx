import * as React from 'react';
import parse from 'autosuggest-highlight/parse';
import { MenuItem } from '@dhis2/ui';
import classNames from 'classnames';
import { SearchContext } from './Search.context';
import defaultClasses from './searchSuggestion.module.css';
import type { User } from './types';

type Props = {
    user: User;
    query: string;
    isHighlighted: boolean;
    onHighlightNext: (user: User) => void;
    onHighlightPrev: (user: User) => void;
    onSelect: (user: User) => void;
    onExitSearch: () => void;
    suggestionRef: (ref: HTMLElement | null, user: User) => void;
    useUpwardList?: boolean | null;
};

function match(text: string, query: string) {
    const lcText = text.toLocaleLowerCase();
    const lcQUery = query.toLocaleLowerCase();
    const index = lcText.indexOf(lcQUery);
    if (index <= -1) {
        return [];
    }

    return [
        [
            index,
            index + query.length,
        ],
    ];
}

function isInternalTarget(target: any, suggestionName: string, inputName: string) {
    if (target.getAttribute('name') === suggestionName ||
        target.getAttribute('name') === inputName) {
        return true;
    }

    const parentElement = target.parentElement;
    if (!parentElement) {
        return false;
    }

    return (parentElement.getAttribute('name') === suggestionName);
}

export const SearchSuggestion = (props: Props) => {
    const {
        user,
        query,
        isHighlighted,
        onHighlightNext,
        onHighlightPrev,
        suggestionRef,
        onSelect,
        onExitSearch,
        useUpwardList,
    } = props;

    const { inputName, suggestionName } = React.useContext(SearchContext);

    const userText = `${user.name} (${user.username})`;
    const matches = match(userText, query);
    const parts = parse(userText, matches);

    // eslint-disable-next-line complexity
    const handleKeyDown = React.useCallback((event: any) => {
        if ((event.keyCode === 40 && !useUpwardList) || (event.keyCode === 38 && useUpwardList)) {
            onHighlightNext(user);
        } else if ((event.keyCode === 38 && !useUpwardList) || (event.keyCode === 40 && useUpwardList)) {
            onHighlightPrev(user);
        } else if (event.keyCode === 13) {
            onSelect(user);
        }
        event.stopPropagation();
        event.preventDefault();
    }, [onHighlightNext, onHighlightPrev, onSelect, user, useUpwardList]);

    const handleRef = React.useCallback((ref: any) => {
        suggestionRef(ref, user);
    }, [suggestionRef, user]);

    const handleClick = React.useCallback((event: any) => {
        onSelect(user);
        event.stopPropagation();
    }, [onSelect, user]);

    const handleBlur = React.useCallback((event: any) => {
        if (!event.relatedTarget || !isInternalTarget(event.relatedTarget, suggestionName, inputName)) {
            onExitSearch();
        }
    }, [onExitSearch, suggestionName, inputName]);
    return (
        <div
            role="button"
            tabIndex={-1}
            ref={handleRef}
            className={useUpwardList ?
                classNames(defaultClasses.suggestion, defaultClasses.suggestionInUpList) :
                defaultClasses.suggestion
            }
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onBlur={handleBlur}
        >
            <MenuItem
                active={isHighlighted}
                suffix=""
                label={(
                    <div>
                        {parts.map((part, index) => (part.highlight ? (
                            // eslint-disable-next-line react/no-array-index-key
                            <span key={String(index)} style={{ fontWeight: 500 }}>
                                {part.text}
                            </span>
                        ) : (
                            // eslint-disable-next-line react/no-array-index-key
                            <strong key={String(index)} style={{ fontWeight: 300 }}>
                                {part.text}
                            </strong>
                        )))}
                    </div>
                )}
            />

        </div>
    );
};

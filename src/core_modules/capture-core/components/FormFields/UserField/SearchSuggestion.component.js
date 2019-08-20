// @flow
import * as React from 'react';
import parse from 'autosuggest-highlight/parse';
import MenuItem from '@material-ui/core/MenuItem';
import type { User } from './types';

type Props = {
    user: User,
    query: string,
    isHighlighted: boolean,
    onHighlightNext: (user: User) => void,
    onHighlightPrev: (user: User) => void,
    onSelect: (user: User) => void,
    suggestionRef: (ref: ?HTMLElement, user: User) => void,
};

function match(text, query) {
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

const SearchSuggestion = (props: Props) => {
    const { user, query, isHighlighted, onHighlightNext, onHighlightPrev, suggestionRef, onSelect } = props;
    const userText = `${user.name} (${user.username})`;
    const matches = match(userText, query);
    const parts = parse(userText, matches);

    const handleKeyDown = React.useCallback((event) => {
        if (event.keyCode === 40) {
            onHighlightNext(user);
        } else if (event.keyCode === 38) {
            onHighlightPrev(user);
        } else if (event.keyCode === 13 || event.keyCode === 9) {
            onSelect(user);
        }
        event.stopPropagation();
        event.preventDefault();
    }, [onHighlightNext, onHighlightPrev, onSelect, user]);

    const handleRef = React.useCallback((ref) => {
        suggestionRef(ref, user);
    }, [suggestionRef, user]);

    const handleClick = React.useCallback((event) => {
        onSelect(user);
        event.stopPropagation();
    }, [onSelect, user]);

    return (
        <div
            role="button"
            tabIndex={0}
            ref={handleRef}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
        >
            <MenuItem
                selected={isHighlighted}
                component="div"
                className="User__listitem" // purpose: Prevent onBlur effects when the item is selected
            >
                <div>
                    {parts.map((part, index) => (part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 500 }}>
                            {part.text}
                        </span>
                    ) : (
                        <strong key={String(index)} style={{ fontWeight: 300 }}>
                            {part.text}
                        </strong>
                    )))}
                </div>
            </MenuItem>
        </div>
    );
};

export default SearchSuggestion;

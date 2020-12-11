// @flow
import * as React from 'react';
import SearchContext from './Search.context';
import defaultClasses from './searchSuggestionsUp.module.css';

type Props = {
    children: React.Node,
    onHighlightNext: () => void,
    onHighlightPrev: () => void,
};

const SearchSuggestionsUp = (props: Props) => {
    const { children, onHighlightNext, onHighlightPrev } = props;
    const listUpEl = React.useRef(null);
    React.useLayoutEffect(() => {
        if (listUpEl.current) {
            listUpEl.current.scrollTop = listUpEl.current.scrollHeight;
        }
    }, []);
    const { suggestionName } = React.useContext(SearchContext);
    const handleKeyDown = React.useCallback((event) => {
        if (event.keyCode === 38) {
            onHighlightNext();
            event.stopPropagation();
            event.preventDefault();
        } else if (event.keyCode === 40) {
            onHighlightPrev();
            event.stopPropagation();
            event.preventDefault();
        }
    }, [onHighlightNext, onHighlightPrev]);

    return (
        <div
            name={suggestionName}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            role="none"
        >
            <div
                ref={listUpEl}
                className={defaultClasses.listUp}
            >
                <div
                    name={suggestionName}
                    className={defaultClasses.listUpInner}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SearchSuggestionsUp;

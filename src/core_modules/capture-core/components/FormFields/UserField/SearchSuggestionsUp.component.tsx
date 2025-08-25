import * as React from 'react';
import defaultClasses from './searchSuggestionsUp.module.css';

type Props = {
    children: React.ReactNode;
    onHighlightNext: () => void;
    onHighlightPrev: () => void;
};

export const SearchSuggestionsUp = (props: Props) => {
    const { children, onHighlightNext, onHighlightPrev } = props;
    const listUpEl = React.useRef<HTMLDivElement>(null);
    React.useLayoutEffect(() => {
        if (listUpEl.current) {
            listUpEl.current.scrollTop = listUpEl.current.scrollHeight;
        }
    }, []);

    const handleKeyDown = React.useCallback((event: any) => {
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
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            role={'none'}
        >
            <div
                ref={listUpEl}
                className={defaultClasses.listUp}
            >
                <div
                    className={defaultClasses.listUpInner}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

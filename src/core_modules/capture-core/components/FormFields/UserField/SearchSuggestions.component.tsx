import * as React from 'react';
import defaultClasses from './searchSuggestions.module.css';
import { SearchSuggestionsUp } from './SearchSuggestionsUp.component';
import { SearchSuggestion } from './SearchSuggestion.component';
import type { User } from './types';

type Props = {
    suggestions: User[];
    query: string;
    highlighted?: User | null;
    useUpwardList?: boolean | null;
    suggestionRef?: (ref: HTMLElement | null, user: User) => void;
    onHighlightNext?: (user: User) => void;
    onHighlightPrev?: (user: User) => void;
    onSelect?: (user: User) => void;
    onExitSearch?: () => void;
};

export class SearchSuggestions extends React.Component<Props> {
    static renderSuggestions(
        suggestions: User[],
        query: string,
        highlighted: User | null | undefined,
        passOnProps: any) {
        const suggestionElements = suggestions
            .map(u => (
                <SearchSuggestion
                    key={u.id}
                    user={u}
                    query={query}
                    isHighlighted={highlighted === u}
                    {...passOnProps}
                />),
            );

        return passOnProps.useUpwardList ?
            (
                <SearchSuggestionsUp
                    key={query}
                    onHighlightNext={passOnProps.onHighlightNext}
                    onHighlightPrev={passOnProps.onHighlightPrev}
                >
                    {suggestionElements}
                </SearchSuggestionsUp>
            ) :
            (
                <div>
                    <div
                        className={defaultClasses.list}
                    >
                        {suggestionElements}
                    </div>
                </div>
            );
    }

    static renderEmpty() {
        return null;
    }

    render() {
        const { suggestions, query, highlighted, ...passOnProps } = this.props;
        return (
            <div
                className={defaultClasses.container}
            >
                {
                    suggestions.length > 0 ?
                        SearchSuggestions.renderSuggestions(suggestions, query, highlighted, passOnProps)
                        : SearchSuggestions.renderEmpty()
                }
            </div>
        );
    }
}

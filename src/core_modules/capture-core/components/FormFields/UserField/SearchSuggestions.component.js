// @flow
import * as React from 'react';
import defaultClasses from './searchSuggestions.module.css';
import { SearchSuggestionsUp } from './SearchSuggestionsUp.component';
import { SearchSuggestion } from './SearchSuggestion.component';
import type { User } from './types';

type Props = {
    suggestions: Array<User>,
    query: string,
    highlighted: ?User,
    useUpwardList?: ?boolean,
};

export class SearchSuggestions extends React.Component<Props> {
    static renderSuggestions(
        suggestions: Array<User>,
        query: string,
        highlighted: ?User,
        passOnProps: Object) {
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

// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { makeCancelablePromise } from 'capture-core-utils';
import { getApi } from '../../../d2/d2Instance';
import Input from './Input.component';
import SearchSuggestions from './SearchSuggestions.component';
import type { User } from './types';

type Props = {
    onSet: (user: User) => void,
    inputWrapperClasses: Object,
    focusInputOnMount: boolean,
};

type State = {
    value: string,
    suggestions: Array<User>,
    suggestionsError?: ?string,
    highlightedSuggestion?: ?User,
};

class UserSearch extends React.Component<Props, State> {
    static getSearchQueryParams(value: string) {
        return {
            fields: 'displayName,id,userCredentials[username]',
            paging: true,
            pageSize: 10,
            page: 1,
            query: value,
            totalPages: false,
        };
    }

    cancelablePromise: ?{cancel: () => void, promise: Promise<any>};
    suggestionElements: Map<string, HTMLElement>;
    inputDomElement: ?HTMLInputElement;
    constructor(props: Props) {
        super(props);
        this.suggestionElements = new Map();
        this.state = {
            value: '',
            suggestions: [],
        };
    }

    componentDidMount() {
        const { focusInputOnMount } = this.props;
        if (focusInputOnMount) {
            this.inputDomElement && this.inputDomElement.focus();
        }
    }

    componentWillUnmount() {
        this.cancelablePromise && this.cancelablePromise.cancel();
    }

    setSuggestions(suggestions: Array<User>) {
        this.setState({
            suggestions,
            highlightedSuggestion: undefined,
        });
    }

    resetSuggestions() {
        this.setState({
            suggestions: [],
            highlightedSuggestion: undefined,
        });
    }

    setSuggestionsError(message: string) {
        this.setState({
            suggestionsError: message,
        });
    }

    highlightSuggestion(suggestion: User) {
        this.setState({
            highlightedSuggestion: suggestion,
        });
        const element = this.suggestionElements.get(suggestion.id);
        element && element.focus();
    }

    search = (value: string) => getApi()
        .get('users', UserSearch.getSearchQueryParams(value))
        .then((response) => {
            const apiUsers = (response && response.users) || [];
            return apiUsers
                .map(au => ({
                    id: au.id,
                    username: au.userCredentials.username,
                    name: au.displayName,
                }));
        });

    handleInputChange = (value: string) => {
        this.setState({
            value,
        });

        this.cancelablePromise && this.cancelablePromise.cancel();

        if (value.length > 1) {
            const searchPromise = this.search(value);
            const cancelablePromise = makeCancelablePromise(searchPromise);
            this.cancelablePromise = cancelablePromise;
            cancelablePromise
                .promise
                .then((suggestions) => {
                    this.setSuggestions(suggestions);
                })
                .catch((error) => {
                    if (!error || !error.isCanceled) {
                        this.setSuggestionsError(i18n.t('suggestions could not be retrieved'));
                    }
                });
        } else {
            this.resetSuggestions();
        }
    }

    handleHighlightFirstSuggestion = () => {
        const { suggestions } = this.state;

        if (suggestions.length > 0) {
            this.highlightSuggestion(suggestions[0]);
        }
    }

    handleHighlightNextSuggestion = () => {
        const { suggestions, highlightedSuggestion } = this.state;
        const index = suggestions.findIndex(s => s === highlightedSuggestion);
        if (index < (suggestions.length - 1)) {
            this.highlightSuggestion(suggestions[index + 1]);
        }
    }

    handleHighlightPrevSuggestion = () => {
        const { suggestions, highlightedSuggestion } = this.state;
        const index = suggestions.findIndex(s => s === highlightedSuggestion);
        if (index > 0) {
            this.highlightSuggestion(suggestions[index - 1]);
        }
    }

    handleSuggestionRef = (ref: ?HTMLElement, user: User) => {
        if (!ref) {
            if (this.suggestionElements.has(user.id)) {
                this.suggestionElements.delete(user.id);
            }
        } else {
            this.suggestionElements.set(user.id, ref);
        }
    }

    handleInputDomRef = (element: ?HTMLElement) => {
        this.inputDomElement = element;
    }

    handleSuggestionSelect = (user: User) => {
        this.props.onSet(user);
    }

    renderInput() {
        const { value } = this.state;
        const { inputWrapperClasses } = this.props;

        return (
            <Input
                inputDomRef={this.handleInputDomRef}
                value={value}
                onUpdateValue={this.handleInputChange}
                onHighlightSuggestion={this.handleHighlightFirstSuggestion}
                inputWrapperClasses={inputWrapperClasses}
            />
        );
    }

    renderSuggestions() {
        const { suggestions, value, highlightedSuggestion } = this.state;

        return (
            <SearchSuggestions
                suggestionRef={this.handleSuggestionRef}
                suggestions={suggestions}
                query={value}
                highlighted={highlightedSuggestion}
                onHighlightNext={this.handleHighlightNextSuggestion}
                onHighlightPrev={this.handleHighlightPrevSuggestion}
                onSelect={this.handleSuggestionSelect}
            />
        );
    }

    render() {
        return (
            <div>
                {this.renderInput()}
                {this.renderSuggestions()}
            </div>
        );
    }
}

export default UserSearch;

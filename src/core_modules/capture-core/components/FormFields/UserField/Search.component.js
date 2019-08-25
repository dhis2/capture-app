// @flow
import * as React from 'react';
import uuid from 'uuid/v4';
import i18n from '@dhis2/d2-i18n';
import { makeCancelablePromise } from 'capture-core-utils';
import { getApi } from '../../../d2/d2Instance';
import Input from './Input.component';
import SearchSuggestions from './SearchSuggestions.component';
import SearchContext from './Search.context';
import type { User } from './types';

type Props = {
    onSet: (user: User) => void,
    inputWrapperClasses: Object,
    focusInputOnMount: boolean,
    exitBehaviour: 'selectBestChoice' | 'clear' | 'doNothing',
    inputPlaceholder?: ?string,
};

type State = {
    suggestions: Array<User>,
    searchValue: string,
    suggestionsError?: ?string,
    highlightedSuggestion?: ?User,
    inputKey: number,
};

const exitBehaviours = {
    SELECT_BEST_CHOICE: 'selectBestChoice',
    CLEAR: 'clear',
    DO_NOTHING: 'doNothing',
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
    domNames: Object;
    constructor(props: Props) {
        super(props);
        this.suggestionElements = new Map();
        this.state = {
            suggestions: [],
            searchValue: '',
            inputKey: 0,
        };

        this.domNames = {
            inputName: `userfield_input${uuid()}`,
            suggestionName: 'userfield_search_suggestion',
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

    clearInput() {
        const currentKey = this.state.inputKey;
        this.setState({
            inputKey: (currentKey + 1) % 2,
        });
    }

    clear() {
        this.clearInput();
        this.resetSuggestions();
    }

    setSuggestions(suggestions: Array<User>, searchValue: string) {
        this.setState({
            suggestions,
            highlightedSuggestion: undefined,
            searchValue,
        });
    }

    resetSuggestions() {
        this.setState({
            suggestions: [],
            highlightedSuggestion: undefined,
            searchValue: '',
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

    highlightInput() {
        this.setState({
            highlightedSuggestion: undefined,
        });
        this.inputDomElement && this.inputDomElement.focus();
    }

    resetHighlighted = () => {
        this.setState({
            highlightedSuggestion: undefined,
        });
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
        this.cancelablePromise && this.cancelablePromise.cancel();

        if (value.length > 1) {
            const searchPromise = this.search(value);
            const cancelablePromise = makeCancelablePromise(searchPromise);
            this.cancelablePromise = cancelablePromise;
            cancelablePromise
                .promise
                .then((suggestions) => {
                    this.setSuggestions(suggestions, value);
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

    handleSelectFirstSuggestion = () => {
        const { suggestions } = this.state;

        if (suggestions.length > 0) {
            this.props.onSet(suggestions[0]);
        }
    }

    // eslint-disable-next-line complexity
    handleExitSearchFromInput = () => {
        const { exitBehaviour } = this.props;
        const { suggestions } = this.state;

        switch (exitBehaviour) {
        case exitBehaviours.SELECT_BEST_CHOICE:
            if (suggestions.length > 0) {
                this.props.onSet(suggestions[0]);
            } else {
                this.clearInput();
                this.cancelablePromise && this.cancelablePromise.cancel();
            }
            break;
        case exitBehaviours.CLEAR:
            this.clear();
            this.cancelablePromise && this.cancelablePromise.cancel();
            break;
        case exitBehaviours.DO_NOTHING:
        default:
            break;
        }
    }

    handleExitSearchFromSuggestions = () => {
        const { exitBehaviour } = this.props;
        const { highlightedSuggestion } = this.state;

        switch (exitBehaviour) {
        case exitBehaviours.SELECT_BEST_CHOICE:
            // $FlowSuppress
            this.props.onSet(highlightedSuggestion);
            break;
        case exitBehaviours.CLEAR:
            this.clear();
            this.cancelablePromise && this.cancelablePromise.cancel();
            break;
        case exitBehaviours.DO_NOTHING:
        default:
            break;
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
        } else if (index === 0) {
            this.highlightInput();
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
        const { inputKey } = this.state;
        const { inputWrapperClasses, inputPlaceholder } = this.props;

        return (
            <Input
                key={inputKey}
                inputDomRef={this.handleInputDomRef}
                onUpdateValue={this.handleInputChange}
                onHighlightSuggestion={this.handleHighlightFirstSuggestion}
                onSelectSuggestion={this.handleSelectFirstSuggestion}
                onResetDisplayedHighlight={this.resetHighlighted}
                onExitSearch={this.handleExitSearchFromInput}
                inputWrapperClasses={inputWrapperClasses}
                placeholder={inputPlaceholder}
            />
        );
    }

    renderSuggestions() {
        const { suggestions, searchValue, highlightedSuggestion } = this.state;

        return (
            <SearchSuggestions
                suggestionRef={this.handleSuggestionRef}
                suggestions={suggestions}
                query={searchValue}
                highlighted={highlightedSuggestion}
                onHighlightNext={this.handleHighlightNextSuggestion}
                onHighlightPrev={this.handleHighlightPrevSuggestion}
                onSelect={this.handleSuggestionSelect}
                onExitSearch={this.handleExitSearchFromSuggestions}
            />
        );
    }

    render() {
        return (
            <div>
                <SearchContext.Provider
                    value={this.domNames}
                >
                    {this.renderInput()}
                    {this.renderSuggestions()}
                </SearchContext.Provider>
            </div>
        );
    }
}

export default UserSearch;
